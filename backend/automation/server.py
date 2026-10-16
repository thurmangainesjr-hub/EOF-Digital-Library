"""
EOF Faceless Videos — Automation Pipeline Server
FastAPI server that orchestrates the full Script → Image → Voice → Video pipeline.
Runs on port 8765. Frontend polls for job status.
"""

import os
import json
import uuid
import asyncio
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from agents.script_agent import generate_script
from agents.image_agent import fetch_all_scene_images
from agents.voice_agent import generate_full_narration
from agents.assembly_agent import assemble_draft, export_final

app = FastAPI(title="EOF Automation Pipeline", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

JOBS_DIR = Path(__file__).parent / "jobs"
JOBS_DIR.mkdir(exist_ok=True)

OUTPUTS_DIR = Path(__file__).parent / "outputs"
app.mount("/outputs", StaticFiles(directory=str(OUTPUTS_DIR)), name="outputs")


# ── Job helpers ────────────────────────────────────────────────────────────────

def load_job(job_id: str) -> dict:
    path = JOBS_DIR / f"{job_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    return json.loads(path.read_text())


def save_job(job: dict):
    path = JOBS_DIR / f"{job['id']}.json"
    job["updated_at"] = datetime.utcnow().isoformat()
    path.write_text(json.dumps(job, indent=2))


def new_job(topic: str, series: str, episode_num: int, voice_preset: str) -> dict:
    job = {
        "id": str(uuid.uuid4())[:8],
        "topic": topic,
        "series": series,
        "episode_num": episode_num,
        "voice_preset": voice_preset,
        "status": "pending",   # pending → scripting → images → voice → assembling → review → done
        "progress": 0,
        "steps": {
            "script":   {"status": "pending", "data": None},
            "images":   {"status": "pending", "data": None},
            "voice":    {"status": "pending", "data": None},
            "assembly": {"status": "pending", "data": None},
            "export":   {"status": "pending", "data": None},
        },
        "approvals": {
            "script": False,
            "images": False,
            "voice":  False,
            "draft":  False,
        },
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    save_job(job)
    return job


# ── Pipeline stages ────────────────────────────────────────────────────────────

async def run_script_stage(job_id: str):
    job = load_job(job_id)
    job["status"] = "scripting"
    job["steps"]["script"]["status"] = "running"
    job["progress"] = 10
    save_job(job)

    try:
        script = await asyncio.to_thread(
            generate_script,
            job["topic"],
            job["series"],
            job["episode_num"],
        )
        job["steps"]["script"]["status"] = "done"
        job["steps"]["script"]["data"] = script
        job["status"] = "awaiting_script_approval"
        job["progress"] = 20
    except Exception as e:
        job["steps"]["script"]["status"] = "error"
        job["steps"]["script"]["error"] = str(e)
        job["status"] = "error"

    save_job(job)


async def run_images_stage(job_id: str):
    job = load_job(job_id)
    scenes = job["steps"]["script"]["data"]["scenes"]

    job["status"] = "generating_images"
    job["steps"]["images"]["status"] = "running"
    job["progress"] = 35
    save_job(job)

    try:
        results = await fetch_all_scene_images(scenes, job_id)
        job["steps"]["images"]["status"] = "done"
        job["steps"]["images"]["data"] = results
        job["status"] = "awaiting_image_approval"
        job["progress"] = 50
    except Exception as e:
        job["steps"]["images"]["status"] = "error"
        job["steps"]["images"]["error"] = str(e)
        job["status"] = "error"

    save_job(job)


async def run_voice_stage(job_id: str):
    job = load_job(job_id)
    scenes = job["steps"]["script"]["data"]["scenes"]

    job["status"] = "generating_voice"
    job["steps"]["voice"]["status"] = "running"
    job["progress"] = 60
    save_job(job)

    try:
        results = await generate_full_narration(scenes, job_id, job.get("voice_preset", "deep_male_narrator"))
        job["steps"]["voice"]["status"] = "done"
        job["steps"]["voice"]["data"] = results
        job["status"] = "awaiting_voice_approval"
        job["progress"] = 72
    except Exception as e:
        job["steps"]["voice"]["status"] = "error"
        job["steps"]["voice"]["error"] = str(e)
        job["status"] = "error"

    save_job(job)


async def run_assembly_stage(job_id: str):
    job = load_job(job_id)
    scenes   = job["steps"]["script"]["data"]["scenes"]
    images   = job["steps"]["images"]["data"]
    voice    = job["steps"]["voice"]["data"]

    job["status"] = "assembling"
    job["steps"]["assembly"]["status"] = "running"
    job["progress"] = 80
    save_job(job)

    try:
        result = await assemble_draft(scenes, images, voice, job_id)
        job["steps"]["assembly"]["status"] = "done"
        job["steps"]["assembly"]["data"] = result
        job["status"] = "awaiting_draft_approval"
        job["progress"] = 90
    except Exception as e:
        job["steps"]["assembly"]["status"] = "error"
        job["steps"]["assembly"]["error"] = str(e)
        job["status"] = "error"

    save_job(job)


# ── API Routes ─────────────────────────────────────────────────────────────────

class StartRequest(BaseModel):
    topic: str
    series: str = "My First Love"
    episode_num: int = 1
    voice_preset: str = "deep_male_narrator"


@app.post("/api/pipeline/start")
async def start_pipeline(req: StartRequest, bg: BackgroundTasks):
    """Create a new pipeline job and kick off script generation."""
    job = new_job(req.topic, req.series, req.episode_num, req.voice_preset)
    bg.add_task(run_script_stage, job["id"])
    return {"job_id": job["id"], "status": job["status"]}


@app.get("/api/pipeline/{job_id}")
async def get_job(job_id: str):
    """Poll job status and step data."""
    return load_job(job_id)


@app.get("/api/pipeline")
async def list_jobs():
    """List all jobs, newest first."""
    jobs = []
    for f in sorted(JOBS_DIR.glob("*.json"), key=lambda x: x.stat().st_mtime, reverse=True):
        try:
            jobs.append(json.loads(f.read_text()))
        except Exception:
            pass
    return jobs


class ApproveRequest(BaseModel):
    step: str   # script | images | voice | draft
    edits: dict = {}


@app.post("/api/pipeline/{job_id}/approve")
async def approve_step(job_id: str, req: ApproveRequest, bg: BackgroundTasks):
    """
    User approves a step and the next stage kicks off automatically.
    Optional edits can override specific fields (e.g. swap an image path).
    """
    job = load_job(job_id)
    job["approvals"][req.step] = True

    # Apply any user edits
    if req.edits and req.step == "images":
        # User swapped an image: update the path in image data
        for scene_num_str, new_path in req.edits.items():
            for img in job["steps"]["images"]["data"]:
                if str(img["scene_num"]) == str(scene_num_str):
                    img["path"] = new_path
                    img["source"] = "user_override"

    if req.edits and req.step == "script":
        # Merge edited script fields
        for k, v in req.edits.items():
            job["steps"]["script"]["data"][k] = v

    save_job(job)

    # Auto-advance pipeline
    if req.step == "script":
        bg.add_task(run_images_stage, job_id)
    elif req.step == "images":
        bg.add_task(run_voice_stage, job_id)
    elif req.step == "voice":
        bg.add_task(run_assembly_stage, job_id)
    elif req.step == "draft":
        job["status"] = "done"
        job["progress"] = 100
        save_job(job)

    return {"job_id": job_id, "approved": req.step, "next": job["status"]}


class ExportRequest(BaseModel):
    platform: str = "youtube"


@app.post("/api/pipeline/{job_id}/export")
async def export_video(job_id: str, req: ExportRequest, bg: BackgroundTasks):
    """Export the approved draft for a specific platform."""
    job = load_job(job_id)
    draft_path = job["steps"]["assembly"]["data"]["draft_path"]
    bg.add_task(_do_export, job_id, draft_path, req.platform)
    return {"job_id": job_id, "platform": req.platform, "status": "exporting"}


async def _do_export(job_id: str, draft_path: str, platform: str):
    result = await export_final(draft_path, platform, job_id)
    job = load_job(job_id)
    job["steps"]["export"]["status"] = "done"
    job["steps"]["export"]["data"] = result
    save_job(job)


@app.delete("/api/pipeline/{job_id}")
async def delete_job(job_id: str):
    """Delete a job and its metadata."""
    path = JOBS_DIR / f"{job_id}.json"
    path.unlink(missing_ok=True)
    return {"deleted": job_id}


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "anthropic_key": bool(os.getenv("ANTHROPIC_API_KEY")),
        "elevenlabs_key": bool(os.getenv("ELEVENLABS_API_KEY")),
        "pexels_key": bool(os.getenv("PEXELS_API_KEY")),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8765, reload=True)
