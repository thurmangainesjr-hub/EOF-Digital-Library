# EOF DIGITAL LIBRARY - Launcher Script

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║       EOF DIGITAL LIBRARY                ║" -ForegroundColor Blue
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

$EOFPath = "C:\Users\dhous\eof-digital-library"

function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Start Backend
Write-Host "[1/2] Starting EOF Library Backend..." -ForegroundColor Yellow
if (Test-Port 3002) {
    Write-Host "      Backend already running on port 3002" -ForegroundColor Green
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$EOFPath\backend'; npm run dev" -WindowStyle Minimized
    Write-Host "      Backend started on port 3002" -ForegroundColor Green
}

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[2/2] Starting EOF Library Frontend..." -ForegroundColor Yellow
if (Test-Port 5174) {
    Write-Host "      Frontend already running on port 5174" -ForegroundColor Green
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$EOFPath\frontend'; npm run dev" -WindowStyle Minimized
    Write-Host "      Frontend started on port 5174" -ForegroundColor Green
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║      EOF DIGITAL LIBRARY IS READY        ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  Dashboard: http://localhost:5174        ║" -ForegroundColor White
Write-Host "║  API:       http://localhost:3002/api    ║" -ForegroundColor White
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 4
Start-Process "http://localhost:5174"

Write-Host "Press any key to exit launcher..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
