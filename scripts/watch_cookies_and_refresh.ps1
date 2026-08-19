# watch_cookies_and_refresh.ps1
#
# Polls scripts/cookies/ every 500ms for a new *.json (mtime-based).
# More reliable than FileSystemWatcher + AutoResetEvent, which has
# thread-signaling quirks in PowerShell.
#
# Activates cookies via cookie_refresh.py + runs ig-cookie-health.py.
#
# USAGE
#   pwsh -ExecutionPolicy Bypass -File watch_cookies_and_refresh.ps1
#            -CookiesDir "C:\path\scripts\cookies"
#            -ScriptsDir "C:\path\scripts"
#            -PythonExe "C:\python.exe"
#            -TimeoutSeconds 30
#
# RETURNS
#   0 = ok  | 1 = refresh failed  | 2 = timeout  | 3 = validation failed  | 4 = preflight

param(
    [string]$CookiesDir,
    [string]$ScriptsDir,
    [string]$PythonExe = "python",
    [int]$TimeoutSeconds = 30
)
$ErrorActionPreference = "Stop"

# ---- preflight ----
if (-not (Test-Path -LiteralPath $CookiesDir)) {
    Write-Host "!! cookies/ dir not found: $CookiesDir" -ForegroundColor Red
    exit 4
}
if (-not (Test-Path -LiteralPath $ScriptsDir)) {
    Write-Host "!! scripts/ dir not found: $ScriptsDir" -ForegroundColor Red
    exit 4
}

$statusFile = Join-Path $ScriptsDir ".cookie_refresh_status.json"
function Write-Status($code, $msg) {
    @{ "code" = $code; "message" = $msg; "timestamp" = (Get-Date -Format "o") } |
        ConvertTo-Json | Out-File -Encoding utf8 $statusFile
}

function Test-CookieFile($path) {
    try { $raw = Get-Content -Raw -LiteralPath $path -Encoding utf8 }
    catch { return @{ ok = $false; reason = "file not readable" } }
    try { $cookies = $raw | ConvertFrom-Json }
    catch { return @{ ok = $false; reason = "not valid JSON" } }
    if ($null -eq $cookies -or $cookies.Count -lt 5) {
        return @{ ok = $false; reason = "less than 5 cookies" }
    }
    $names = @()
    foreach ($c in $cookies) {
        if ($c.PSObject.Properties.Name -contains 'name') { $names += [string]$c.name }
    }
    foreach ($req in @('sessionid','csrftoken','ds_user_id')) {
        if ($names -notcontains $req) {
            return @{ ok = $false; reason = "missing cookie: $req" }
        }
    }
    return @{ ok = $true; count = $cookies.Count }
}

Write-Host ""
Write-Host "  Watching $CookiesDir for a new cookie JSON (timeout: ${TimeoutSeconds}s)..." -ForegroundColor Cyan
Write-Host "  Save the Cookie-Editor export there to activate."
Write-Host ""

# ---- poll-based detection ----
# Strategy: record which files existed at start. Then poll every 500ms.
# A file is "new" if (a) not in the initial set, OR (b) was modified after start.
# Skip active.json and archive/* and files older than 5 min (pre-existing).

$startTime = (Get-Date).AddSeconds(-5)  # 5s grace to avoid races
$existingFiles = @{}
Get-ChildItem -LiteralPath $CookiesDir -Filter "*.json" -ErrorAction SilentlyContinue | ForEach-Object {
    $existingFiles[$_.FullName] = $_.LastWriteTime
}

$pollIntervalMs = 500
$maxIterations = [int](($TimeoutSeconds * 1000) / $pollIntervalMs)
$newFile = $null

for ($i = 0; $i -lt $maxIterations; $i++) {
    Start-Sleep -Milliseconds $pollIntervalMs
    $current = Get-ChildItem -LiteralPath $CookiesDir -Filter "*.json" -ErrorAction SilentlyContinue
    foreach ($f in $current) {
        # Skip active.json
        if ($f.Name -ieq "active.json") { continue }
        # Skip archive/* entries
        if ($f.DirectoryName -match "[\\/]archive$" -or $f.FullName -match "[\\/]archive[\\/]") { continue }
        # New if not seen at start, OR modified after startTime
        $isNew = -not $existingFiles.ContainsKey($f.FullName)
        $modified = $f.LastWriteTime -gt $startTime
        if ($isNew -or $modified) {
            # Also skip if too old (file existed >5min - pre-existing, not a new export)
            $age = ((Get-Date) - $f.LastWriteTime).TotalSeconds
            if ($age -gt 300) { continue }
            $newFile = $f.FullName
            break
        }
    }
    if ($newFile) { break }
}

if (-not $newFile) {
    Write-Host "  !! timeout - no new cookie file appeared in $TimeoutSeconds seconds." -ForegroundColor Yellow
    Write-Status 2 "timeout"
    exit 2
}

# ---- validate + activate ----
Write-Host "  Detected: $newFile" -ForegroundColor Green
$validation = Test-CookieFile $newFile
if (-not $validation.ok) {
    Write-Host "  !! validation failed: $($validation.reason)" -ForegroundColor Red
    Write-Status 3 "validation failed: $($validation.reason)"
    exit 3
}
Write-Host "  validated ($($validation.count) cookies, includes sessionid/cs...]" -ForegroundColor Green

Write-Host ""
Write-Host "  dry-run cookie_refresh.py..." -ForegroundColor Cyan
& $PythonExe (Join-Path $ScriptsDir "cookie_refresh.py") --path $newFile --dry-run
if ($LASTEXITCODE -ne 0) {
    Write-Host "  !! dry-run failed - NOT activating." -ForegroundColor Red
    Write-Status 1 "dry-run failed"
    exit 1
}

Write-Host ""
Write-Host "  activating cookies..." -ForegroundColor Cyan
& $PythonExe (Join-Path $ScriptsDir "cookie_refresh.py") --path $newFile
if ($LASTEXITCODE -ne 0) {
    Write-Host "  !! activation failed" -ForegroundColor Red
    Write-Status 1 "activation failed"
    exit 1
}

Write-Host ""
Write-Host "  running health check..." -ForegroundColor Cyan
& $PythonExe (Join-Path $ScriptsDir "ig-cookie-health.py")

Write-Host ""
Write-Host "  Cookies refreshed. Status: $statusFile" -ForegroundColor Green
Write-Status 0 "ok"
exit 0
