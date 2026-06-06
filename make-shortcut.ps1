$desktop   = [Environment]::GetFolderPath('Desktop')
$target    = 'C:\Users\dhous\eof-digital-library\EOF Library.bat'
$icon      = 'C:\Users\dhous\eof-digital-library\frontend\public\eof-icon.ico'
$lnkPath   = "$desktop\EOF Library.lnk"

$shell    = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($lnkPath)

$shortcut.TargetPath       = $target
$shortcut.WorkingDirectory = 'C:\Users\dhous\eof-digital-library'
$shortcut.Description      = 'EOF Digital Library v2.0 — Netflix Edition. Starts backend + frontend and opens the app.'
$shortcut.IconLocation     = "$icon,0"
$shortcut.WindowStyle      = 7   # minimised (servers run quietly in background)
$shortcut.Save()

Write-Host ""
Write-Host "  Desktop shortcut updated: $lnkPath" -ForegroundColor Green
Write-Host "  Icon: $icon" -ForegroundColor DarkGray
Write-Host "  Target: $target" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Double-click 'EOF Library' on your desktop to launch." -ForegroundColor Yellow
Write-Host ""
