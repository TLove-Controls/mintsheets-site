# wire-sticky.ps1
$base = 'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site'

function Update-File($f, $target, $replacement) {
    if (Test-Path $f) {
        $c = Get-Content $f -Raw -Encoding UTF8
        if ($c -match [regex]::Escape($target)) {
            $c = $c -replace [regex]::Escape($target), $replacement
            Set-Content $f -Value $c -NoNewline -Encoding UTF8
            Write-Host "Wired: $($f.Replace($base, ''))"
        } else {
            Write-Host "Target not found in $($f.Replace($base, ''))"
        }
    }
}

# 1. HVAC Load Calculator
Update-File (Join-Path $base "hvac-load-calculator\index.html") `
    "document.getElementById('total-h-display').innerText = Math.round(finalHeat).toLocaleString();" `
    "document.getElementById('total-h-display').innerText = Math.round(finalHeat).toLocaleString();`r`n            if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Cooling', val: (finalCool / 12000).toFixed(1) + ' Tons' }, { label: 'Heating', val: Math.round(finalHeat / 1000) + 'k BTU' }], '/hvac-cfm-calculator/', 'CFM Allocation'); }"

# 2. HVAC CFM Calculator
Update-File (Join-Path $base "hvac-cfm-calculator\index.html") `
    "document.getElementById('res_total_cfm').textContent = totalCFM + ' CFM';" `
    "document.getElementById('res_total_cfm').textContent = totalCFM + ' CFM';`r`n        if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Total Airflow', val: totalCFM + ' CFM' }, { label: 'Equipment', val: (totalCFM / 400).toFixed(1) + ' Tons' }], '/hvac-duct-size-calculator/', 'Duct Sizing'); }"

# 3. HVAC Duct Size Calculator
Update-File (Join-Path $base "hvac-duct-size-calculator\index.html") `
    "document.getElementById('res_size_round').textContent = Math.ceil(roundD).toFixed(0) + '\" Round';" `
    "document.getElementById('res_size_round').textContent = Math.ceil(roundD).toFixed(0) + '\" Round';`r`n    if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Duct Size', val: Math.ceil(roundD).toFixed(0) + ' Inch' }, { label: 'Velocity', val: vel + ' FPM' }], '/hvac-static-pressure-calculator/', 'Static Pressure'); }"

# 4. HVAC Static Pressure Calculator
Update-File (Join-Path $base "hvac-static-pressure-calculator\index.html") `
    "document.getElementById('res_total_sp').textContent = totalSP + '\" w.c.';" `
    "document.getElementById('res_total_sp').textContent = totalSP + '\" w.c.';`r`n    if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Total External', val: totalSP + '\" w.c.' }, { label: 'Available', val: asp.toFixed(2) + '\" w.c.' }], '/hvac-bid-calculator/', 'Create Bid'); }"

# 5. HVAC Bid Calculator
Update-File (Join-Path $base "hvac-bid-calculator\index.html") `
    "document.getElementById('resTotal').textContent = 'Grand Total: $' + totalBid.toLocaleString(undefined, { minimumFractionDigits: 2 });" `
    "document.getElementById('resTotal').textContent = 'Grand Total: $' + totalBid.toLocaleString(undefined, { minimumFractionDigits: 2 });`r`n        if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Total Bid', val: '$' + totalBid.toLocaleString(undefined, { maximumFractionDigits: 0 }) }, { label: 'Margin', val: document.getElementById('resMarginPct').textContent }], '/hvac-service-price-calculator/', 'Service Pricing'); }"

# 6. HVAC Labor Cost Calculator
Update-File (Join-Path $base "hvac-labor-cost-calculator\index.html") `
    "document.getElementById('res_burdened_rate').textContent = '$' + burdenedRate.toFixed(2);" `
    "document.getElementById('res_burdened_rate').textContent = '$' + burdenedRate.toFixed(2);`r`n        if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Burdened Rate', val: '$' + burdenedRate.toFixed(2) + '/hr' }, { label: 'Labor Multiplier', val: (burdenedRate / rawRate).toFixed(2) + 'x' }], '/hvac-bid-calculator/', 'Create Bid'); }"

# 7. HVAC Service Price Calculator
Update-File (Join-Path $base "hvac-service-price-calculator\index.html") `
    "document.getElementById('res_total_price').textContent = '$' + totalPrice.toFixed(2);" `
    "document.getElementById('res_total_price').textContent = '$' + totalPrice.toFixed(2);`r`n            if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Service Price', val: '$' + totalPrice.toFixed(2) }, { label: 'Gross Profit', val: '$' + (totalPrice - jobCost).toFixed(2) }], '/hvac-profit-margin-calculator/', 'Profit Margins'); }"

# 8. HVAC Profit Margin Calculator
Update-File (Join-Path $base "hvac-profit-margin-calculator\index.html") `
    "document.getElementById('res_margin_pct').textContent = (margin * 100).toFixed(1) + '%';" `
    "document.getElementById('res_margin_pct').textContent = (margin * 100).toFixed(1) + '%';`r`n            if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Gross Margin', val: (margin * 100).toFixed(1) + '%' }, { label: 'Net Profit', val: '$' + netProfit.toFixed(0) }], '/hvac-business-valuation-calculator/', 'Business Value'); }"

# 9. HVAC Business Valuation Calculator
Update-File (Join-Path $base "hvac-business-valuation-calculator\index.html") `
    "document.getElementById('res_valuation').textContent = '$' + valuation.toLocaleString(undefined, { maximumFractionDigits: 0 });" `
    "document.getElementById('res_valuation').textContent = '$' + valuation.toLocaleString(undefined, { maximumFractionDigits: 0 });`r`n            if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Business Value', val: '$' + valuation.toLocaleString(undefined, { maximumFractionDigits: 0 }) }, { label: 'Multiple', val: multiple.toFixed(1) + 'x' }], '/', 'View All Tools'); }"

# 10. HVAC Mini-Split Sizing Calculator
Update-File (Join-Path $base "hvac-mini-split-sizing-calculator\index.html") `
    "document.getElementById('res_total_btu').textContent = totalBTU.toLocaleString() + ' BTU/hr';" `
    "document.getElementById('res_total_btu').textContent = totalBTU.toLocaleString() + ' BTU/hr';`r`n            if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Total BTU', val: totalBTU.toLocaleString() }, { label: 'Implied Tons', val: (totalBTU / 12000).toFixed(1) + ' Tons' }], '/hvac-bid-calculator/', 'Create Bid'); }"

# 11. HVAC Energy Savings Calculator
Update-File (Join-Path $base "hvac-energy-savings-calculator\index.html") `
    "document.getElementById('res_annual_savings').textContent = '$' + annSavings.toFixed(0);" `
    "document.getElementById('res_annual_savings').textContent = '$' + annSavings.toFixed(0);`r`n            if (window.updateMintStickyBar) { window.updateMintStickyBar([{ label: 'Annual Savings', val: '$' + annSavings.toFixed(0) }, { label: 'ROI Years', val: (inv / annSavings).toFixed(1) }], '/hvac-bid-calculator/', 'Create Bid'); }"

Write-Host "Sticky Bar wiring complete."
