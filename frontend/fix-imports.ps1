# Fix import paths in admin pages
$files = Get-ChildItem -Path "app/(admin)/admin" -Recurse -Filter "*.tsx" -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Replace @/app/_lib with @/_lib
    $content = $content -replace '@/app/_lib', '@/_lib'
    
    # Replace @/app/_types with @/_types
    $content = $content -replace '@/app/_types', '@/_types'
    
    # Replace @/app/(admin)/_hooks with @/(admin)/_hooks
    $content = $content -replace '@/app/\(admin\)/_hooks', '@/(admin)/_hooks'
    
    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "Done!"
