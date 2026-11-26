"""Build the Language Cost Index v0 dataset from post 1's published data.

Usage (from the repo root):
    python -I site/scripts/make_language_index.py PATH/TO/Sentence-cost-in-Electron site/src/data/language-index.json

Inputs, all from https://github.com/NeuroTitan-Hub/Sentence-cost-in-Electron:
    m1/summary.csv                              token ratios to English, 204 languages x 8 tokenizers, 95% bootstrap intervals
    m6/explorer.json                            the derived server-energy chain per language
Language names come from FLORES-200's own list (site/scripts/flores200-names.tsv).
    m7-validation/run1/analysis_ac/per_language.csv   measured laptop-GPU energy, 18 languages (plugged-in runs only)

Nothing is computed here except rounding and reshaping. Every number traces to one of those files.
"""

import csv
import json
import sys
from pathlib import Path

# Order shown on the page: current models first, older and reference tokenizers last.
TOKENIZERS = [
    ("o200k", "OpenAI o200k", "GPT-4o, GPT-4.1, GPT-5, o3"),
    ("cl100k", "OpenAI cl100k", "GPT-4, GPT-3.5"),
    ("qwen3", "Qwen3", "Qwen3 models"),
    ("deepseek-v3", "DeepSeek-V3", "DeepSeek-V3"),
    ("mistral-nemo", "Mistral Tekken", "Mistral NeMo"),
    ("bloom", "BLOOM", "BLOOM"),
    ("gpt2", "GPT-2", "GPT-2 (older)"),
    ("utf8-bytes", "UTF-8 bytes", "Byte-level models"),
]

# The derived chain configuration shown in the Index: a page (20 sentences) on a shared
# server (batch of 64), Qwen3-8B on an L40S. Post 1 key result 4 quotes this one (Odia 16.5x).
CHAIN_KEY = "N20_b64"


def r3(x: float) -> float:
    return round(float(x), 3)


def main(src: Path, out: Path) -> None:
    explorer = json.loads((src / "m6" / "explorer.json").read_text(encoding="utf-8"))
    names = {}
    for line in (Path(__file__).parent / "flores200-names.tsv").read_text(encoding="utf-8").splitlines():
        if line and not line.startswith("#"):
            code, name = line.split("	")
            names[code] = name
    chain = {l["code"]: l["chain"][CHAIN_KEY] for l in explorer["languages"]}

    ratios: dict[str, dict[str, list[float]]] = {}
    with open(src / "m1" / "summary.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            ratios.setdefault(row["lang"], {})[row["tokenizer"]] = [
                r3(row["ratio_to_eng"]),
                r3(row["ratio_lo95"]),
                r3(row["ratio_hi95"]),
            ]

    gpu = {}
    with open(src / "m7-validation" / "run1" / "analysis_ac" / "per_language.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            gpu[row["lang"]] = r3(row["copy_energy_ratio_total"])

    tok_ids = [t[0] for t in TOKENIZERS]
    langs = []
    for code in sorted(ratios, key=lambda c: names[c]):
        r = ratios[code]
        missing = [t for t in tok_ids if t not in r]
        if missing:
            raise SystemExit(f"{code}: missing tokenizers {missing}")
        # chain entry: [ref_J, ratio, lo, hi, share_arith, share_weights, share_kv]
        c = chain.get(code)
        langs.append(
            {
                "c": code,
                "n": names[code],
                "r": [r[t] for t in tok_ids],
                "es": [r3(c[1]), r3(c[2]), r3(c[3])] if c else None,
                "eg": gpu.get(code),
            }
        )

    if len(langs) != 204:
        raise SystemExit(f"expected 204 languages, got {len(langs)}")
    eng = next(l for l in langs if l["c"] == "eng_Latn")
    if any(abs(x[0] - 1) > 1e-9 for x in eng["r"]):
        raise SystemExit("English ratios must all be 1")

    data = {
        "version": "0",
        "built": "2026-11-26",
        "source": "https://github.com/NeuroTitan-Hub/Sentence-cost-in-Electron",
        "text": "FLORES-200 devtest, 1,012 sentences per language, the same meaning in every language",
        "tokenizers": [{"id": t, "label": l, "models": m} for t, l, m in TOKENIZERS],
        "energy": {
            "es": "Derived: Qwen3-8B on an NVIDIA L40S, a page of 20 sentences on a shared server (batch of 64). A model checked against Deng et al.'s GPU measurements, not a measurement",
            "eg": "Measured: laptop RTX 4060, a 4-bit fine-tune of Qwen3.5-4B, copying 20 sentences, 1 or 2 runs. Noisy; a controlled rerun is planned",
        },
        "languages": langs,
    }
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {out} ({out.stat().st_size:,} bytes, {len(langs)} languages, {sum(1 for l in langs if l['eg'])} with GPU energy)")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(Path(sys.argv[1]), Path(sys.argv[2]))
