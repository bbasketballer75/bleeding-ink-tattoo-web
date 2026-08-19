@echo off
REM ============================================================================
REM refresh_ig_cookies.bat
REM
REM One-click helper for refreshing IG session cookies used by the
REM bleeding-ink-tattoo-web scrape scripts. Wraps the PowerShell watcher
REM (watch_cookies_and_refresh.ps1) so the desktop interaction is just:
REM
REM   1. Open Chrome to instagram.com (already logged in)
REM   2. Click the Cookie-Editor extension > Export > Cookies (JSON)
REM   3. Save the file to scripts/cookies/  (browser will prompt for path)
REM
REM This script:
REM   - verifies Chrome + Cookie-Editor are ready
REM   - starts the watcher (waits for a new *.json in scripts/cookies/)
REM   - validates + activates the new cookies via cookie_refresh.py
REM   - shows a health-check summary
REM
REM OPTIONAL FLAGS (passed to update_portfolio.py after refresh):
REM   --with-portfolio    auto-update IG portfolio + commit + push
REM   --artist=slug       which artist to scrape (default: courtney-fetzer)
REM   --no-push           don't push the portfolio commit (just commit)
REM
REM USAGE:
REM   Double-click from desktop, or run from cmd:
REM     scripts\refresh_ig_cookies.bat
REM     scripts\refresh_ig_cookies.bat --with-portfolio
REM ============================================================================

setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPTS_DIR=%~dp0"
if "%SCRIPTS_DIR:~-1%"=="\" set "SCRIPTS_DIR=%SCRIPTS_DIR:~0,-1%"
set "COOKIES_DIR=%SCRIPTS_DIR%\cookies"
set "PS_SCRIPT=%SCRIPTS_DIR%\watch_cookies_and_refresh.ps1"
set "PYTHON_EXE=C:\Users\bbausks\AppData\Local\Python\pythoncore-3.14-64\python.exe"
set "STATUS_FILE=%SCRIPTS_DIR%\.cookie_refresh_status.json"
set "TIMEOUT=30"

REM ---- parse flags ----
set "WITH_PORTFOLIO="
set "ARTIST=courtney-fetzer"
set "NO_PUSH="
:parse_loop
if "%~1"=="" goto parse_done
if /i "%~1"=="--with-portfolio" set "WITH_PORTFOLIO=1" & shift & goto parse_loop
if /i "%~1"=="--no-push" set "NO_PUSH=1" & shift & goto parse_loop
if /i "%~1"=="--artist" (
    set "ARTIST=%~2"
    shift
    shift
    goto parse_loop
)
shift
goto parse_loop
:parse_done

echo.
echo === Bleeding Ink - IG Cookie Refresh ===
echo.

REM ---- preflight checks ----
if not exist "%PYTHON_EXE%" (
    echo !! Python not found: %PYTHON_EXE%
    echo    Edit refresh_ig_cookies.bat and update PYTHON_EXE.
    goto end_fail
)

if not exist "%PS_SCRIPT%" (
    echo !! PowerShell watcher missing: %PS_SCRIPT%
    goto end_fail
)

if not exist "%COOKIES_DIR%" mkdir "%COOKIES_DIR%"

REM ---- check Chrome is running ----
echo Checking Chrome...
powershell -NoProfile -Command "Get-Process chrome -ErrorAction SilentlyContinue | Select-Object -First 1 Id, MainWindowTitle | Format-Table -AutoSize" 2>&1

REM ---- prompt for cookie export ----
echo.
echo ============================================================
echo  READY TO WATCH.
echo.
echo  1. Click the Cookie-Editor extension icon in Chrome.
echo  2. Click "Export"  -^>  "Cookies (JSON)".
echo  3. Save the file in:
echo     %COOKIES_DIR%
echo.
echo  The watcher will detect the file and activate it automatically.
echo  Timeout: %TIMEOUT% seconds.
echo ============================================================
echo.

REM ---- run the watcher ----
powershell -ExecutionPolicy Bypass -File "%PS_SCRIPT%" ^
    -CookiesDir "%COOKIES_DIR%" ^
    -ScriptsDir "%SCRIPTS_DIR%" ^
    -PythonExe "%PYTHON_EXE%" ^
    -TimeoutSeconds %TIMEOUT%

set "WATCHER_EXIT=%ERRORLEVEL%"

if not exist "%STATUS_FILE%" (
    echo.
    echo !! Watcher did not write a status file. Exit code: %WATCHER_EXIT%
    goto end_fail
)

REM ---- parse the status JSON (best-effort, no external tools) ----
set "STATUS_LINE="
for /f "tokens=2 delims=:" %%A in ('findstr /c:"message" "%STATUS_FILE%"') do set "STATUS_LINE=%%A"
echo.
echo ============================================================
echo  Watcher finished (exit %WATCHER_EXIT%):%STATUS_LINE%
echo ============================================================
echo.

REM ---- optional: portfolio refresh ----
if not defined WITH_PORTFOLIO goto skip_portfolio

echo Refreshing portfolio for @%ARTIST%...
echo.
"%PYTHON_EXE%" "%SCRIPTS_DIR%\update_portfolio.py" --artist %ARTIST%
set "PORTFOLIO_EXIT=%ERRORLEVEL%"
if not "%PORTFOLIO_EXIT%"=="0" (
    echo !! Portfolio refresh failed (exit %PORTFOLIO_EXIT%)
    goto end_fail
)

echo.
echo Committing portfolio changes...
cd /d "%SCRIPTS_DIR%\.."
git add public\images\portfolio src\data\portfolio.ts
git commit -m "feat(portfolio): refresh @%ARTIST% from refreshed IG cookies"
if defined NO_PUSH goto after_commit
git push origin main
:after_commit
echo.
echo ✅ Portfolio refreshed + committed.

:skip_portfolio

echo.
echo Done. Status file: %STATUS_FILE%
echo Cookie health:
"%PYTHON_EXE%" "%SCRIPTS_DIR%\ig-cookie-health.py"
echo.
goto end_ok

:end_fail
echo.
echo *** refresh failed. See messages above. ***
exit /b 1

:end_ok
exit /b 0
