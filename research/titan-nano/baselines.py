"""Character n-gram baselines for Titan-nano, with Witten-Bell interpolated smoothing.

  P(c | h) = (C(h c) + T(h) * P(c | h')) / (C(h) + T(h))
where T(h) is the number of distinct characters seen after history h and h'
drops the oldest character. The order-0 base is add-one smoothed unigrams.

Orders 1..7 are scored on the validation split; the best order on VALIDATION
is then scored once on test. Writes baselines.json into --run.
"""
from __future__ import annotations

import argparse
import json
import math
import time
from collections import Counter, defaultdict
from pathlib import Path

MAX_ORDER = 7


def train_counts(text: str, max_order: int):
    ngram = [Counter() for _ in range(max_order + 1)]  # ngram[n][s] for len(s) == n+1 (history n, plus char)
    for n in range(max_order + 1):
        L = n + 1
        ngram[n].update(text[i : i + L] for i in range(len(text) - L + 1))
    hist_total = [defaultdict(int) for _ in range(max_order + 1)]
    hist_types = [defaultdict(int) for _ in range(max_order + 1)]
    for n in range(1, max_order + 1):
        for s, c in ngram[n].items():
            hist_total[n][s[:-1]] += c
            hist_types[n][s[:-1]] += 1
    return ngram, hist_total, hist_types


def score(text: str, order: int, vocab: list[str], model) -> float:
    ngram, hist_total, hist_types = model
    V = len(vocab)
    N = sum(ngram[0].values())
    uni = {ch: (ngram[0].get(ch, 0) + 1) / (N + V) for ch in vocab}
    nll = 0.0
    for i, ch in enumerate(text):
        p = uni[ch]
        for n in range(1, order + 1):
            if i - n < 0:
                break
            h = text[i - n : i]
            tot = hist_total[n].get(h, 0)
            if tot == 0:
                break  # longer histories are unseen too
            t = hist_types[n][h]
            p = (ngram[n].get(h + ch, 0) + t * p) / (tot + t)
        nll -= math.log2(p)
    return nll / len(text)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="data")
    ap.add_argument("--run", default="runs/titan-nano-v1")
    args = ap.parse_args()
    data = Path(args.data)
    vocab = json.loads((data / "manifest.json").read_text())["vocab"]
    train = (data / "train.txt").read_text(encoding="ascii")
    val = (data / "val.txt").read_text(encoding="ascii")
    test = (data / "test.txt").read_text(encoding="ascii")

    t0 = time.time()
    model = train_counts(train, MAX_ORDER)
    print(f"counted n-grams up to order {MAX_ORDER} in {time.time() - t0:.0f}s", flush=True)
    val_bpc = {}
    for order in range(0, MAX_ORDER + 1):
        val_bpc[order] = score(val, order, vocab, model)
        print(f"order {order}: val {val_bpc[order]:.3f} bits/char", flush=True)
    best = min(val_bpc, key=val_bpc.get)
    test_best = score(test, best, vocab, model)
    test_uni = score(test, 0, vocab, model)
    out = {
        "method": "character n-gram, Witten-Bell interpolation, add-one unigram base",
        "val_bpc_by_order": {str(k): round(v, 4) for k, v in val_bpc.items()},
        "best_order_on_val": best,
        "test_bpc_best_order": round(test_best, 4),
        "test_bpc_unigram": round(test_uni, 4),
        "uniform_bpc": round(math.log2(len(vocab)), 4),
    }
    Path(args.run).mkdir(parents=True, exist_ok=True)
    (Path(args.run) / "baselines.json").write_text(json.dumps(out, indent=1))
    print(json.dumps(out, indent=1))


if __name__ == "__main__":
    main()
