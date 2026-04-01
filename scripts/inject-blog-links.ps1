# inject-blog-links.ps1
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'

$pairs = @(
  @{ calc='hvac-static-pressure-calculator'; label='Blog: What Is Static Pressure in HVAC?'; url='/blog/what-is-static-pressure-hvac/' },
  @{ calc='hvac-cfm-calculator'; label='Blog: How to Calculate CFM Per Room'; url='/blog/how-to-calculate-cfm-per-room/' },
  @{ calc='hvac-duct-size-calculator'; label='Blog: Duct Sizing Explained (With Chart)'; url='/blog/duct-sizing-explained/' },
  @{ calc='hvac-load-calculator'; label='Blog: How Many Tons of AC Do I Need?'; url='/blog/how-many-tons-of-ac-do-i-need/' },
  @{ calc='hvac-bid-calculator'; label='Blog: HVAC Pricing Guide for Contractors'; url='/blog/hvac-pricing-guide-for-contractors/' },
  @{ calc='hvac-service-price-calculator'; label='Blog: HVAC Pricing Guide for Contractors'; url='/blog/hvac-pricing-guide-for-contractors/' },
  @{ calc='hvac-labor-cost-calculator'; label='Blog: HVAC Pricing Guide for Contractors'; url='/blog/hvac-pricing-guide-for-contractors/' },
  @{ calc='hvac-airflow-per-room-calculator'; label='Blog: How to Calculate CFM Per Room'; url='/blog/how-to-calculate-cfm-per-room/' },
  @{ calc='hvac-mini-split-sizing-calculator'; label='Blog: How Many Tons of AC Do I Need?'; url='/blog/how-many-tons-of-ac-do-i-need/' }
)

foreach ($p in $pairs) {
  $file = "$base\$($p.calc)\index.html"
  if (-not (Test-Path $file)) {
    Write-Host "NOT FOUND: $($p.calc)"
    continue
  }

  $content = Get-Content $file -Raw -Encoding UTF8

  if ($content -like ('*' + $p.url + '*')) {
    Write-Host "Skip (already linked): $($p.calc)"
    continue
  }

  # Build the blog link HTML snippet to inject right before </footer>
  $blogSnippet = @"
      <!-- Blog Article Link -->
      <div style="margin-bottom:16px; padding: 12px 16px; background: rgba(46,204,113,0.08); border: 1px solid rgba(46,204,113,0.25); border-radius: 8px;">
        <p style="margin:0; font-size: 14px; color: var(--text-light);">&#128214; <a href="$($p.url)" style="color: var(--primary); text-decoration: none; font-weight: 600;">$($p.label)</a></p>
      </div>
"@

  # Inject before </footer>
  $content = $content -replace '(?=\s*<footer id="mint-footer")', ($blogSnippet + "`r`n")
  Set-Content $file -Value $content -NoNewline -Encoding UTF8
  Write-Host "Updated: $($p.calc)"
}

Write-Host "All done."
