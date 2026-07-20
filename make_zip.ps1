Add-Type -AssemblyName System.IO.Compression.FileSystem
$src = 'C:\Users\Asus\OneDrive\Desktop\zidio2'
$dst = 'C:\Users\Asus\OneDrive\Desktop\zudioa.zip'
if (Test-Path $dst) {
    Remove-Item $dst -Force
}
[System.IO.Compression.ZipFile]::CreateFromDirectory($src, $dst)
Get-Item $dst | Select-Object Name,Length,FullName
