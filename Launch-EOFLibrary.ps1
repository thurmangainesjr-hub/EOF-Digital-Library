# EOF Digital Library Launcher
# Starts the development server and opens the browser

$Host.UI.RawUI.WindowTitle = "EOF Digital Library"
Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "       EOF DIGITAL LIBRARY" -ForegroundColor White
Write-Host "       70,000+ Books & Adaptations" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

Set-Location "C:\Users\dhous\eof-digital-library\frontend"

# Check if already running
$port = 5174
$running = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($running) {
    Write-Host "EOF Library already running on port $port" -ForegroundColor Yellow
    Start-Process "http://localhost:$port"
} else {
    Write-Host "Starting EOF Digital Library..." -ForegroundColor Cyan
    Start-Process "http://localhost:$port"
    npm run dev
}
