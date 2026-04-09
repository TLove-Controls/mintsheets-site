# scripts/add-ads.ps1
param(
    [string]$TargetFile = ""
)

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

$files = $null
if ($TargetFile -ne "") {
    $files = Get-Item $TargetFile
} else {
    $files = Get-ChildItem -Path . -Filter index.html -Recurse | Where-Object { 
        $_.FullName -notmatch "privacy-policy|terms-of-service|disclaimer|cookie-policy|brand|node_modules|\.git|scripts"
    }
}

foreach ($file in $files) {
    Write-Host "Processing $($file.FullName)..."
    $content = [System.IO.File]::ReadAllText($file.FullName)

    # 1. Replace legacy ad-slots (Regex to catch with/without comments)
    $content = [regex]::Replace($content, '<!-- Ad Placeholder: Top Banner -->\s*<div class="ad-slot ad-top".*?></div>', $standardAdPlaceholderTop)
    $content = [regex]::Replace($content, '<!-- Ad Placeholder: Mid Content -->\s*<div class="ad-slot ad-mid".*?></div>', $standardAdPlaceholderMid)
    $content = [regex]::Replace($content, '<!-- Ad Placeholder: Bottom Banner -->\s*<div class="ad-slot ad-bottom".*?></div>', $standardAdPlaceholderBottom)
    
    # Standalone slots
    $content = [regex]::Replace($content, '<div class="ad-slot ad-top".*?></div>', $standardAdPlaceholderTop)
    $content = [regex]::Replace($content, '<div class="ad-slot ad-mid".*?></div>', $standardAdPlaceholderMid)
    $content = [regex]::Replace($content, '<div class="ad-slot ad-bottom".*?></div>', $standardAdPlaceholderBottom)

    # 2. Category Specific Logic
    $isCalculator = $file.FullName -match "hvac-.*-calculator" -or $content -match "section-card"
    $isBlogIndex = $file.FullName -match "blog[\\/]+index\.html$"
    $isBlogArticle = $file.FullName -match "blog[\\/]+[^\\/]+[\\/]+index\.html$"
    $isGuide = $file.FullName -match "free[\\/]+"
    $isHome = $file.Name -eq "index.html" -and ($file.DirectoryName -eq (Get-Location).Path -or $file.FullName -match "mintsheets-site\\index.html$")

    if ($isGuide) {
        $content = [regex]::Replace($content, '<!-- Ad Placeholder: Top Banner -->\s*<div class="ad-placeholder ad-placeholder-top">\s*<span>Advertisement</span>\s*</div>\s*', '')
        $content = [regex]::Replace($content, '<!-- Ad Placeholder: Mid Content -->\s*<div class="ad-placeholder ad-placeholder-mid">\s*<span>Advertisement</span>\s*</div>\s*', '')
        $content = [regex]::Replace($content, '<!-- Ad Placeholder: Bottom Banner -->\s*<div class="ad-placeholder ad-placeholder-bottom">\s*<span>Advertisement</span>\s*</div>\s*', '')
    }
    elseif ($isCalculator -and -not $isHome -and -not $isBlogArticle -and -not $isBlogIndex) {
        # Calculators should stay light: top and bottom only.
        $content = [regex]::Replace($content, '<!-- Ad Placeholder: Mid Content -->\s*<div class="ad-placeholder ad-placeholder-mid">\s*<span>Advertisement</span>\s*</div>\s*', '')
        $content = [regex]::Replace($content, '<!-- Ad Placeholder: Above Calculator -->\s*<div class="ad-placeholder ad-placeholder-tool">\s*<span>Advertisement</span>\s*</div>\s*', '')
        $content = [regex]::Replace($content, '<!-- Ad Placeholder: Inline Content -->\s*<div class="ad-placeholder ad-placeholder-inline">\s*<span>Advertisement</span>\s*</div>\s*', '')

        if ($content -notmatch 'ad-placeholder-top') {
            $content = [regex]::Replace($content, '(</h1>)', "$1`n`n" + $standardAdPlaceholderTop, 1)
        }
        # Bottom placeholder if not present (Before workflow-chain or footer)
        if ($content -notmatch 'ad-placeholder-bottom') {
            if ($content -match '<div class="workflow-chain">') {
                $content = $content.Replace('<div class="workflow-chain">', $standardAdPlaceholderBottom + "`n`n<div class=`"workflow-chain`">")
            } else {
                 $content = $content.Replace('<footer id="mint-footer"', $standardAdPlaceholderBottom + "`n`n<footer id=`"mint-footer`"")
            }
        }
    }
    elseif ($isBlogArticle) {
        # Top placeholder for blogs (After title)
        if ($content -notmatch 'ad-placeholder-top') {
            $content = [regex]::Replace($content, '(</h1>\s*<p class="article-meta".*?</p>)', "$1`n`n" + $standardAdPlaceholderTop, 1)
        }
        # Mid placeholder (Before second H2 if exists)
        if ($content -notmatch 'ad-placeholder-mid') {
            $h2Matches = [regex]::Matches($content, "<h2")
            if ($h2Matches.Count -ge 2) {
                # Insert before the second H2
                $targetIndex = $h2Matches[1].Index
                $content = $content.Insert($targetIndex, $standardAdPlaceholderMid + "`n`n")
            }
        }
    }
    elseif ($isBlogIndex -or $isHome) {
        # Directory-style pages should have a single lighter placement.
        $content = [regex]::Replace($content, '<!-- Ad Placeholder: Mid Content -->\s*<div class="ad-placeholder ad-placeholder-mid">\s*<span>Advertisement</span>\s*</div>\s*', '')
        $content = [regex]::Replace($content, '<!-- Ad Placeholder: Bottom Banner -->\s*<div class="ad-placeholder ad-placeholder-bottom">\s*<span>Advertisement</span>\s*</div>\s*', '')

        if ($content -notmatch 'ad-placeholder-top') {
            $content = [regex]::Replace($content, '(</h1>)', "$1`n`n" + $standardAdPlaceholderTop, 1)
        }
    }

    # Remove sticky ads from the managed templates and drop the body helper when unused.
    $content = [regex]::Replace($content, '<!-- Sticky Ad Placeholder -->\s*<div class="ad-placeholder ad-placeholder-sticky" id="sticky-ad">[\s\S]*?</div>\s*', '')
    if ($content -notmatch 'ad-placeholder-sticky') {
        $content = $content -replace '\s*has-sticky-ad', ''
    }

    # Keep a single instance of each supported placement.
    $slotLabels = @{
        top = "Top Banner"
        mid = "Mid Content"
        bottom = "Bottom Banner"
    }
    foreach ($slot in @('top', 'mid', 'bottom')) {
        $seen = $false
        $pattern = '<!-- Ad Placeholder: ' + [regex]::Escape($slotLabels[$slot]) + ' -->\s*<div class="ad-placeholder ad-placeholder-' + $slot + '">\s*<span>Advertisement</span>\s*</div>\s*'
        $content = [regex]::Replace($content, $pattern, {
            param($match)
            if ($seen) {
                return ''
            }
            $seen = $true
            return $match.Value
        })
    }

    [System.IO.File]::WriteAllText($file.FullName, $content)
}

Write-Host "Batch update complete."
