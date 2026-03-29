# Sync Product Pages Script
# Copies editable source of truth to live routing location

$products = Get-ChildItem -Path "products" -Directory
foreach ($p in $products) {
    if ($p.Name -eq "hvac-air-balance-report") {
        $source = Join-Path $p.FullName "product-page\index.html"
        $destFolder = Join-Path (Get-Location) "p\air-balance-report"
    } else {
        $source = Join-Path $p.FullName "product-page\index.html"
        $destFolder = Join-Path (Get-Location) "p\$($p.Name)"
    }
    
    if (Test-Path $source) {
        if (Test-Path $destFolder) {
            Copy-Item $source (Join-Path $destFolder "index.html") -Force
            Write-Host "Synced: $($p.Name)" -ForegroundColor Green
        }
    }
}
Write-Host "Sync Complete!" -ForegroundColor Cyan
