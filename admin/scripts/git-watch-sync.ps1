# MINT SHEETS - AUTO-GIT SYNC WATCHER
# Run this in a background terminal to automate your pushing.

$projectRoot = Get-Location
$watchPaths = @("products", "bundles", "p", "admin/dashboard")
$heartbeatPath = Join-Path $projectRoot "admin/dashboard/.heartbeat"

Write-Host "--- Mint Sheets Git Watcher ---" -ForegroundColor Cyan
Write-Host "Monitoring: $($watchPaths -join ', ')" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor Yellow

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $projectRoot
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Function to perform Git operations
function Sync-Git($changeDesc) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Change detected: $changeDesc" -ForegroundColor Green
    Write-Host "Waiting 5 seconds for other changes..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    
    Write-Host "Syncing to GitHub..." -ForegroundColor Cyan
    git add .
    git commit -m "Auto-sync from Dashboard: $changeDesc"
    git push origin cleanup/remove-redundant-product-folders
    Write-Host "✓ Sync Complete!`n" -ForegroundColor Green
}

# Heartbeat loop in background
[System.Threading.Tasks.Task]::Run({
    while ($true) {
        $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $now | Out-File -FilePath $heartbeatPath -Force
        Start-Sleep -Seconds 10
    }
})

# Watcher Events
$onChange = Register-ObjectEvent $watcher "Changed" -Action {
    if ($Event.SourceEventArgs.Name -notmatch "\.git|\.heartbeat|node_modules") {
        Sync-Git "Modified $($Event.SourceEventArgs.Name)"
    }
}

$onCreate = Register-ObjectEvent $watcher "Created" -Action {
    if ($Event.SourceEventArgs.Name -notmatch "\.git|\.heartbeat") {
        Sync-Git "Created $($Event.SourceEventArgs.Name)"
    }
}

$onDelete = Register-ObjectEvent $watcher "Deleted" -Action {
    if ($Event.SourceEventArgs.Name -notmatch "\.git|\.heartbeat") {
        Sync-Git "Deleted $($Event.SourceEventArgs.Name)"
    }
}

# Keep script alive
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    $watcher.EnableRaisingEvents = $false
    Unregister-Event -SourceIdentifier $onChange.Name
    Unregister-Event -SourceIdentifier $onCreate.Name
    Unregister-Event -SourceIdentifier $onDelete.Name
    Write-Host "Watcher stopped." -ForegroundColor White
}
