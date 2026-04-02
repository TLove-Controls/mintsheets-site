# scripts/fix-h1-tags.ps1
$files = Get-ChildItem -Path . -Filter index.html -Recurse | Where-Object { $_.FullName -notmatch "node_modules|\.git|brand" }
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        # Identify h1 tags that don't have a closing tag within a reasonable distance (before section-banner or ad-placeholder-inline)
        if ($content -match "<h1" -and -not ($content -match "</h1>")) {
            Write-Host "Missing </h1> in $($file.FullName)"
            # Find the end of the line containing the <h1 tag
            $lines = [System.IO.File]::ReadAllLines($file.FullName)
            $newLines = New-Object System.Collections.Generic.List[string]
            foreach ($line in $lines) {
                if ($line -match "<h1" -and -not ($line -match "</h1>")) {
                    # Close it at the end of the line
                    $newLines.Add($line + "</h1>")
                } else {
                    $newLines.Add($line)
                }
            }
            [System.IO.File]::WriteAllLines($file.FullName, $newLines.ToArray())
            Write-Host "Restored </h1> tag in $($file.FullName)"
        }
    } catch {
        Write-Warning "Failed to process $($file.FullName): $($_.Exception.Message)"
    }
}
