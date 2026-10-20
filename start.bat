@echo off
cd /d "%~dp0"
title AnyShip - dev server
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js saknas. Installera det fran https://nodejs.org och kor start.bat igen.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installerar dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install misslyckades.
    pause
    exit /b 1
  )
)
echo Startar AnyShip pa http://localhost:5173
call npm run dev -- --open
pause
