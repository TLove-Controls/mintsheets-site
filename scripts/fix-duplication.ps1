# fix-duplication.ps1
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'
$files = Get-ChildItem -Path $base -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch 'node_modules|shared|brand|scripts|blog|terms-of-service|privacy-policy|disclaimer|cookie-policy|hvac-calculators|index.html' }

foreach ($f in $files) {
    $lines = Get-Content $f.FullName
    $newLines = @()
    $skip = 0
    foreach ($l in $lines) {
        # Check if the line is the start of the duplicated blog div
        if ($l -match 'margin-bottom:16px; padding: 12px 16px; background: rgba' -and $l -match '0\.08') {
            $skip = 3 # Skip the div start, the p/a tag, and the div end
            continue
        }
        # Skip the comment if present
        if ($l -match '<!-- Blog Article Link -->') {
            continue
        }
        
        if ($skip -eq 0) {
            $newLines += $l
        } else {
            $skip--
        }
    }
    $newLines | Set-Content $f.FullName -Encoding UTF8
    Write-Host "Cleaned duplication in: $($f.Directory.Name)"
}
Write-Host "Duplication cleanup complete."
