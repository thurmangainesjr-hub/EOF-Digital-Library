@echo off
title EOF Digital Library
color 0A

echo.
echo  ███████╗ ██████╗ ███████╗
echo  ██╔════╝██╔═══██╗██╔════╝
echo  █████╗  ██║   ██║█████╗
echo  ██╔══╝  ██║   ██║██╔══╝
echo  ███████╗╚██████╔╝██║
echo  ╚══════╝ ╚═════╝ ╚═╝
echo.
echo  Digital Library — Launcher
echo  ═══════════════════════════
echo.

REM ── Kill any leftover processes on our ports ──────────────────────────────
echo  Clearing ports 3002 and 5174...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3002 " 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5174 " 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM ── Start backend ─────────────────────────────────────────────────────────
echo  Starting backend API  (port 3002)...
start "EOF Backend" /min cmd /c "cd /d %~dp0backend && npm run dev"

REM ── Start frontend ────────────────────────────────────────────────────────
echo  Starting frontend     (port 5174)...
start "EOF Frontend" /min cmd /c "cd /d %~dp0frontend && npm run dev"

REM ── Wait for frontend to boot ─────────────────────────────────────────────
echo  Waiting for servers to start...
timeout /t 5 /nobreak >nul

REM ── Open in Chrome as standalone app window ───────────────────────────────
echo  Opening EOF Library...
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
set URL=http://localhost:5174

if exist %CHROME% (
    start "" %CHROME% --app=%URL% --window-size=1280,900 --window-position=80,40 ^
        --app-menu-bar-enabled ^
        --no-first-run ^
        --disable-extensions
) else (
    REM Fallback: open in default browser
    start "" %URL%
)

echo.
echo  ✓ EOF Library is running!
echo  ─────────────────────────
echo    Frontend : http://localhost:5174
echo    Backend  : http://localhost:3002
echo    Preview  : http://localhost:5174/preview
echo.
echo  Close this window to STOP all servers.
echo.

REM ── Keep window open — closing it will allow servers to keep running ──────
pause >nul
