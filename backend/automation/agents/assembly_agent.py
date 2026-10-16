"""
Assembly Agent — uses FFmpeg to stitch images + voice + music into a draft video.
Applies Ken Burns motion effect to all still images.
User reviews the draft before final export.
"""

import asyncio
import json
from pathlib import Path

OUTPUTS_DIR = Path(__file__).parent.parent / "outputs"
VIDEOS_DIR = OUTPUTS_DIR / "videos"
VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

# Ken Burns zoom parameters: slow creep zoom for cinematic look
KB_ZOOM_START = 1.0
KB_ZOOM_END = 1.05


async def create_ken_burns_clip(image_path: str, duration: int, scene_num: int, job_id: str) -> dict:
    """Turn a still image into a cinematic motion clip using FFmpeg zoompan."""

    out_path = VIDEOS_DIR / job_id / f"clip_{scene_num:02d}.mp4"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if out_path.exists():
        return {"scene_num": scene_num, "path": str(out_path)}

    fps = 30
    frames = duration * fps

    # zoompan: slow zoom + slight pan for life
    zoom_filter = (
        f"zoompan=z='min(zoom+0.0015,1.5)':d={frames}:"
        f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps={fps}"
    )
    vf = f"{zoom_filter},format=yuv420p"

    proc = await asyncio.create_subprocess_exec(
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", image_path,
        "-t", str(duration),
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "20",
        "-r", str(fps),
        str(out_path),
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.PIPE,
    )
    _, stderr = await proc.communicate()

    if proc.returncode == 0:
        return {"scene_num": scene_num, "path": str(out_path), "duration": duration}

    return {"scene_num": scene_num, "error": stderr.decode()[-200:]}


async def concatenate_clips(clip_paths: list, job_id: str) -> str:
    """Concatenate all scene video clips into one silent video."""

    concat_list = VIDEOS_DIR / job_id / "clips_list.txt"
    concat_list.parent.mkdir(parents=True, exist_ok=True)
    concat_list.write_text("\n".join([f"file '{p}'" for p in clip_paths]))

    out_path = VIDEOS_DIR / job_id / "video_silent.mp4"

    proc = await asyncio.create_subprocess_exec(
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy",
        str(out_path),
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.DEVNULL,
    )
    await proc.communicate()
    return str(out_path)


async def mix_audio(video_path: str, narration_path: str, music_path: str | None, job_id: str) -> str:
    """Mix narration + optional background music into the video."""

    out_path = VIDEOS_DIR / job_id / "video_with_audio.mp4"

    if music_path and Path(music_path).exists():
        audio_filter = (
            "[1:a]volume=1.0[voice];"
            "[2:a]volume=0.15,afade=t=out:st=0:d=5[music];"
            "[voice][music]amix=inputs=2:duration=first[audio]"
        )
        proc = await asyncio.create_subprocess_exec(
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", narration_path,
            "-i", music_path,
            "-filter_complex", audio_filter,
            "-map", "0:v",
            "-map", "[audio]",
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            str(out_path),
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL,
        )
    else:
        proc = await asyncio.create_subprocess_exec(
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", narration_path,
            "-map", "0:v",
            "-map", "1:a",
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            str(out_path),
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL,
        )

    await proc.communicate()
    return str(out_path)


async def add_captions(video_path: str, srt_path: str, job_id: str) -> str:
    """Burn captions into the video using FFmpeg subtitles filter."""

    out_path = VIDEOS_DIR / job_id / "video_captioned.mp4"

    # Caption style: bold white text, centered bottom
    subtitle_style = (
        "FontName=Arial,FontSize=22,Bold=1,PrimaryColour=&HFFFFFF,"
        "OutlineColour=&H000000,Outline=2,Shadow=1,Alignment=2,"
        "MarginV=50"
    )

    proc = await asyncio.create_subprocess_exec(
        "ffmpeg", "-y",
        "-i", video_path,
        "-vf", f"subtitles='{srt_path}':force_style='{subtitle_style}'",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "20",
        "-c:a", "copy",
        str(out_path),
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.DEVNULL,
    )
    await proc.communicate()
    return str(out_path)


async def assemble_draft(scenes: list, image_results: list, voice_results: list, job_id: str) -> dict:
    """
    Full assembly pipeline:
    1. Ken Burns each image → clip
    2. Concat clips → silent video
    3. Mix narration audio
    4. Return draft video path for user review
    """

    image_map = {r["scene_num"]: r["path"] for r in image_results if "path" in r}
    voice_map = {r["scene_num"]: r["path"] for r in voice_results if r.get("status") == "ok"}

    # Step 1: Create Ken Burns clips
    kb_tasks = [
        create_ken_burns_clip(
            image_map[s["scene_num"]],
            s.get("duration_seconds", 30),
            s["scene_num"],
            job_id,
        )
        for s in scenes
        if s["scene_num"] in image_map
    ]
    clip_results = await asyncio.gather(*kb_tasks)
    clip_paths = [r["path"] for r in clip_results if "path" in r]

    if not clip_paths:
        return {"status": "error", "message": "No clips generated"}

    # Step 2: Concat clips
    silent_video = await concatenate_clips(clip_paths, job_id)

    # Step 3: Mix audio (use full_narration.mp3 if exists)
    narration_path = str(Path(__file__).parent.parent / "outputs" / "voice" / job_id / "full_narration.mp3")
    if not Path(narration_path).exists() and voice_map:
        # Fall back to first scene voice
        narration_path = list(voice_map.values())[0]

    draft_path = silent_video
    if Path(narration_path).exists():
        draft_path = await mix_audio(silent_video, narration_path, None, job_id)

    return {
        "status": "ok",
        "draft_path": draft_path,
        "clip_count": len(clip_paths),
        "job_id": job_id,
    }


async def export_final(draft_path: str, platform: str, job_id: str) -> dict:
    """Export final video with platform-specific settings."""

    PLATFORM_SETTINGS = {
        "youtube":        {"w": 1920, "h": 1080, "fps": 30, "crf": 18, "suffix": "yt"},
        "youtube_shorts": {"w": 1080, "h": 1920, "fps": 60, "crf": 18, "suffix": "shorts"},
        "tiktok":         {"w": 1080, "h": 1920, "fps": 60, "crf": 20, "suffix": "tiktok"},
        "instagram":      {"w": 1080, "h": 1920, "fps": 30, "crf": 20, "suffix": "ig"},
    }

    s = PLATFORM_SETTINGS.get(platform, PLATFORM_SETTINGS["youtube"])
    out_path = VIDEOS_DIR / job_id / f"final_{s['suffix']}.mp4"

    vf = f"scale={s['w']}:{s['h']}:force_original_aspect_ratio=decrease,pad={s['w']}:{s['h']}:(ow-iw)/2:(oh-ih)/2"

    proc = await asyncio.create_subprocess_exec(
        "ffmpeg", "-y",
        "-i", draft_path,
        "-vf", vf,
        "-r", str(s["fps"]),
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", str(s["crf"]),
        "-c:a", "aac",
        "-b:a", "256k",
        str(out_path),
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.DEVNULL,
    )
    await proc.communicate()

    return {
        "status": "ok" if out_path.exists() else "error",
        "platform": platform,
        "path": str(out_path),
        "settings": s,
    }
