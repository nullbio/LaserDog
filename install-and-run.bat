@echo off
echo Installing LaserDog dependencies...
call npm install

echo Building the application...
call npm run build:react

echo Starting LaserDog...
call npm start

pause 
