# Setup Images Script for YJ Menswear
$dest = "images"
if (-Not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest }

$images = @{
    "hero_menswear_1777187494482.png"        = "hero.png"
    "perfume_category_1777187513284.png"     = "perfume_category.png"
    "wallet_category_1777187538612.png"      = "wallet_category.png"
    "belt_category_1777187555633.png"        = "belt_category.png"
    "wildstone_perfume_1777188630337.png"    = "wildstone_perfume.png"
    "villain_perfume_1777222394167.png"      = "villain_perfume.png"
    "cfs_perfume_1777188677333.png"          = "cfs_perfume.png"
    "axe_perfume_1777188654537.png"          = "axe_perfume.png"
    "patel_perfume_1777188694876.png"        = "patel_perfume.png"
    "leather_wallet_black_1777188734900.png" = "wallet_black.png"
    "leather_wallet_tan_1777188716416.png"   = "wallet_tan.png"
    "black_leather_belt_1777199590136.png"   = "belt_black.png"
    "brown_leather_belt_1777199606144.png"   = "belt_brown.png"
    "suede_belt_grey_1777199624586.png"      = "belt_grey.png"
}

$sourceDir = "C:\Users\ADMIN\.gemini\antigravity\brain\3be2f3c5-2509-4cca-9b96-7896e0002544"

foreach ($src in $images.Keys) {
    $sourceFile = Join-Path $sourceDir $src
    $destFile = Join-Path $dest $images[$src]
    if (Test-Path $sourceFile) {
        Copy-Item -Path $sourceFile -Destination $destFile -Force
        Write-Host "Success: $($images[$src]) ready."
    }
}
Write-Host "`All images are now in your Desktop folder!" -ForegroundColor Green
pause
