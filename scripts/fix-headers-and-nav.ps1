param(
    [string]$TargetFile
)

$standardHeader = @"
  <header class="site-header">
    <div class="container nav">
      <a href="/" class="brand">
        <img src="/brand/logo-without-background.png" alt="MintSheets Logo" width="182" height="80" decoding="async" loading="eager">
      </a>
      <nav class="nav-links">
        <a href="/">Calculators</a>
        <a href="/blog/">Blogs</a>
        <a href="/#troubleshooting-checklist">Free Guide</a>
        <a href="mailto:support@mintsheets.com">Support</a>
      </nav>
      <div class="header-actions">
        <a href="/free/hvac-troubleshooting-checklist/" class="btn btn-primary btn-sm" style="min-height: 40px;">Free Resources</a>
      </div>
      <button class="hamburger" id="hamburger-btn" aria-label="Open navigation menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>
  <nav class="mobile-nav" id="mobile-nav" aria-hidden="true">
    <div class="mobile-nav-header">
      <a href="/" class="brand">
        <img src="/brand/logo-without-background.png" alt="MintSheets Logo" width="182" height="80" decoding="async" loading="eager">
      </a>
      <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu"><span></span><span></span></button>
    </div>
    <ul class="mobile-nav-links">
      <li><a href="/"><span class="nav-icon">&#x1F9EE;</span> Calculators</a></li>
      <li><a href="/blog/"><span class="nav-icon">&#x1F4DD;</span> Blogs</a></li>
      <li><a href="/#troubleshooting-checklist"><span class="nav-icon">&#x1F4CB;</span> Free Guide</a></li>
      <li><a href="mailto:support@mintsheets.com"><span class="nav-icon">&#x2709;</span> Support</a></li>
    </ul>
    <div class="mobile-nav-cta"><a href="/free/hvac-troubleshooting-checklist/" class="btn btn-primary">Free Resources</a></div>
  </nav>
"@

$standardJS = @"
  <script>
  (function () {
    var btn = document.getElementById('hamburger-btn');
    var nav = document.getElementById('mobile-nav');
    var overlay = document.getElementById('mobile-nav-overlay');
    var close = document.getElementById('mobile-nav-close');
    if (!btn || !nav) return;
    function setMenuState(open) {
      document.body.classList.toggle('menu-open', open);
      btn.classList.toggle('active', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    btn.addEventListener('click', function () { setMenuState(!btn.classList.contains('active')); });
    close && close.addEventListener('click', function () { setMenuState(false); });
    overlay && overlay.addEventListener('click', function () { setMenuState(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenuState(false);
    });
  })();
  </script>
"@

$standardFooter = @"
  <footer id="mint-footer" style="background:var(--panel-elevated);border-top:1px solid var(--line);padding:40px 0;margin-top:60px;font-family:sans-serif;clear:both;">
    <div style="max-width:1100px;margin:0 auto;padding:0 20px;">
      <h3 style="color:var(--primary);font-weight:900;font-size:18px;text-transform:uppercase;margin-bottom:20px;letter-spacing:1px;">Related HVAC Calculators</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
        <a href="/hvac-load-calculator/" style="color:var(--muted);text-decoration:none;font-size:14px;">Load Calculator</a>
        <a href="/hvac-cfm-calculator/" style="color:var(--muted);text-decoration:none;font-size:14px;">CFM Calculator</a>
        <a href="/hvac-duct-size-calculator/" style="color:var(--muted);text-decoration:none;font-size:14px;">Duct Size Calculator</a>
        <a href="/hvac-static-pressure-calculator/" style="color:var(--muted);text-decoration:none;font-size:14px;">Static Pressure Calculator</a>
      </div>
      <div style="margin-top:20px;display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:var(--muted);">
        <a href="/privacy-policy/" style="color:var(--muted);text-decoration:none;">Privacy Policy</a>
        <a href="/terms-of-service/" style="color:var(--muted);text-decoration:none;">Terms of Service</a>
        <a href="/disclaimer/" style="color:var(--muted);text-decoration:none;">Disclaimer</a>
        <a href="/cookie-policy/" style="color:var(--muted);text-decoration:none;">Cookie Policy</a>
      </div>
      <p style="margin-top:20px;color:var(--muted);font-size:12px;">&copy; 2026 MintSheets. Free HVAC technical tools.</p>
    </div>
  </footer>
"@

if ($TargetFile) {
    if (Test-Path $TargetFile) {
        $files = Get-Item $TargetFile
    } else {
        Write-Error "Target file not found: $TargetFile"
        return
    }
} else {
    $files = Get-ChildItem -Recurse -Filter *.html
}

$files | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    
    # 1. FIX LOGO
    # Match <picture> or <img> inside brand anchor
    $brandRegex = '(?s)<a href="/" class="brand">.*?</a>'
    $newBrand = '<a href="/" class="brand"><img src="/brand/logo-without-background.png" alt="MintSheets Logo" width="182" height="80" decoding="async" loading="eager"></a>'
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, $brandRegex, $newBrand)

    # 2. FIX NAVIGATION LINKS
    # Replace "Blog" with "Blogs" in nav-links and mobile-nav-links
    $content = $content -replace 'href="/blog/how-to-size-hvac-systems/"', 'href="/blog/"'
    $content = $content -replace '>Blog</a>', '>Blogs</a>'
    $content = $content -replace '> Blog</a>', '> Blogs</a>'
    $content = $content -replace '>Blog\s*</a>', '>Blogs</a>'

    # 3. ENSURE HAMBURGER MENU & JS
    if ($content -match '<header class="site-header">') {
        # Ensure hamburger button is present
        if ($content -notmatch 'id="hamburger-btn"') {
             # Insert before the closing div of the nav container
             $content = $content -replace '(</div>\s*</header>)', '      <button class="hamburger" id="hamburger-btn" aria-label="Open navigation menu" aria-expanded="false"><span></span><span></span><span></span></button>`r`n    $1'
        }
        
        # Standardize toggle JS
        $regexJS = '(?s)<script>\s*\(function\s*\(\)\s*\{\s*var\s*btn\s*=\s*document\.getElementById\(''hamburger-btn''\).*?\}\)\(\);\s*</script>'
        if ($content -match $regexJS) {
            $content = [System.Text.RegularExpressions.Regex]::Replace($content, $regexJS, $standardJS)
        } elseif ($content -notmatch 'var btn = document.getElementById\(''hamburger-btn''\)') {
             $content = $content -replace '</body>', "$standardJS`r`n</body>"
        }
    } else {
        # 4. INJECT FULL HEADER/NAV/FOOTER ON BARE PAGES
        if ($content -match '<body.*?>') {
            if ($content -notmatch 'styles\.min\.css' -and $content -notmatch 'styles\.css') {
                $content = $content -replace '</head>', '  <link rel="stylesheet" href="/styles.min.css?v=1.5">`r`n</head>'
            }
            
            $content = $content -replace '(<body.*?>)', "$1`r`n$standardHeader"
            
            if ($content -notmatch '<footer id="mint-footer">') {
                 $content = $content -replace '(</body>)', "$standardFooter`r`n$standardJS`r`n$1"
            }
        }
    }

    Set-Content $filePath $content -NoNewline
    Write-Output "Processed: $filePath"
}
