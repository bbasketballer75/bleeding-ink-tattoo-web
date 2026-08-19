r"""
Run BAT/CMD files safely from the agent terminal.

The bug we hit: invoking a BAT from the agent's bash terminal causes
Git Bash to pre-parse the BAT content as bash. Every `&` becomes a job
separator, every `>` becomes a redirect, and the result is the famous
"M is not recognized" flood.

This module invokes BATs through Python's subprocess module which
bypasses bash entirely. It also:
  - Verifies the path exists
  - Returns the spawned PID + a way to check if it's still alive
  - Uses CREATE_NEW_CONSOLE so the spawned window actually appears
    on the desktop (otherwise it would inherit our invisible terminal)

Usage
=====
    from scripts.lib.run_bat import run_bat, run_bat_in_new_window

    # Synchronous: runs to completion, returns (returncode, stdout)
    rc, out = run_bat(r'C:\Users\bbask\scripts\foo.bat', cwd=r'C:\Users\bbask\scripts')

    # Async in new window (user can see it): returns PID
    pid = run_bat_in_new_window(r'C:\Users\bbask\scripts\foo.bat')

For PowerShell (.ps1), use `run_pwsh` (no escaping needed):
    from scripts.lib.run_bat import run_pwsh
    rc, out = run_pwsh(r'C:\Users\bbask\scripts\foo.ps1')
"""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path


def _validate(path: str) -> Path:
    """Resolve + verify the path exists + is a file. Returns Path."""
    p = Path(path)
    if not p.is_absolute():
        p = p.resolve()
    if not p.exists():
        raise FileNotFoundError(f"Script not found: {p}")
    if not p.is_file():
        raise ValueError(f"Path is not a file: {p}")
    return p


def run_bat(path: str, cwd: str | None = None, timeout: int = 3600) -> tuple[int, str]:
    """Run a BAT/CMD file synchronously and return (returncode, stdout).

    For interactive desktop tools use `run_bat_in_new_window` instead.
    """
    p = _validate(path)
    # CREATE_NEW_CONSOLE = 0x00000010 (so a window appears if needed)
    # Note: even with CREATE_NEW_CONSOLE, this call BLOCKS until the BAT exits.
    # For non-blocking use, see run_bat_in_new_window.
    result = subprocess.run(
        ["cmd.exe", "/c", str(p)],
        cwd=cwd,
        capture_output=True,
        text=True,
        timeout=timeout,
        creationflags=0x00000010,
    )
    return result.returncode, (result.stdout or "") + (result.stderr or "")


def run_bat_in_new_window(path: str, cwd: str | None = None) -> int:
    """Run a BAT/CMD file in a new detached console window.

    Returns the spawned PID immediately. The user sees the cmd window
    and can interact with it. Use `is_alive(pid)` to check liveness.
    """
    p = _validate(path)
    proc = subprocess.Popen(
        ["cmd.exe", "/c", str(p)],
        cwd=cwd,
        creationflags=0x00000010,  # CREATE_NEW_CONSOLE
        close_fds=True,
    )
    return proc.pid


def run_pwsh(path: str, cwd: str | None = None, timeout: int = 3600,
             args: list[str] | None = None) -> tuple[int, str]:
    """Run a PowerShell (.ps1) file synchronously via pwsh (PowerShell 7).

    Returns (returncode, stdout+stderr).
    """
    p = _validate(path)
    cmd = ["pwsh", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(p)]
    if args:
        cmd.extend(args)
    result = subprocess.run(
        cmd,
        cwd=cwd,
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    return result.returncode, (result.stdout or "") + (result.stderr or "")


def run_pwsh_in_new_window(path: str, cwd: str | None = None,
                            args: list[str] | None = None) -> int:
    """Run a PowerShell file in a new detached window. Returns PID."""
    p = _validate(path)
    cmd = ["pwsh", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(p)]
    if args:
        cmd.extend(args)
    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        creationflags=0x00000010,
        close_fds=True,
    )
    return proc.pid


def is_alive(pid: int) -> bool:
    """True if the process with this PID is still running."""
    import ctypes
    PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
    STILL_ACTIVE = 259
    kernel32 = ctypes.windll.kernel32
    handle = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid)
    if not handle:
        return False
    try:
        exit_code = ctypes.c_ulong()
        result = kernel32.GetExitCodeProcess(handle, ctypes.byref(exit_code))
        return result != 0 and exit_code.value == STILL_ACTIVE
    finally:
        kernel32.CloseHandle(handle)


if __name__ == "__main__":
    # Quick CLI: `python -m scripts.lib.run_bat <file>`
    if len(sys.argv) < 2:
        print("usage: run_bat.py <file.bat|file.ps1> [args...]", file=sys.stderr)
        sys.exit(2)
    target = sys.argv[1]
    extra_args = sys.argv[2:]
    p = Path(target)
    suffix = p.suffix.lower()
    if suffix in (".bat", ".cmd"):
        rc, out = run_bat(target)
    elif suffix in (".ps1",):
        rc, out = run_pwsh(target, args=extra_args)
    else:
        print(f"unknown script type: {suffix}", file=sys.stderr)
        sys.exit(2)
    print(out)
    sys.exit(rc)
