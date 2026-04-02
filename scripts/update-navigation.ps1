# update-navigation.ps1
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'

# Get all html files
$files = Get-ChildItem -Path $base -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch 'scripts' }

foreach ($f in $files) {
  $content = Get-Content $f.FullName -Raw -Encoding UTF8
  
  # 1. Update Desktop Nav
  # Look for the nav-links block and replace it
  $desktopOld = '(?s)<nav class="nav-links">.*?</nav>'
  $desktopNew = @"
        <nav class="nav-links">
          <a href="/">Calculators</a>
          <a href="/blog/">Blog</a>
          <a href="/#troubleshooting-checklist">Free Guide</a>
          <a href="mailto:support@mintsheets.com">Support</a>
        </nav>
"@
  $content = [regex]::Replace($content, $desktopOld, $desktopNew)

  # 2. Update Mobile Nav Links
  $mobileOld = '(?s)<ul class="mobile-nav-links">.*?</ul>'
  $mobileNew = @"
    <ul class="mobile-nav-links">
      <li><a href="/"><span class="nav-icon">&#x1F9EE;</span> Calculators</a></li>
      <li><a href="/blog/"><span class="nav-icon">&#x1F4DD;</span> Blog</a></li>
      <li><a href="/#troubleshooting-checklist"><span class="nav-icon">&#x1F4CB;</span> Free Guide</a></li>
      <li><a href="mailto:support@mintsheets.com"><span class="nav-icon">&#x2709;</span> Support</a></li>
    </ul>
"@
  $content = [regex]::Replace($content, $mobileOld, $mobileNew)

  # 3. Update Brands/Link relative paths for logo if needed
  # (Only if we are in a subdirectory like /blog/ or /hvac-calculators/)
  # But we'll skip complex relative path logic for now as most use /brand/ or ../brand/ which is handled.

  Set-Content $f.FullName -Value $content -NoNewline -Encoding UTF8
  Write-Host "Updated Navigation: $($f.FullName.Replace($base, ''))"
}

Write-Host "Navigation update complete."
