# update-footers.ps1
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'
$files = Get-ChildItem -Path $base -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch 'scripts' }

foreach ($f in $files) {
  $content = Get-Content $f.FullName -Raw -Encoding UTF8
  
  # Check if "All HVAC Calculators" link already exists in footer
  if ($content -notlike '*/hvac-calculators/*') {
    # Find the end of the calculator grid in the footer
    # We look for the closing </div> of the grid inside the mint-footer
    $footerGridRegex = '(?s)(<footer id="mint-footer".*?<div style="display: grid;[^>]*>.*?)(</div>)'
    
    $linkHtml = "`r`n          <a href=`"/hvac-calculators/`" style=`"color: var(--primary); text-decoration: none; font-size: 14px; font-weight: 700; grid-column: 1 / -1; margin-top: 10px;` font-family: sans-serif;`>View All HVAC Calculators →</a>"
    
    if ($content -match $footerGridRegex) {
       $content = [regex]::Replace($content, $footerGridRegex, "$1$linkHtml`r`n        $2")
       Set-Content $f.FullName -Value $content -NoNewline -Encoding UTF8
       Write-Host "Updated Footer: $($f.FullName.Replace($base, ''))"
    }
  } else {
    Write-Host "Skip Footer (already linked): $($f.FullName.Replace($base, ''))"
  }
}

Write-Host "Footer update complete."
