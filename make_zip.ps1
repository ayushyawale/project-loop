$src = 'C:\Users\Asus\OneDrive\Desktop\zidio2'
$dst = 'C:\Users\Asus\OneDrive\Desktop\zidio2-submission.zip'

if (Test-Path $dst) {
    Remove-Item $dst -Force
}

# Excluded patterns
$exclude = @('\.git', '\.next', 'node_modules', '\.zip$', '\.pyc$')

Write-Host "Scanning files..."
$files = Get-ChildItem -Path $src -Recurse -File | Where-Object {
    $filePath = $_.FullName
    $keep = $true
    foreach ($pat in $exclude) {
        if ($filePath -match $pat) {
            $keep = $false
            break
        }
    }
    $keep
}

Write-Host "Compressing $($files.Count) files into $dst..."
Compress-Archive -Path $files.FullName -DestinationPath $dst -Force

Write-Host "Zip Archive Created Successfully:"
Get-Item $dst | Select-Object Name, @{Name="Size (MB)"; Expression={[Math]::Round($_.Length / 1MB, 2)}}, FullName
