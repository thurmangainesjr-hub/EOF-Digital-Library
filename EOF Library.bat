@echo off
title EOF Digital Library
color 0A
chcp 65001 >nul 2>&1

echo.
echo  ███████╗ ██████╗ ███████╗
echo  ██╔════╝██╔═══██╗██╔════╝
echo  █████╗  ██║   ██║█████╗
echo  ██╔══╝  ██║   ██║██╔══╝
echo  ███████╗╚██████╔╝██║
echo  ╚══════╝ ╚═════╝ ╚═╝
echo.
echo  Digital Library  v2.0  — Netflix Edition
echo  ═══════════════════════════════════════════
echo.

REM ── Kill any leftover processes on our ports ──────────────────────────────
echo  [1/4] Clearing ports 3002 and 5174...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3002 " 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5174 " 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo      Done.

REM ── Start backend ─────────────────────────────────────────────────────────
echo  [2/4] Starting backend API  (port 3002)...
start "EOF Backend" /min cmd /c "cd /d %~dp0backend && npm run dev 2>&1"

REM ── Start frontend ────────────────────────────────────────────────────────
echo  [3/4] Starting frontend     (port 5174)...
start "EOF Frontend" /min cmd /c "cd /d %~dp0frontend && npm run dev 2>&1"

REM ── Wait for Vite to be ready (poll instead of blind sleep) ───────────────
echo  [4/4] Waiting for Vite to be ready...
set /a TRIES=0
:WAIT_LOOP
timeout /t 1 /nobreak >nul
set /a TRIES+=1
curl -s -o nul -w "%%{http_code}" http://localhost:5174 2>nul | findstr "200 304" >nul 2>&1
if %errorlevel%==0 goto READY
if %TRIES% GEQ 20 goto TIMEOUT
goto WAIT_LOOP

:TIMEOUT
echo      (Timed out waiting — opening anyway)
goto OPEN

:READY
echo      Vite is ready!

:OPEN
REM ── Detect browser and open as standalone app ─────────────────────────────
set URL=http://localhost:5174

set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
set CHROME_ALT="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
set EDGE="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
set EDGE_ALT="C:\Program Files\Microsoft\Edge\Application\msedge.exe"

if exist %CHROME% (
    echo  Opening in Chrome standalone mode...
    start "" %CHROME% ^
        --app=%URL% ^
        --window-size=1440,900 ^
        --window-position=60,30 ^
        --no-first-run ^
        --disable-extensions ^
        --disable-sync ^
        --hide-crash-restore-bubble
    goto DONE
)
if exist %CHROME_ALT% (
    echo  Opening in Chrome (x86) standalone mode...
    start "" %CHROME_ALT% ^
        --app=%URL% ^
        --window-size=1440,900 ^
        --window-position=60,30 ^
        --no-first-run ^
        --disable-extensions
    goto DONE
)
if exist %EDGE% (
    echo  Chrome not found — opening in Edge standalone mode...
    start "" %EDGE% ^
        --app=%URL% ^
        --window-size=1440,900 ^
        --window-position=60,30 ^
        --no-first-run
    goto DONE
)
if exist %EDGE_ALT% (
    echo  Opening in Edge (alt path) standalone mode...
    start "" %EDGE_ALT% ^
        --app=%URL% ^
        --window-size=1440,900 ^
        --window-position=60,30 ^
        --no-first-run
    goto DONE
)
echo  No Chrome/Edge found — opening in default browser...
start "" %URL%

:DONE
echo.
echo  ╔═══════════════════════════════════════════════╗
echo  ║   EOF Digital Library is LIVE                 ║
echo  ╠═══════════════════════════════════════════════╣
echo  ║                                               ║
echo  ║  App         http://localhost:5174            ║
echo  ║  API         http://localhost:3002            ║
echo  ║                                               ║
echo  ╠══ Pages ══════════════════════════════════════╣
echo  ║  Dashboard   /                                ║
echo  ║  Library     /library       (Netflix UI)      ║
echo  ║  Bookshelves /bookshelves                     ║
echo  ║  Story Time  /story-time                      ║
echo  ║  Gutenberg   /gutenberg     (70k+ books)      ║
echo  ║  Command     /command-center                  ║
echo  ║  Thermal     /thermal       (system monitor)  ║
echo  ║  Test Lab    /preview       (app store check) ║
echo  ║                                               ║
echo  ╠══ Actions ════════════════════════════════════╣
echo  ║  Upload Book — click gold button on Dashboard ║
echo  ║  Browse      — /library has 80+ books         ║
echo  ║                                               ║
echo  ╚═══════════════════════════════════════════════╝
echo.
echo  Press any key to STOP all servers and exit.
echo.

pause >nul

REM ── Shutdown ──────────────────────────────────────────────────────────────
echo  Shutting down servers...
taskkill /FI "WINDOWTITLE eq EOF Backend"  /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq EOF Frontend" /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3002 " 2^>nul') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5174 " 2^>nul') do taskkill /PID %%a /F >nul 2>&1
echo  Servers stopped. Goodbye.
timeout /t 2 /nobreak >nul
