"""Build the Titan-nano dataset from the Python standard library on this machine.

Source: every .py file under the interpreter's stdlib directory, excluding
site-packages and any directory named `test` or `tests` (the test suites are
full of deliberately unusual code). Licence: Python Software Foundation License.

Normalisation (so the vocabulary is small and stable):
  - CRLF -> LF, tabs -> 4 spaces
  - any character outside printable ASCII (32..126) and '\n' becomes '?'

Split is by FILE, decided by a hash of the relative path, so the validation and
test sets contain only files the model never saw in training:
  ~90% train, ~5% val, ~5% test.

Writes train.txt, val.txt, test.txt and manifest.json into --out.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import sysconfig
from pathlib import Path

VOCAB = ["\n"] + [chr(c) for c in range(32, 127)]  # 96 symbols
FILE_SEP = "\n\n\n"


def normalise(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n").replace("\t", "    ")
    return "".join(ch if (ch == "\n" or 32 <= ord(ch) <= 126) else "?" for ch in text)


def split_of(rel_path: str) -> str:
    h = int(hashlib.sha256(rel_path.encode()).hexdigest(), 16) % 100
    return "test" if h < 5 else "val" if h < 10 else "train"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="data")
    args = ap.parse_args()
    root = Path(sysconfig.get_paths()["stdlib"])
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    parts: dict[str, list[str]] = {"train": [], "val": [], "test": []}
    files: dict[str, list[str]] = {"train": [], "val": [], "test": []}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if d not in {"site-packages", "test", "tests", "__pycache__"})
        for name in sorted(filenames):
            if not name.endswith(".py"):
                continue
            path = Path(dirpath) / name
            rel = path.relative_to(root).as_posix()
            text = normalise(path.read_text(encoding="utf-8", errors="replace"))
            s = split_of(rel)
            parts[s].append(text)
            files[s].append(rel)

    manifest = {
        "source": str(root),
        "python": sys.version.split()[0],
        "vocab": VOCAB,
        "splits": {},
    }
    for s, texts in parts.items():
        joined = FILE_SEP.join(texts)
        (out / f"{s}.txt").write_text(joined, encoding="ascii", newline="\n")
        manifest["splits"][s] = {"files": len(texts), "chars": len(joined), "paths": files[s]}
    (out / "manifest.json").write_text(json.dumps(manifest, indent=1), encoding="utf-8")
    for s in parts:
        print(f"{s:5s} files={manifest['splits'][s]['files']:4d} chars={manifest['splits'][s]['chars']:,}")


if __name__ == "__main__":
    main()
