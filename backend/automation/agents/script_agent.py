"""
Script Agent — uses Claude API to generate a full documentary script
as structured JSON that the pipeline can process scene-by-scene.
"""

import anthropic
import json
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


SCRIPT_SYSTEM = """You are an expert documentary scriptwriter specializing in hip-hop history and cultural storytelling.
Write in the style of VH1 Behind The Music meets Netflix documentary — cinematic, emotionally resonant, factual.
You write scripts for FACELESS videos: no on-camera host, purely narration over visuals.
Always return valid JSON only. No markdown. No extra text."""

SCRIPT_PROMPT = """Write a complete faceless documentary script for YouTube.

Topic: {topic}
Series: {series}
Episode Number: {episode_num}
Target Length: {target_minutes} minutes
Tone: {tone}

Return this exact JSON structure:
{{
  "title": "Episode title (compelling, YouTube-optimized)",
  "description": "YouTube description (150 words, SEO-rich)",
  "hook": "Opening line spoken by narrator (15 seconds)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "thumbnail_text": "4 words max for thumbnail overlay",
  "scenes": [
    {{
      "scene_num": 1,
      "duration_seconds": 30,
      "narration": "Exact words the narrator speaks for this scene",
      "visual_description": "What should be shown on screen (for image generation)",
      "image_prompt": "Detailed Stable Diffusion / DALL-E prompt for this scene",
      "mood": "cinematic|dramatic|uplifting|reflective|tense",
      "music_note": "Background music suggestion for this scene"
    }}
  ],
  "cta": "Call to action spoken at the end (15 seconds)",
  "total_estimated_minutes": 7
}}

Include 8-12 scenes. Make each scene 20-45 seconds of narration.
Image prompts should be detailed, cinematic, and documentary-style."""


def generate_script(
    topic: str,
    series: str = "My First Love",
    episode_num: int = 1,
    target_minutes: int = 7,
    tone: str = "documentary, cinematic, VH1 style",
) -> dict:
    """Call Claude API and return structured script JSON."""

    prompt = SCRIPT_PROMPT.format(
        topic=topic,
        series=series,
        episode_num=episode_num,
        target_minutes=target_minutes,
        tone=tone,
    )

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=SCRIPT_SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()

    # Strip any accidental markdown code fences
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip().rstrip("```").strip()

    script = json.loads(raw)
    script["topic"] = topic
    script["series"] = series
    script["episode_num"] = episode_num
    return script


def generate_image_prompts_for_scenes(scenes: list) -> list:
    """Refine image prompts for each scene using Claude."""

    scenes_text = "\n".join(
        [f"Scene {s['scene_num']}: {s['visual_description']}" for s in scenes]
    )

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": f"""Rewrite these scene descriptions as detailed image generation prompts.
Each prompt should be 50-80 words, cinematic, documentary-style.
Use: film grain, 16mm aesthetic, golden hour, dramatic lighting, high contrast as appropriate.

Scenes:
{scenes_text}

Return JSON array: [{{"scene_num": 1, "prompt": "..."}}]
No markdown. Valid JSON only.""",
            }
        ],
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip().rstrip("```").strip()

    return json.loads(raw)
