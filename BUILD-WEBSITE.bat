@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Run START-PANOMETAL54.bat first.
  pause
  exit /b 1
)
node build.cjs
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)
echo.
echo Build complete. The upload-ready files are in the dist folder.
pause
