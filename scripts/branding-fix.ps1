# branding-fix.ps1
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'
$files = Get-ChildItem -Path $base -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch 'node_modules' }

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    
    # 1. Replace placeholder branding names
    $content = $content -replace 'Your HVAC Co\.', 'MintSheets'
    $content = $content -replace 'YourHVACCo', 'MintSheets'
    
    # 2. Update footer trust text
    # Finding the specific copyright line we added in Phase 5
    $oldFooterText = '&copy; 2026 MintSheets. Free HVAC technical tools.'
    $newFooterText = '&copy; 2026 MintSheets. Free professional tools based on ACCA Manual standards. Used by HVAC technicians & contractors.'
    
    if ($content -contains $oldFooterText) {
        $content = $content -replace [regex]::Escape($oldFooterText), $newFooterText
        Write-Host "Updated Trust Signals: $($f.FullName.Replace($base, ''))"
    }

    Set-Content $f.FullName -Value $content -NoNewline -Encoding UTF8
}

Write-Host "Branding and Trust Signal update complete."
