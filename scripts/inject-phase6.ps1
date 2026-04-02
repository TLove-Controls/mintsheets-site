# inject-phase6.ps1
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'
$files = Get-ChildItem -Path $base -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch 'node_modules|shared|brand|scripts|blog|terms-of-service|privacy-policy|disclaimer|cookie-policy|hvac-calculators|index.html' }

$workflowMap = @{
    "hvac-load-calculator" = @{ next="/hvac-cfm-calculator/"; label="CFM Allocation" }
    "hvac-cfm-calculator" = @{ next="/hvac-duct-size-calculator/"; label="Duct Sizing" }
    "hvac-duct-size-calculator" = @{ next="/hvac-static-pressure-calculator/"; label="Static Pressure" }
    "hvac-static-pressure-calculator" = @{ next="/hvac-bid-calculator/"; label="Create Bid" }
    "hvac-labor-cost-calculator" = @{ next="/hvac-bid-calculator/"; label="Create Bid" }
    "hvac-bid-calculator" = @{ next="/hvac-service-price-calculator/"; label="Service Pricing" }
    "hvac-service-price-calculator" = @{ next="/hvac-profit-margin-calculator/"; label="Profit Margins" }
    "hvac-profit-margin-calculator" = @{ next="/hvac-business-valuation-calculator/"; label="Business Value" }
    "hvac-mini-split-sizing-calculator" = @{ next="/hvac-bid-calculator/"; label="Create Bid" }
    "hvac-energy-savings-calculator" = @{ next="/hvac-bid-calculator/"; label="Create Bid" }
    "hvac-airflow-per-room-calculator" = @{ next="/hvac-cfm-calculator/"; label="CFM Calculation" }
    "hvac-flow-rate-calculator" = @{ next="/hvac-static-pressure-calculator/"; label="Static Pressure" }
}

foreach ($f in $files) {
    try {
        $content = Get-Content $f.FullName -Raw -Encoding UTF8
        $folderName = $f.Directory.Name
        $wf = $workflowMap[$folderName]
        
        if (-not $wf) { continue }

        # 1. Top Ad - More robust match
        if ($content -notmatch 'ad-slot-top') {
            $content = $content -replace '</h1>', "</h1>`r`n          <div class=`"ad-slot-top`" id=`"ad-top-1`"><div class=`"ad-label`">Advertisement</div></div>"
        }

        # 2. Mid Content - Search for common result panels
        if ($content -notmatch 'ad-slot-mid') {
            $midTarget = $null
            if ($content -match '(?s)(<div class="results-box".*?</div>)') { $midTarget = $Matches[1] }
            elseif ($content -match '(?s)(<div class="summary-panel".*?</div>)') { $midTarget = $Matches[1] }
            elseif ($content -match '(?s)(<div class="calc-panel".*?</div>)') { $midTarget = $Matches[1] }
            
            if ($midTarget) {
                $nextUrl = $wf.next
                $nextLabel = $wf.label
                
                $midHtml = "<div class=`"ad-slot-mid`" id=`"ad-mid-1`"><div class=`"ad-label`">Advertisement</div></div>" +
                "`r`n`r`n          <div class=`"conversion-block`">" +
                "`r`n            <h3>Turn this into a Professional Estimate</h3>" +
                "`r`n            <p>Use our HVAC Bid Calculator to combine technical data with labor and materials for a real job estimate.</p>" +
                "`r`n            <a href=`"/hvac-bid-calculator/`" class=`"btn btn-primary`">Create Bid &rarr;</a>" +
                "`r`n          </div>" +
                "`r`n`r`n          <div class=`"section-banner`" style=`"margin-top:40px;`">NEXT STEP IN WORKFLOW</div>" +
                "`r`n          <div class=`"workflow-chain`">" +
                "`r`n            <span class=`"workflow-step active`">Current Step</span>" +
                "`r`n            <span class=`"workflow-arrow`">&rarr;</span>" +
                "`r`n            <a href=`"$nextUrl`" class=`"workflow-step`">$nextLabel</a>" +
                "`r`n          </div>"
                
                $content = $content -replace [regex]::Escape($midTarget), "$midTarget`r`n          $midHtml"
            }
        }

        # 3. Bottom Ad
        if ($content -notmatch 'ad-slot-bottom') {
            $seoTag = '<section class="section" id="seo-content">'
            $footTag = '<footer'
            if ($content -match [regex]::Escape($seoTag)) {
                $content = $content -replace [regex]::Escape($seoTag), "<div class=`"ad-slot-bottom`" id=`"ad-bottom-1`"><div class=`"ad-label`">Advertisement</div></div>`r`n      $seoTag"
            } elseif ($content -match $footTag) {
                $content = $content -replace $footTag, "<div class=`"ad-slot-bottom`" id=`"ad-bottom-1`"><div class=`"ad-label`">Advertisement</div></div>`r`n      $footTag"
            }
        }

        # 4. Core Script
        if ($content -notmatch 'mint-core.js') {
            $content = $content -replace '(</body>)', "<script src=`"../shared/js/mint-core.js?v=2.5`"></script>`r`n$1"
        }

        Set-Content $f.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Injected/Verified Phase 6: $folderName"
    } catch {
        Write-Error "Failed to process $($f.FullName): $_"
    }
}
Write-Host "Phase 6 Injection complete."
