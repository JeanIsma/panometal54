@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title PanoMetal54 Website Server

echo =================================================
echo  PANOMETAL54 - START WEBSITE
echo =================================================
echo.

where node >nul 2>nul
if errorlevel 1 goto :installnode
goto :start

:installnode
echo Node.js is missing. Installing Node.js LTS...
where winget >nul 2>nul
if errorlevel 1 (
  echo.
  echo Windows Package Manager was not found.
  echo Install Node.js LTS from https://nodejs.org/
  echo Then run this file again.
  echo.
  pause
  exit /b 1
)

winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
if errorlevel 1 (
  echo.
  echo Node.js installation failed or was cancelled.
  pause
  exit /b 1
)

set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js was installed, but Windows must refresh PATH.
  echo Close this window, then double-click START-PANOMETAL54.bat again.
  pause
  exit /b 0
)

:start
if not exist "dist\index.html" (
  echo Building the website files...
  node build.cjs
  if errorlevel 1 goto :failed
)

echo Starting website server...
echo.
node server.cjs
set "SERVER_EXIT=%ERRORLEVEL%"
echo.
echo The website server stopped with exit code %SERVER_EXIT%.
echo This window is intentionally staying open so errors are visible.
pause
exit /b %SERVER_EXIT%

:failed
echo.
echo The website could not be built.
pause
exit /b 1
