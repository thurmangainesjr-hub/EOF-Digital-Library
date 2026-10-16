"""
Image Agent — fetches scene images from Pexels (free, no key for basic searches)
and queues prompts for local ComfyUI generation when available.
User reviews and can swap any image before assembly.
"""

import os
import json
import httpx
import asyncio
from pathlib import Path

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "")
COMFYUI_URL = os.getenv("COMFYUI_URL", "http://127.0.0.1:8188")
OUTPUTS_DIR = Path(__file__).parent.parent / "outputs" / "images"
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

# Curated search terms that map well to hip-hop documentary scenes
SCENE_MOOD_QUERIES = {
    "cinematic":   ["cinematic city night", "dramatic skyline", "urban landscape"],
    "dramatic":    ["dark dramatic shadows", "moody street scene", "dramatic lighting"],
    "uplifting":   ["golden hour city", "crowd celebration", "sunrise skyline"],
    "reflective":  ["quiet street", "nostalgic neighborhood", "empty basketball court"],
    "tense":       ["urban tension", "city night", "dramatic shadows street"],
}


async def fetch_pexels_image(query: str, scene_num: int, job_id: str) -> dict:
    """Download one image from Pexels for a given scene query."""

    filename = f"scene_{scene_num:02d}.jpg"
    out_path = OUTPUTS_DIR / job_id / filename
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # If already downloaded, return it
    if out_path.exists():
        return {"scene_num": scene_num, "path": str(out_path), "source": "pexels", "query": query}

    headers = {}
    if PEXELS_API_KEY:
        headers["Authorization"] = PEXELS_API_KEY

    async with httpx.AsyncClient(timeout=30) as client:
        # Search Pexels
        search_url = "https://api.pexels.com/v1/search"
        params = {"query": query, "per_page": 5, "orientation": "landscape"}

        if PEXELS_API_KEY:
            resp = await client.get(search_url, headers=headers, params=params)
            if resp.status_code == 200:
                photos = resp.json().get("photos", [])
                if photos:
                    img_url = photos[0]["src"]["large2x"]
                    img_resp = await client.get(img_url)
                    if img_resp.status_code == 200:
                        out_path.write_bytes(img_resp.content)
                        return {
                            "scene_num": scene_num,
                            "path": str(out_path),
                            "source": "pexels",
                            "query": query,
                            "photographer": photos[0].get("photographer", ""),
                            "url": photos[0].get("url", ""),
                        }

    # Fallback: create a placeholder colored image using Pillow
    return await create_placeholder_image(scene_num, job_id, query)


async def create_placeholder_image(scene_num: int, job_id: str, label: str) -> dict:
    """Create a black placeholder image with scene label using Pillow."""
    from PIL import Image, ImageDraw, ImageFont
    import asyncio

    filename = f"scene_{scene_num:02d}.jpg"
    out_path = OUTPUTS_DIR / job_id / filename
    out_path.parent.mkdir(parents=True, exist_ok=True)

    def make_image():
        img = Image.new("RGB", (1920, 1080), color=(10, 10, 10))
        draw = ImageDraw.Draw(img)
        # Draw scene number
        draw.text((960, 480), f"Scene {scene_num}", fill=(16, 185, 129), anchor="mm")
        draw.text((960, 540), label[:60], fill=(100, 100, 100), anchor="mm")
        img.save(str(out_path), "JPEG", quality=95)

    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, make_image)

    return {
        "scene_num": scene_num,
        "path": str(out_path),
        "source": "placeholder",
        "query": label,
    }


async def fetch_all_scene_images(scenes: list, job_id: str) -> list:
    """Fetch images for all scenes concurrently."""

    tasks = []
    for scene in scenes:
        mood = scene.get("mood", "cinematic")
        # Use the visual description as the search query (simplified)
        query = scene.get("image_prompt", scene.get("visual_description", "documentary hip hop"))
        # Truncate to first 5 words for Pexels search
        query_short = " ".join(query.split()[:5])
        tasks.append(fetch_pexels_image(query_short, scene["scene_num"], job_id))

    results = await asyncio.gather(*tasks)
    return list(results)


def check_comfyui_available() -> bool:
    """Check if local ComfyUI is running."""
    try:
        r = httpx.get(f"{COMFYUI_URL}/system_stats", timeout=2)
        return r.status_code == 200
    except Exception:
        return False


async def queue_comfyui_generation(prompt: str, scene_num: int, job_id: str) -> dict:
    """Send image prompt to local ComfyUI if available."""
    if not check_comfyui_available():
        return {"status": "comfyui_offline", "scene_num": scene_num}

    # Basic ComfyUI API payload (txt2img workflow)
    payload = {
        "prompt": {
            "3": {
                "class_type": "KSampler",
                "inputs": {
                    "seed": scene_num * 1000,
                    "steps": 20,
                    "cfg": 7,
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "denoise": 1,
                    "model": ["4", 0],
                    "positive": ["6", 0],
                    "negative": ["7", 0],
                    "latent_image": ["5", 0],
                },
            },
            "4": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "v1-5-pruned-emaonly.ckpt"}},
            "5": {"class_type": "EmptyLatentImage", "inputs": {"batch_size": 1, "height": 1080, "width": 1920}},
            "6": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["4", 1]}},
            "7": {"class_type": "CLIPTextEncode", "inputs": {"text": "blurry, low quality, text, watermark", "clip": ["4", 1]}},
            "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
            "9": {"class_type": "SaveImage", "inputs": {"filename_prefix": f"job_{job_id}_scene_{scene_num:02d}", "images": ["8", 0]}},
        }
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(f"{COMFYUI_URL}/prompt", json=payload)
        if resp.status_code == 200:
            return {"status": "queued", "scene_num": scene_num, "prompt_id": resp.json().get("prompt_id")}

    return {"status": "failed", "scene_num": scene_num}
