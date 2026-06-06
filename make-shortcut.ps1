$desktop   = [Environment]::GetFolderPath('Desktop')
$target    = 'C:\Users\dhous\eof-digital-library\EOF Library.bat'
$icon      = 'C:\Users\dhous\eof-digital-library\frontend\public\eof-icon.ico'
$lnkPath   = "$desktop\EOF Library.lnk"

$shell     = New-Object -ComObject WScript.Shell
$shortcut  = $shell.CreateShortcut($lnkPath)

$shortcut.TargetPath       = $target
$shortcut.WorkingDirectory = 'C:\Users\dhous\eof-digital-library'
$shortcut.Description      = 'EOF Digital Library — Launch & Test'
$shortcut.IconLocation     = "$icon,0"
$shortcut.WindowStyle      = 7   # minimised (servers run in background)
$shortcut.Save()

Write-Host "Desktop shortcut created: $lnkPath"
