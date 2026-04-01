# inject-breadcrumbs.ps1
# Adds breadcrumb navigation to all calculator pages (not blog pages which already have them)
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'

$calcs = @(
  @{ dir='hvac-static-pressure-calculator'; name='Static Pressure Calculator' },
  @{ dir='hvac-cfm-calculator'; name='CFM Calculator' },
  @{ dir='hvac-duct-size-calculator'; name='Duct Size Calculator' },
  @{ dir='hvac-load-calculator'; name='HVAC Load Calculator' },
  @{ dir='hvac-bid-calculator'; name='HVAC Bid Calculator' },
  @{ dir='hvac-service-price-calculator'; name='Service Price Calculator' },
  @{ dir='hvac-labor-cost-calculator'; name='Labor Burden Calculator' },
  @{ dir='hvac-airflow-per-room-calculator'; name='Airflow Per Room Calculator' },
  @{ dir='hvac-mini-split-sizing-calculator'; name='Mini Split Sizing Calculator' },
  @{ dir='hvac-flow-rate-calculator'; name='Flow Rate Calculator' },
  @{ dir='hvac-profit-margin-calculator'; name='Profit Margin Calculator' },
  @{ dir='hvac-energy-savings-calculator'; name='Energy Savings Calculator' },
  @{ dir='hvac-service-markup-calculator'; name='Service Markup Calculator' },
  @{ dir='hvac-business-valuation-calculator'; name='Business Valuation Calculator' }
)

$breadcrumbStyle = @"
  <style>
  .breadcrumb-bar{background:rgba(11,28,53,0.7);border-bottom:1px solid #1E3452;padding:8px 0;font-size:13px;}
  .breadcrumb-bar .container{display:flex;align-items:center;gap:6px;color:#7A98B8;flex-wrap:wrap;}
  .breadcrumb-bar a{color:var(--primary);text-decoration:none;}
  .breadcrumb-bar a:hover{text-decoration:underline;}
  .breadcrumb-bar span{color:#4A6080;}
  </style>
"@

foreach ($c in $calcs) {
  $file = "$base\$($c.dir)\index.html"
  if (-not (Test-Path $file)) {
    Write-Host "NOT FOUND: $($c.dir)"
    continue
  }

  $content = Get-Content $file -Raw -Encoding UTF8

  if ($content -like '*breadcrumb-bar*') {
    Write-Host "Skip (already has breadcrumb): $($c.dir)"
    continue
  }

  # Build schema JSON
  $schema = @"
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://mintsheets.com/"},{"@type":"ListItem","position":2,"name":"HVAC Calculators","item":"https://mintsheets.com/hvac-calculators/"},{"@type":"ListItem","position":3,"name":"$($c.name)","item":"https://mintsheets.com/$($c.dir)/"}]}
</script>
"@

  # Build the HTML bar
  $breadcrumbBar = @"
  <div class="breadcrumb-bar">
    <div class="container">
      <a href="/">Home</a><span>›</span>
      <a href="/hvac-calculators/">HVAC Calculators</a><span>›</span>
      $($c.name)
    </div>
  </div>
"@

  # Inject style before </head>
  $content = $content -replace '</head>', ($breadcrumbStyle + "`r`n" + $schema + "`r`n</head>")

  # Inject breadcrumb bar right after opening <main> or <body> if no <main>
  if ($content -like '*<main>*') {
    $content = $content -replace '<main>', ("<main>`r`n" + $breadcrumbBar)
  }

  Set-Content $file -Value $content -NoNewline -Encoding UTF8
  Write-Host "Updated breadcrumb: $($c.dir)"
}

Write-Host "Breadcrumb injection complete."
