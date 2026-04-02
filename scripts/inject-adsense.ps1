# inject-adsense.ps1
# Global injection of Google AdSense script into all monetizable pages

$adsenseScript = '  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7177850851908341"
     crossorigin="anonymous"></script>'

$files = Get-ChildItem -Recurse -Filter index.html | Where-Object { 
    $_.FullName -notmatch "node_modules" -and
    $_.FullName -notmatch "privacy-policy" -and 
    $_.FullName -notmatch "terms-of-service" -and 
    $_.FullName -notmatch "disclaimer" -and 
    $_.FullName -notmatch "cookie-policy" -and
    $_.FullName -notmatch "contact" -and
    $_.FullName -notmatch "thank-you"
}

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if already present
    if ($content -notmatch "pagead2.googlesyndication.com") {
        # Inject after charset meta
        if ($content -match '<meta charset="UTF-8"\s*/?>') {
            $content = $content -replace '(<meta charset="UTF-8"\s*/?>)', "$1`n`n$adsenseScript"
        } elseif ($content -match '<head>') {
            # Fallback to right after head
            $content = $content -replace '(<head>)', "$1`n$adsenseScript"
        }
        
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Injected into: $($file.FullName)"
    } else {
        Write-Host "Already present in: $($file.FullName)"
    }
}

Write-Host "AdSense injection complete."
