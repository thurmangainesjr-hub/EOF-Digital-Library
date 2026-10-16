"""
Voice Agent — generates narration audio from the script.
Priority order:
  1. ElevenLabs API (if key set) — best quality
  2. Piper TTS (if installed locally) — free, offline
  3. Windows SAPI TTS (always available) — fallback
"""

import os
import json
import asyncio
import subprocess
from pathlib import Path

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
OUTPUTS_DIR = Path(__file__).parent.parent / "outputs" / "voice"
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

# ElevenLabs voice IDs — documentary/narrator quality
VOICE_PRESETS = {
    "deep_male_narrator": "pNInz6obpgDQGcFmaJgB",   # Adam
    "warm_female_host":   "EXAVITQu4vr4xnSDxMaL",   # Bella
    "neutral_narrator":   "21m00Tcm4TlvDq8ikWAM",   # Rachel
}


async def generate_elevenlabs(text: str, voice_id: str, out_path: Path) -> dict:
    """Call ElevenLabs API to synthesize voice."""
    import httpx

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.6, "similarity_boost": 0.8},
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(url, headers=headers, json=payload)
        if resp.status_code == 200:
            out_path.write_bytes(resp.content)
            return {"status": "ok", "engine": "elevenlabs", "path": str(out_path)}
        return {"status": "error", "engine": "elevenlabs", "code": resp.status_code}


async def generate_piper(text: str, out_path: Path) -> dict:
    """Use local Piper TTS if installed."""
    piper_path = os.getenv("PIPER_PATH", "piper")

    proc = await asyncio.create_subprocess_exec(
        piper_path,
        "--model", "en_US-lessac-medium",
        "--output_file", str(out_path),
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await proc.communicate(input=text.encode())

    if proc.returncode == 0 and out_path.exists():
        return {"status": "ok", "engine": "piper", "path": str(out_path)}
    return {"status": "error", "engine": "piper", "stderr": stderr.decode()}


async def generate_windows_sapi(text: str, out_path: Path) -> dict:
    """Use Windows built-in SAPI TTS as last resort fallback."""
    wav_path = out_path.with_suffix(".wav")

    ps_script = f"""
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Male)
$synth.Rate = -1
$synth.SetOutputToWaveFile('{wav_path}')
$synth.Speak('{text.replace("'", " ")}')
$synth.Dispose()
"""
    proc = await asyncio.create_subprocess_exec(
        "powershell", "-Command", ps_script,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    await proc.communicate()

    if wav_path.exists():
        # Convert WAV to MP3 via FFmpeg
        ffmpeg_proc = await asyncio.create_subprocess_exec(
            "ffmpeg", "-y", "-i", str(wav_path), "-ab", "192k", str(out_path),
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL,
        )
        await ffmpeg_proc.communicate()
        wav_path.unlink(missing_ok=True)

        if out_path.exists():
            return {"status": "ok", "engine": "windows_sapi", "path": str(out_path)}

    return {"status": "error", "engine": "windows_sapi"}


async def generate_scene_voice(
    narration: str,
    scene_num: int,
    job_id: str,
    voice_preset: str = "deep_male_narrator",
) -> dict:
    """Generate voice for a single scene, trying engines in priority order."""
    out_path = OUTPUTS_DIR / job_id / f"scene_{scene_num:02d}.mp3"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if out_path.exists():
        return {"status": "ok", "engine": "cached", "path": str(out_path), "scene_num": scene_num}

    # 1. ElevenLabs
    if ELEVENLABS_API_KEY:
        voice_id = VOICE_PRESETS.get(voice_preset, VOICE_PRESETS["deep_male_narrator"])
        result = await generate_elevenlabs(narration, voice_id, out_path)
        if result["status"] == "ok":
            result["scene_num"] = scene_num
            return result

    # 2. Piper TTS
    try:
        result = await generate_piper(narration, out_path)
        if result["status"] == "ok":
            result["scene_num"] = scene_num
            return result
    except FileNotFoundError:
        pass

    # 3. Windows SAPI fallback
    result = await generate_windows_sapi(narration, out_path)
    result["scene_num"] = scene_num
    return result


async def generate_full_narration(scenes: list, job_id: str, voice_preset: str = "deep_male_narrator") -> list:
    """Generate voice for all scenes, then concatenate into one file."""
    tasks = [
        generate_scene_voice(s["narration"], s["scene_num"], job_id, voice_preset)
        for s in scenes
    ]
    results = await asyncio.gather(*tasks)

    # Concatenate all scene audio files into one narration track
    scene_files = [r["path"] for r in results if r.get("status") == "ok"]
    if scene_files:
        concat_path = OUTPUTS_DIR / job_id / "full_narration.mp3"
        file_list = OUTPUTS_DIR / job_id / "concat_list.txt"
        file_list.write_text("\n".join([f"file '{p}'" for p in scene_files]))

        proc = await asyncio.create_subprocess_exec(
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", str(file_list),
            "-c", "copy", str(concat_path),
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL,
        )
        await proc.communicate()

    return results
