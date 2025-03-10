@echo off
echo Creating LaserDog Installer...

REM Build the React application
call npm run build:react

REM Create the dist directory if it doesn't exist
if not exist "dist" mkdir dist

REM Create a directory for the portable app
if not exist "dist\LaserDog" mkdir dist\LaserDog

REM Copy necessary files
echo Copying files...
xcopy /E /I /Y "build" "dist\LaserDog\build"
copy /Y "main.js" "dist\LaserDog"
copy /Y "preload.js" "dist\LaserDog"
copy /Y "package.json" "dist\LaserDog"

REM Create a startup batch file
echo @echo off > "dist\LaserDog\start-laserdog.bat"
echo echo Starting LaserDog... >> "dist\LaserDog\start-laserdog.bat"
echo cd /d "%%~dp0" >> "dist\LaserDog\start-laserdog.bat"
echo if not exist "node_modules" ( >> "dist\LaserDog\start-laserdog.bat"
echo   echo First-time setup: Installing dependencies... >> "dist\LaserDog\start-laserdog.bat"
echo   call npm install --production >> "dist\LaserDog\start-laserdog.bat"
echo ) >> "dist\LaserDog\start-laserdog.bat"
echo start /b "" "node_modules\.bin\electron.cmd" . >> "dist\LaserDog\start-laserdog.bat"

REM Create a README file
echo # LaserDog > "dist\LaserDog\README.txt"
echo. >> "dist\LaserDog\README.txt"
echo ## Getting Started >> "dist\LaserDog\README.txt"
echo. >> "dist\LaserDog\README.txt"
echo 1. Make sure you have Node.js installed (https://nodejs.org) >> "dist\LaserDog\README.txt"
echo 2. Double-click on start-laserdog.bat to run the application >> "dist\LaserDog\README.txt"
echo 3. The first time you run it, it will install dependencies (this may take a few minutes) >> "dist\LaserDog\README.txt"
echo 4. After that, the application will start automatically >> "dist\LaserDog\README.txt"

echo Installation package created in dist\LaserDog
echo You can zip this folder and distribute it to users

pause 
