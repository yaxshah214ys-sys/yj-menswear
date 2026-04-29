# YJ Menswear - Image Setup Script
# This script copies the generated premium images to your project's images folder.

$sourcePath = "C:\Users\ADMIN\.gemini\antigravity\brain\f6c6bed6-6349-4fbe-a519-b9d219887e44"
$destPath = "c:\Users\ADMIN\Desktop\YJ-Menswear\images"

if (!(Test-Path $destPath)) {
    New-Item -ItemType Directory -Path $destPath
}

Copy-Item "$sourcePath\main_hero_banner_1777455454844.png" "$destPath\main_hero_banner.png" -ErrorAction SilentlyContinue
Copy-Item "$sourcePath\watches_category_1777455488137.png" "$destPath\watches_category.png" -ErrorAction SilentlyContinue
Copy-Item "$sourcePath\sunglasses_category_1777455473250.png" "$destPath\sunglasses_category.png" -ErrorAction SilentlyContinue
Copy-Item "$sourcePath\watch_1_1777455580610.png" "$destPath\watch_1.png" -ErrorAction SilentlyContinue
Copy-Item "$sourcePath\watch_2_1777455597561.png" "$destPath\watch_2.png" -ErrorAction SilentlyContinue
Copy-Item "$sourcePath\watch_3_1777455976057.png" "$destPath\watch_3.png" -ErrorAction SilentlyContinue
Copy-Item "$sourcePath\sunglasses_1_1777455613872.png" "$destPath\sunglasses_1.png" -ErrorAction SilentlyContinue
Copy-Item "$sourcePath\sunglasses_2_1777455991350.png" "$destPath\sunglasses_2.png" -ErrorAction SilentlyContinue

Write-Host "✅ All premium images have been set up successfully!" -ForegroundColor Green
