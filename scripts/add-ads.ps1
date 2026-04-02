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

$standardAdPlaceholderTool = @"
    <!-- Ad Placeholder: Above Calculator -->
    <div class="ad-placeholder ad-placeholder-tool">
      <span>Advertisement</span>
    </div>
"@

$standardAdPlaceholderInline = @"
    <!-- Ad Placeholder: Inline Content -->
    <div class="ad-placeholder ad-placeholder-inline">
      <span>Advertisement</span>
    </div>
"@

$stickyAd = @"
  <!-- Sticky Ad Placeholder -->
  <div class="ad-placeholder ad-placeholder-sticky" id="sticky-ad">
    <span>Advertisement</span>
    <button class="ad-sticky-close" onclick="document.getElementById('sticky-ad').style.display='none'" aria-label="Close Ad">&times;</button>
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

    # 2. Add Sticky if not present 
    if ($content -notmatch 'ad-placeholder-sticky' -and $content -match '</body>') {
        $content = $content.Replace("</body>", $stickyAd + "`n</body>")
    }

    # 3. Category Specific Logic
    $isCalculator = $file.FullName -match "hvac-.*-calculator" -or $content -match "section-card"
    $isBlog = $file.FullName -match "blog"
    $isHome = $file.Name -eq "index.html" -and ($file.DirectoryName -eq (Get-Location).Path -or $file.FullName -match "mintsheets-site\\index.html$")

    if ($isCalculator -and -not $isHome -and -not $isBlog) {
        # Above-Tool placeholder (Before first section-banner)
        if ($content -notmatch 'ad-placeholder-tool') {
             if ($content -match '<div class="section-banner">') {
                $content = [regex]::Replace($content, '(<div class="section-banner">)', "`n" + $standardAdPlaceholderTool + "`n`n$1", 1)
             }
        }
        # Inline placeholder (After intro paragraph)
        if ($content -notmatch 'ad-placeholder-inline') {
            if ($content -match '</h1>\s*<p.*?</p>') {
                $content = [regex]::Replace($content, '(</h1>\s*<p.*?</p>)', "$1`n`n" + $standardAdPlaceholderInline, 1)
            }
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
    elseif ($isBlog) {
        # Top placeholder for blogs (After title)
        if ($content -notmatch 'ad-placeholder-top') {
            $content = [regex]::Replace($content, '(</h1>\s*<p class="article-meta".*?</p>)', "$1`n`n" + $standardAdPlaceholderTop, 1)
        }
        # Inline placeholder (After first paragraph)
        if ($content -notmatch 'ad-placeholder-inline') {
             if ($content -match '<div class="article-wrap">\s*<nav.*?>.*?</nav>.*?</h1>.*?<p.*?</p>') {
                $content = [regex]::Replace($content, '(<div class="article-wrap">\s*<nav.*?>.*?</nav>.*?</h1>.*?<p.*?</p>)', "$1`n`n" + $standardAdPlaceholderInline, 1)
             }
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

    [System.IO.File]::WriteAllText($file.FullName, $content)
}

Write-Host "Batch update complete."
