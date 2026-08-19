@echo off
REM ============================================================================
REM refresh_ig_cookies.bat - thin Windows BAT wrapper
REM
REM This file exists only for backward compat with the desktop shortcut
REM created earlier. The source of truth is refresh_ig_cookies.ps1.
REM
REM If you have this BAT file as your desktop shortcut target, you can
REM keep it - it will invoke the PS1 version. But it's better to update
REM the shortcut to point at the PS1 directly (no cmd.exe wrapping).
REM ============================================================================

setlocal
set "SCRIPTS_DIR=%~dp0"
if "%SCRIPTS_DIR:~-1%"=="\" set "SCRIPTS_DIR=%SCRIPTS_DIR:~0,-1%"
set "PS1=%SCRIPTS_DIR%\refresh_ig_cookies.ps1"

REM Forward all args to the PS1
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" %*
exit /b %ERRORLEVEL%
