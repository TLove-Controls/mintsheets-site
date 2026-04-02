# test-inject.ps1
$f = "c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site\hvac-load-calculator\index.html"
$content = Get-Content $f -Raw -Encoding UTF8

$adTop = "<div class=`"ad-slot-top`" id=`"ad-top-1`"><div class=`"ad-label`">Advertisement</div></div>"
$content = $content -replace '</h1>', "</h1>`r`n          $adTop"

Set-Content $f -Value $content -NoNewline -Encoding UTF8
Write-Host "Test injection complete."
