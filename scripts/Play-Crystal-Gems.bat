@echo off
title Crystal Gems: Crystal Guardians Unleashed
cd /d "%~dp0"

:: 1. Launch Native Windows Application EXE if present
if exist "Crystal Gems.exe" (
    start "" "Crystal Gems.exe"
    exit /b
)

:: 2. Fallback: Launch in Microsoft Edge Clean App Mode
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="%~dp0Crystal-Gems.html" --window-size=1280,720 --start-maximized --disable-features=Translate
    exit /b
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="%~dp0Crystal-Gems.html" --window-size=1280,720 --start-maximized --disable-features=Translate
    exit /b
)

:: 3. Fallback: Launch in Google Chrome Clean App Mode
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%~dp0Crystal-Gems.html" --window-size=1280,720 --start-maximized --disable-features=Translate
    exit /b
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%~dp0Crystal-Gems.html" --window-size=1280,720 --start-maximized --disable-features=Translate
    exit /b
)

:: 4. Fallback: Open in default web browser
start "" "%~dp0Crystal-Gems.html"
exit /b
