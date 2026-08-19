# Refresh IG Cookies (PowerShell version)
#
# One-click helper to refresh Instagram session cookies used by the
# bleeding-ink-tattoo-web scrape scripts.
#
# Why a PowerShell version: Windows cmd.exe BAT files have notorious
# quoting/escaping issues (the `&`, `>`, `<` operators are misinterpreted
# when the BAT is read by Git Bash on this machine). PowerShell has clean
# syntax that survives bash preprocessing.
#
# Usage:
#   Double-click refresh_ig_cookies.ps1 from File Explorer
#   OR: pwsh -NoProfile -ExecutionPolicy Bypass -File refresh_ig_cookies.ps1
#
# What it does:
#   1. Prints checklist for the user
#   2. Spawns watch_cookies_and_refresh.ps1 in background (polling watcher)
#   3. Waits for status file or 45-second timeout
#   4. Runs health check
#   5. Pauses so the user can read the result

[CmdletBinding()]
param(
    [int]$TimeoutSeconds = 45,
    [switch]$WithPortfolio,
    [string]$Artist = 'courtney-fetzer',
    [switch]$NoPush
)

$ErrorActionPreference = 'Stop'

$ScriptsDir   = $PSScriptRoot
$CookiesDir   = Join-Path $ScriptsDir 'cookies'
$WatcherScript = Join-Path $ScriptsDir 'watch_cookies_and_refresh.ps1'
$StatusFile   = Join-Path $ScriptsDir '.cookie_refresh_status.json'
$PythonExe    = 'C:\Users\bbask\AppData\Local\Python\pythoncore-3.14-64\python.exe'

if (-not (Test-Path $CookiesDir)) { New-Item -ItemType Directory -Path $CookiesDir | Out-Null }

# ----------------------------------------------------------------------
# Step 1: show checklist
# ----------------------------------------------------------------------
Clear-Host
Write-Host '============================================================' -ForegroundColor Cyan
Write-Host ' Refresh IG Cookies - checklist' -ForegroundColor Cyan
Write-Host '============================================================' -ForegroundColor Cyan
Write-Host ''
Write-Host ' 1. Open Chrome to instagram.com (logged in)'
Write-Host ' 2. Click the Cookie-Editor extension'
Write-Host ' 3. Export - Cookies (JSON)'
Write-Host " 4. Save to: $CookiesDir"
Write-Host ' 5. Wait for this window to show the result'
Write-Host ''
Write-Host " Watching $CookiesDir for ${TimeoutSeconds}s..."
Write-Host ''

# ----------------------------------------------------------------------
# Step 2: spawn the watcher (it polls cookies/, runs cookie_refresh.py
# when a new *.json appears, writes a status file)
# ----------------------------------------------------------------------
$WatcherArgs = @(
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', $WatcherScript,
    '-CookiesDir', $CookiesDir,
    '-ScriptsDir', $ScriptsDir,
    '-PythonExe', $PythonExe,
    '-TimeoutSeconds', $TimeoutSeconds
)

$Watcher = Start-Process -FilePath 'pwsh' -ArgumentList $WatcherArgs -PassThru -WindowStyle Hidden

# ----------------------------------------------------------------------
# Step 3: wait for status file or timeout
# ----------------------------------------------------------------------
$Deadline = (Get-Date).AddSeconds($TimeoutSeconds + 5)
$Found = $false
while ((Get-Date) -lt $Deadline) {
    Start-Sleep -Seconds 1
    if (Test-Path $StatusFile) {
        # Wait a tiny bit more so the watcher can finish writing
        Start-Sleep -Milliseconds 500
        $Found = $true
        break
    }
    if ($Watcher.HasExited) {
        $Found = $false
        break
    }
}

# Make sure watcher is really dead
if (-not $Watcher.HasExited) {
    Stop-Process -Id $Watcher.Id -Force -ErrorAction SilentlyContinue
}

# ----------------------------------------------------------------------
# Step 4: show result + health check
# ----------------------------------------------------------------------
Write-Host ''
Write-Host '============================================================' -ForegroundColor Cyan
Write-Host ' Result:'
Write-Host '============================================================' -ForegroundColor Cyan

if ($Found -and (Test-Path $StatusFile)) {
    Get-Content $StatusFile -Raw
} else {
    Write-Host '!! no status file produced (watcher may have timed out)' -ForegroundColor Red
}

Write-Host ''
Write-Host '=== IG cookie health ==='
& $PythonExe (Join-Path $ScriptsDir 'ig-cookie-health.py')

# ----------------------------------------------------------------------
# Step 5 (optional): portfolio refresh
# ----------------------------------------------------------------------
if ($WithPortfolio) {
    Write-Host ''
    Write-Host "Refreshing portfolio for @$Artist..."
    $PushFlag = if ($NoPush) { '--no-push' } else { '' }
    $PortfolioCmd = @($PythonExe,
                      (Join-Path $ScriptsDir 'update_portfolio.py'),
                      '--artist', $Artist)
    if ($NoPush) { $PortfolioCmd += '--no-push' }
    & $PortfolioCmd[0] $PortfolioCmd[1..($PortfolioCmd.Count-1)]
    if ($LASTEXITCODE -ne 0) {
        Write-Host "!! portfolio refresh failed (exit $LASTEXITCODE)" -ForegroundColor Red
    }
    # commit + push (unless --no-push)
    Write-Host ''
    Write-Host 'Committing portfolio changes...'
    Push-Location (Split-Path $ScriptsDir -Parent)
    try {
        git add public/images/portfolio src/data/portfolio.ts
        git commit -m "feat(portfolio): refresh @$Artist from refreshed IG cookies"
        if (-not $NoPush) {
            git push origin main
        }
        Write-Host ''
        Write-Host "Portfolio refreshed + committed." -ForegroundColor Green
    } finally {
        Pop-Location
    }
}

Write-Host ''
Write-Host 'Close this window when ready...' -ForegroundColor Gray
$x = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
