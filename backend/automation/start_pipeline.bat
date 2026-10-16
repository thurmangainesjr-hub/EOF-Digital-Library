@echo off
echo.
echo  EOF Faceless Videos — Automation Pipeline Server
echo  ================================================
echo.

REM Check for required API keys
if "%ANTHROPIC_API_KEY%"=="" (
    echo  WARNING: ANTHROPIC_API_KEY not set
    echo  Set it with: set ANTHROPIC_API_KEY=your_key_here
    echo.
)
if "%ELEVENLABS_API_KEY%"=="" (
    echo  INFO: ELEVENLABS_API_KEY not set — will use Windows TTS fallback
    echo.
)
if "%PEXELS_API_KEY%"=="" (
    echo  INFO: PEXELS_API_KEY not set — will use placeholder images
    echo.
)

echo  Starting server on http://localhost:8765
echo  Press Ctrl+C to stop
echo.

cd /d "%~dp0"
python -m uvicorn server:app --host 0.0.0.0 --port 8765 --reload

pause
