"""
Lint BAT files for common Windows shell pitfalls.

Catches the exact bugs that bit the refresh_ig_cookies BAT in this session:
  - Unescaped single `&` outside `if`/`for` blocks (gets parsed as bash job)
  - Unmatched double-quotes
  - Unescaped `<` or `>` redirect (gets parsed as bash redirect)
  - Reference to paths that don't exist (warn only)
  - CR/LF line endings (warn — may indicate Windows-edit + bash-parse conflict)

Usage
=====
    python scripts/bin/lint_bat.py scripts/                  # lint all *.bat in dir
    python scripts/bin/lint_bat.py scripts/foo.bat          # lint one file

Exit codes: 0 = no errors, 1 = errors found, 2 = warnings only.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path


def lint_bat(path: Path) -> tuple[list[str], list[str]]:
    """Return (errors, warnings) for the given BAT file."""
    errors: list[str] = []
    warnings: list[str] = []

    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        errors.append(f"{path}: not UTF-8 (re-save without BOM)")
        return errors, warnings

    # CRLF line endings (windows + bash can conflict)
    if "\r\n" in text:
        warnings.append(f"{path}: CRLF line endings")

    # Strip comment lines (REM ...) for analysis
    lines = [l for l in text.split("\n") if not l.lstrip().upper().startswith("REM ")]

    # Check 1: unmatched quotes per line (very rough heuristic)
    for i, line in enumerate(lines, 1):
        dq = line.count('"')
        if dq % 2 != 0:
            errors.append(f"{path}:{i}: unmatched double-quote on line: {line[:80]}")

    # Check 2: unescaped `&` outside if/for/set blocks
    # `&` is legal in `if X&Y do ...`, `for ... in (...)` (one line form), and after `set`
    # Otherwise it's a job separator in bash.
    block_opener = re.compile(r"^\s*(if|for|else)\b", re.IGNORECASE)
    set_line = re.compile(r"^\s*set\s+", re.IGNORECASE)
    multi_amp = re.compile(r"&(?!&)")
    for i, line in enumerate(lines, 1):
        if block_opener.match(line) or set_line.match(line):
            continue
        # Skip lines that are part of a multi-line block (we can't easily detect this,
        # but a common pattern is " ... & " at line start or end)
        # Allow `&` in parentheses (e.g. echo a & b)
        if line.strip().startswith("(") or line.strip().endswith(")"):
            continue
        if multi_amp.search(line):
            # If preceded by a caret, it's escaped (`^&`)
            stripped = line.lstrip()
            if not stripped.startswith("^"):
                # Allow single & in known-safe contexts
                safe = (
                    line.count("set ") > 0
                    or line.strip().endswith("&")  # line continuation
                    or line.strip().startswith("&")  # leading & (rare but valid)
                )
                if not safe:
                    errors.append(
                        f"{path}:{i}: unescaped '&' (bash preprocessor will treat as job separator). "
                        f"Fix: use '&&' for short-circuit or '^&' to escape."
                    )

    # Check 3: unescaped redirect chars (>, <) outside set statements
    # `> file.txt`, `>> file.txt`, `< file.txt` are valid in BAT but bash interprets
    # them as redirects if the BAT is read by bash.
    redirect_char = re.compile(r"(?<![<>=])([<>])(?![=])")
    for i, line in enumerate(lines, 1):
        # Skip REM, comments, and lines clearly within set assignments
        if line.lstrip().upper().startswith("REM "):
            continue
        if "set " in line.lower()[:6]:
            continue
        # Skip quoted strings that intentionally contain <> (paths with spaces)
        # Heuristic: if the line has balanced quotes before the < or >, skip
        m = redirect_char.search(line)
        if m:
            pos = m.start()
            before = line[:pos]
            if before.count('"') % 2 == 1:
                # Odd number of quotes before = we're inside a quoted string
                continue
            errors.append(
                f"{path}:{i}: unescaped '{m.group()}' (bash preprocessor treats as redirect). "
                f"Fix: use '^>' or '^<' to escape."
            )

    # Check 4: warning if file references a path that doesn't exist
    # Look for common path patterns like C:\..., /c/..., %SOMETHING%
    path_ref = re.compile(r'(?:[A-Z]:\\|/c/|%[A-Z_]+%\\)[^\s"&|<>]+\\[^\s"&|<>]+')
    seen = set()
    for i, line in enumerate(lines, 1):
        for m in path_ref.finditer(line):
            p = m.group().rstrip(")").rstrip(",")
            if p in seen:
                continue
            seen.add(p)
            if not Path(p).exists():
                # Skip env-var refs and relative paths
                if "%" in p or p.endswith(".bat") or p.endswith(".exe"):
                    continue
                warnings.append(f"{path}:{i}: path reference may not exist: {p}")

    return errors, warnings


def main(argv: list[str]) -> int:
    if not argv:
        print("usage: lint_bat.py <file-or-dir> [<file-or-dir> ...]", file=sys.stderr)
        return 2

    all_errors: list[str] = []
    all_warnings: list[str] = []

    for arg in argv:
        p = Path(arg)
        if p.is_dir():
            files = sorted(p.rglob("*.bat")) + sorted(p.rglob("*.cmd"))
        elif p.is_file():
            files = [p]
        else:
            print(f"not found: {arg}", file=sys.stderr)
            all_errors.append(f"{arg}: not found")
            continue

        if not files:
            print(f"  (no .bat/.cmd files under {p})")
            continue

        for f in files:
            errs, warns = lint_bat(f)
            all_errors.extend(errs)
            all_warnings.extend(warns)
            status = "OK" if not errs else ("WARN" if not warns and not errs else "FAIL")
            print(f"[{status}] {f}")
            for e in errs:
                print(f"  ERROR: {e}")
            for w in warns:
                print(f"  WARN:  {w}")

    print()
    print(f"Summary: {len(all_errors)} errors, {len(all_warnings)} warnings")
    return 1 if all_errors else (2 if all_warnings else 0)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
