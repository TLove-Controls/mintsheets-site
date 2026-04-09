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

    $isCalculator = $file.FullName -match "hvac-.*-calculator"
    $isBlogIndex = $file.FullName -match "blog[\\/]+index\.html$"
    $isBlogArticle = $file.FullName -match "blog[\\/]+[^\\/]+[\\/]+index\.html$"
    $isGuide = $file.FullName -match "free[\\/]+"
    $isHome = $file.FullName -match "mintsheets-site[\\/]index\.html$"
    $isDirectory = $file.FullName -match "hvac-calculators[\\/]index\.html$"

    # 1. CLEANUP LEGACY AND PREVIOUSLY INJECTED SLOTS
    $content = $content -replace '<div class="ad-slot ad-top".*?></div>', ""
    $content = $content -replace '<div class="ad-slot ad-mid".*?></div>', ""
    $content = $content -replace '<div class="ad-slot ad-bottom".*?></div>', ""
    $content = $content -replace '<div class="ad-slot-top".*?></div>', ""
    $content = $content -replace '<div class="ad-slot-mid".*?></div>', ""
    $content = $content -replace '<div class="ad-slot-bottom".*?></div>', ""
    $content = $content -replace '<!-- Ad Placeholder: Top Banner -->\s*<div class="ad-placeholder ad-placeholder-top">.*?</div>\s*', ""
    $content = $content -replace '<!-- Ad Placeholder: Mid Content -->\s*<div class="ad-placeholder ad-placeholder-mid">.*?</div>\s*', ""
    $content = $content -replace '<!-- Ad Placeholder: Bottom Banner -->\s*<div class="ad-placeholder ad-placeholder-bottom">.*?</div>\s*', ""
    $content = $content -replace '<!-- Sticky Ad Placeholder -->\s*<div class="ad-placeholder ad-placeholder-sticky".*?</div>\s*', ""
    $content = $content -replace '<!-- Ad Placeholder: Above Calculator -->\s*<div class="ad-placeholder ad-placeholder-tool">.*?</div>\s*', ""
    $content = $content -replace '<!-- Ad Placeholder: Inline Content -->\s*<div class="ad-placeholder ad-placeholder-inline">.*?</div>\s*', ""

    # 2. INJECT LIGHTWEIGHT PLACEMENTS BY PAGE TYPE
    if ($isGuide) {
        # Keep lead magnets focused on conversion.
    }
    elseif ($isCalculator -or $isBlogArticle -or $isBlogIndex -or $isDirectory) {
        if ($content -match '</h1>') {
            $content = $content -replace '(</h1>)', "`$1`n`n$standardAdPlaceholderTop"
        }
    }
    elseif ($isHome) {
        $content = $content -replace '(</section>\s+<!-- Recently Added)', "$standardAdPlaceholderMid`n`n`$1"
    }

    if ($isBlogArticle) {
        $pCount = 0
        $content = [regex]::Replace($content, '<p>', {
            param($m)
            $script:pCount++
            if ($script:pCount -eq 3) {
                return "$standardAdPlaceholderMid`n`n<p>"
            }
            return "<p>"
        })
    }

    if ($isCalculator -and $content -match '<footer') {
        $content = $content -replace '(<footer\b.*?>)', "$standardAdPlaceholderBottom`n`n`$1"
    }

    if ($content -notmatch 'ad-placeholder-sticky') {
        $content = $content -replace '\s*has-sticky-ad', ''
    }

    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Rollout Complete."
