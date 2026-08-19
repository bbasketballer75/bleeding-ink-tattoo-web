@echo off
REM ============================================================================
REM refresh_ig_cookies.bat
REM
REM One-click helper for refreshing IG session cookies used by the
REM bleeding-ink-tattoo-web scrape scripts.
REM
REM USAGE
REM =====
REM   1. Open Chrome to instagram.com (already logged in)
REM   2. Click Cookie-Editor extension > Export > Cookies (JSON)
REM   3. Save the file to scripts\cookies\  (browser will prompt for path)
REM
REM What this BAT does:
REM   - Prints a checklist of the above steps
REM   - Runs the PowerShell watcher (which detects + activates new cookies)
REM   - Shows the result when done
REM
REM OPTIONAL FLAGS:
REM   --with-portfolio    also refresh portfolio + commit + push
REM   --artist=slug       artist to scrape (default: courtney-fetzer)
REM   --no-push           commit but don't push
REM ============================================================================

setlocal

set "SCRIPTS_DIR=%~dp0"
if "%SCRIPTS_DIR:~-1%"=="\" set "SCRIPTS_DIR=%SCRIPTS_DIR:~0,-1%"
set "COOKIES_DIR=%SCRIPTS_DIR%\cookies"
set "PS_SCRIPT=%SCRIPTS_DIR%\watch_cookies_and_refresh.ps1"
set "PYTHON_EXE=C:\Users\bbask\AppData\Local\Python\pythoncore-3.14-64\python.exe"
set "STATUS_FILE=%SCRIPTS_DIR%\.cookie_refresh_status.json"
set "TIMEOUT=45"
set "WITH_PORTFOLIO=0"
set "ARTIST=courtney-fetzer"
set "NO_PUSH=0"

:parse_args
if "%~1"=="" goto args_done
if /i "%~1"=="--with-portfolio" set "WITH_PORTFOLIO=1"
if /i "%~1"=="--no-push" set "NO_PUSH=1"
if /i "%~1"=="--artist" (
    set "ARTIST=%~2"
    shift
)
shift
goto parse_args
:args_done

echo.
echo ============================================================
echo  Refresh IG Cookies - checklist
echo ============================================================
echo.
echo  1. Open Chrome to instagram.com (logged in)
echo  2. Click the Cookie-Editor extension
echo  3. Export - Cookies (JSON)
echo  4. Save to: %COOKIES_DIR%
echo  5. Wait for this window to show the result
echo.
echo  Watching %COOKIES_DIR% for %TIMEOUT%s...
echo.

set "WATCHER_EXIT=1"
if not exist "%PS_SCRIPT%" (
    echo !! Watcher script not found: %PS_SCRIPT%
    goto after_watcher
)

start /b "" powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -CookiesDir "%COOKIES_DIR%" -ScriptsDir "%SCRIPTS_DIR%" -PythonExe "%PYTHON_EXE%" -TimeoutSeconds %TIMEOUT%

:wait_for_status
set "WAITED=0"
:wait_loop
if exist "%STATUS_FILE%" (
    echo  Found status file.
    goto after_watcher
)
if %WAITED% GTR 60 (
    echo !! Timed out waiting for watcher.
    goto after_watcher
)
ping -n 2 127.0.0.1 >nul 2>&1
set /a WAITED+=1
goto wait_loop

:after_watcher
echo.
echo ============================================================
echo  Result:
echo ============================================================
if exist "%STATUS_FILE%" (
    type "%STATUS_FILE%"
) else (
    echo  No status file - watcher did not complete.
)

if "%WITH_PORTFOLIO%"=="0" goto skip_portfolio

echo.
echo Refreshing portfolio for @%ARTIST%...
"%PYTHON_EXE%" "%SCRIPTS_DIR%\update_portfolio.py" --artist %ARTIST%
if errorlevel 1 (
    echo !! Portfolio refresh failed.
    goto end_fail
)

echo.
echo Committing portfolio changes...
cd /d "%SCRIPTS_DIR%\.."
git add public\images\portfolio src\data\portfolio.ts
git commit -m "feat(portfolio): refresh @%ARTIST% from refreshed IG cookies"
if "%NO_PUSH%"=="1" goto after_commit
git push origin main
:after_commit
echo.
echo Portfolio refreshed + committed.

:skip_portfolio

echo.
echo Done. Status file: %STATUS_FILE%
"%PYTHON_EXE%" "%SCRIPTS_DIR%\ig-cookie-health.py"
echo.
goto end_ok

:end_fail
echo.
echo Refresh failed. See messages above.
exit /b 1

:end_ok
echo.
echo Close this window when ready...
pause > nul
exit /b 0
