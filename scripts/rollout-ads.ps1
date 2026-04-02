# rollout-ads.ps1
# Site-wide ad placeholder rollout script for MintSheets

$standardAdPlaceholderTop = @"
    <!-- Ad Placeholder: Top Banner -->
    <div class="ad-placeholder ad-placeholder-top">
      <span>Advertisement</span>
    </div>
"@

$standardAdPlaceholderMid = @"
    <!-- Ad Placeholder: Mid Content -->
    <div class="ad-placeholder ad-placeholder-mid">
      <span>Advertisement</span>
    </div>
"@

$standardAdPlaceholderBottom = @"
    <!-- Ad Placeholder: Bottom Banner -->
    <div class="ad-placeholder ad-placeholder-bottom">
      <span>Advertisement</span>
    </div>
"@

$standardAdPlaceholderSticky = @"
  <!-- Sticky Ad Placeholder -->
  <div class="ad-placeholder ad-placeholder-sticky" id="sticky-ad">
    <span>Advertisement</span>
    <button class="ad-sticky-close" onclick="document.getElementById('sticky-ad').style.display='none'" aria-label="Close Ad">×</button>
  </div>
"@

$files = Get-ChildItem -Recurse -Filter index.html | Where-Object { 
    $_.FullName -notmatch "privacy-policy" -and 
    $_.FullName -notmatch "terms-of-service" -and 
    $_.FullName -notmatch "disclaimer" -and 
    $_.FullName -notmatch "cookie-policy" -and
    $_.FullName -notmatch "contact" -and
    $_.FullName -notmatch "thank-you"
}

Write-Host "Starting rollout to $($files.Count) pages..."

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw
    
    # 1. CLEANUP LEGACY SLOTS
    # Handle various old class names from previous iterations
    $content = $content -replace '<div class="ad-slot ad-top".*?></div>', ""
    $content = $content -replace '<div class="ad-slot ad-mid".*?></div>', ""
    $content = $content -replace '<div class="ad-slot ad-bottom".*?></div>', ""
    $content = $content -replace '<div class="ad-slot-top".*?></div>', ""
    $content = $content -replace '<div class="ad-slot-mid".*?></div>', ""
    $content = $content -replace '<div class="ad-slot-bottom".*?></div>', ""
    
    # Remove any existing new-style placeholders to avoid duplicates if re-run
    $content = $content -replace '<!-- Ad Placeholder: Top Banner -->\s*<div class="ad-placeholder ad-placeholder-top">.*?</div>', ""
    $content = $content -replace '<!-- Ad Placeholder: Mid Content -->\s*<div class="ad-placeholder ad-placeholder-mid">.*?</div>', ""
    $content = $content -replace '<!-- Ad Placeholder: Bottom Banner -->\s*<div class="ad-placeholder ad-placeholder-bottom">.*?</div>', ""
    $content = $content -replace '<!-- Sticky Ad Placeholder -->\s*<div class="ad-placeholder ad-placeholder-sticky".*?</div>', ""

    # 2. INJECT TOP AD
    if ($file.FullName -match "hvac-|blog|/free/") {
        # Calculator/Blog/Resource: After hero title area
        if ($content -match '</h1>') {
            $content = $content -replace '(</h1>)', "`$1`n`n$standardAdPlaceholderTop"
        }
    } elseif ($file.FullName -match "index.html" -and $file.DirectoryName -match "mintsheets-site$") {
        # Homepage specialty placement: After Hero section
        $content = $content -replace '(</section>\s+<section class="section" id="calculators">)', "$standardAdPlaceholderTop`n`n`$1"
    }

    # 3. INJECT MID AD
    if ($file.FullName -match "hvac-") {
        # Calculators: After Results Box or Card
        if ($content -match '<div class="results-box".*?>') {
            $content = $content -replace '(</div>\s+<div class="tips-box">)', "</div>`n`n$standardAdPlaceholderMid`n`n<div class=""tips-box"">"
        } else {
            # Fallback for older card-based calculators
            $content = $content -replace '(</div>\s+<!-- FAQ)', "`n`n$standardAdPlaceholderMid`n`n`$1"
        }
    } elseif ($file.FullName -match "blog") {
        # Blogs: After 3rd paragraph
        $pCount = 0
        $content = [regex]::Replace($content, '<p>', {
            param($m)
            $script:pCount++
            if ($script:pCount -eq 3) {
                return "$standardAdPlaceholderMid`n`n<p>"
            }
            return "<p>"
        })
    } elseif ($file.FullName -match "index.html" -and $file.DirectoryName -match "mintsheets-site$") {
        # Homepage: Between major sections (Technical vs Recently Added)
        $content = $content -replace '(</section>\s+<!-- Recently Added)', "$standardAdPlaceholderMid`n`n`$1"
    }

    # 4. INJECT BOTTOM AD
    # Standard for all: Before footer
    if ($content -match '<footer') {
        $content = $content -replace '(<footer\b.*?>)', "$standardAdPlaceholderBottom`n`n`$1"
    }

    # 5. INJECT STICKY AD
    # Standard for all: Before closing body
    if ($content -match '</body>' -and $content -notmatch 'class="ad-placeholder ad-placeholder-sticky"') {
        $content = $content -replace '(</body>)', "$standardAdPlaceholderSticky`n`n`$1"
    }

    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Rollout Complete."
