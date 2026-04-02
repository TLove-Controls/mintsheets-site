# scripts/fix-encoding.ps1
$bad1 = [char]0xC3 + [char]0x97
$bad2 = [char]0xC3 + [char]0x82
$files = Get-ChildItem -Path . -Filter index.html -Recurse | Where-Object { $_.FullName -notmatch "node_modules|\.git|brand" }
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        if ($content.Contains($bad1) -or $content.Contains($bad2)) {
            $newContent = $content.Replace($bad1, "&times;")
            $newContent = $newContent.Replace($bad2, "")
            [System.IO.File]::WriteAllText($file.FullName, $newContent)
            Write-Host "Fixed $($file.FullName)"
        }
    } catch {
        Write-Warning "Failed to process $($file.FullName): $($_.Exception.Message)"
    }
}
