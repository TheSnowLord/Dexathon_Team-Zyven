@echo off
REM ACE Opportunity Compass — Windows Development Launcher
REM DEXATHON 2026 · Team Zyven

echo ========================================================
echo   ACE Opportunity Compass — Development Launcher
echo   DEXATHON 2026 · Team Zyven (Ankush Shahu)
echo ========================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%.."

echo [1/2] Starting Go Fiber API Backend (:8080)...
start "ACE Compass API (:8080)" cmd /k "cd /d "%ROOT_DIR%\apps\api" && go run cmd/server/main.go"

echo [2/2] Starting Vite React Frontend (:5173)...
start "ACE Compass Web (:5173)" cmd /k "cd /d "%ROOT_DIR%\apps\web" && npm run dev -- --host 127.0.0.1"

echo.
echo ========================================================
echo   Services are launching in separate windows!
echo   - Web UI:  http://127.0.0.1:5173
echo   - API:     http://127.0.0.1:8080/api/v1/health
echo ========================================================
echo.
pause
