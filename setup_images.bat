echo Setting up premium images for YJ Menswear...

set SOURCE=C:\Users\ADMIN\.gemini\antigravity\brain\f6c6bed6-6349-4fbe-a519-b9d219887e44
set DEST=c:\Users\ADMIN\Desktop\YJ-Menswear\images

if not exist "%DEST%" mkdir "%DEST%"

echo Copying Hero...
copy "%SOURCE%\main_hero_banner_1777455454844.png" "%DEST%\main_hero_banner.png"
echo Copying Watches Category...
copy "%SOURCE%\watches_category_1777455488137.png" "%DEST%\watches_category.png"
echo Copying Sunglasses Category...
copy "%SOURCE%\sunglasses_category_1777455473250.png" "%DEST%\sunglasses_category.png"
echo Copying Products...
copy "%SOURCE%\watch_1_1777455580610.png" "%DEST%\watch_1.png"
copy "%SOURCE%\watch_2_1777455597561.png" "%DEST%\watch_2.png"
copy "%SOURCE%\watch_3_1777455976057.png" "%DEST%\watch_3.png"
copy "%SOURCE%\sunglasses_1_1777455613872.png" "%DEST%\sunglasses_1.png"
copy "%SOURCE%\sunglasses_2_1777455991350.png" "%DEST%\sunglasses_2.png"

echo.
echo ✅ Done! All images have been copied.
echo Please refresh your website (Ctrl + F5).
pause
