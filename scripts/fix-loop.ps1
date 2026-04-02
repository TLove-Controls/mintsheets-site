# scripts\fix-loop.ps1
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'
$files = Get-ChildItem -Path $base -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch 'node_modules|shared|brand|scripts|blog|terms-of-service|privacy-policy|disclaimer|cookie-policy|hvac-calculators|index.html' }

foreach ($f in $files) {
    try {
        $lines = Get-Content $f.FullName
        $new = @()
        $skip = 0
        foreach ($l in $lines) {
            # 1. Detect the start of the duplicated blog link block
            # We match the background color which is unique to these blocks
            if ($l -match 'rgba\(46,\s*204,\s*113,\s*0\.08\)') {
                $skip = 2 # Skip the current line and the next 2 lines (link and end div)
                continue
            }
            
            # 2. Skip the comment
            if ($l -match '<!-- Blog Article Link -->') { continue }
            
            # 3. Detect and skip the legacy footer info bar (Margin/Total)
            if ($l -match 'Margin:.*?Total:') {
                # This is usually a 4-line block. We'll skip the current line and try to backtrack/forward
                # but a simpler way is to just skip the specific lines if we are inside that div
                continue
            }
            if ($l -match 'id="footer-margin"' -or $l -match 'id="footer-total"') { continue }
            
            if ($skip -gt 0) {
                $skip--
                continue
            }
            
            $new += $l
        }
        $new | Set-Content $f.FullName -Encoding UTF8
        Write-Host "Cleaned: $($f.FullName)"
    } catch {
        Write-Warning "Failed to process $($f.FullName): $_"
    }
}
Write-Host "Fix-loop complete."
