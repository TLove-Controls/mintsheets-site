# sanitize-phase6.ps1
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'
$files = Get-ChildItem -Path $base -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch 'node_modules|shared|brand|scripts|blog|terms-of-service|privacy-policy|disclaimer|cookie-policy|hvac-calculators|index.html' }

foreach ($f in $files) {
    try {
        $content = Get-Content $f.FullName -Raw -Encoding UTF8
        
        # 1. Remove all duplicated blog link blocks
        # Using a regex that is flexible with spaces and includes the specific background color
        $blogPattern = '(?s)<div style="margin-bottom:16px;.*?background:\s*rgba\(46,\s*204,\s*113,\s*0\.08\);.*?</div>'
        $content = [regex]::Replace($content, $blogPattern, "")

        # 2. Remove the matching comments
        $content = $content -replace '<!-- Blog Article Link -->', ""
        
        # 3. Remove legacy info text (Margin/Total in footer)
        $infoPattern = '(?s)<div style="font-size:12px;color:var\(--muted\);">.*?Margin:.*?Total:.*?</div>'
        $content = [regex]::Replace($content, $infoPattern, "")

        # 4. Remove any previous Phase 6 attempts
        $content = $content -replace '<div class="ad-slot-top".*?</div>', ""
        $content = $content -replace '<div class="ad-slot-mid".*?</div>', ""
        $content = $content -replace '<div class="ad-slot-bottom".*?</div>', ""
        $content = $content -replace '<script src="\.\./shared/js/mint-core\.js.*?</script>', ""
        $content = $content -replace '(?s)<!-- Phase 6 monetization & workflow -->.*?</div>\s*</div>', ""

        # Normalize extra whitespace
        $content = $content -replace "(`r?`n){3,}", "`r`n`r`n"
        $content = $content.Trim() + "`r`n"

        Set-Content $f.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Sanitized: $($f.Directory.Name)"
    } catch {
        Write-Error "Failed to sanitize $($f.FullName): $_"
    }
}
Write-Host "Sanitization complete."
