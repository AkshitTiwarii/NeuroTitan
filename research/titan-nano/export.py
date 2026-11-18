"""Evaluate Titan-nano on the full test set and export it for the browser.

1. Test-set evaluation over EVERY character of the held-out files, using sliding
   windows (ctx 256, stride 128: after the first window, only the last 128
   positions of each window are scored, so every scored character has at least
   128 characters of context). Reports bits/char and next-character accuracy.
2. Quantise every 2-D weight to int8 with one scale per output row; biases and
   LayerNorm stay float32. The int8 model is evaluated the same way, so the cost
   of quantisation is measured, not assumed.
3. Write the browser files:
     site/public/models/titan-nano/weights.bin   tensors, 4-byte aligned
     site/public/models/titan-nano/model.json    config, vocab, tensor table
     site/src/data/titan-nano.json               metrics + training curve for the page
     research/titan-nano/<run>/parity.json       reference logits for the JS parity test
"""
from __future__ import annotations

import argparse
import csv
import json
import math
from pathlib import Path

import numpy as np
import torch

from model import Config, TitanNano
from train import load_split


@torch.no_grad()
def evaluate(model: TitanNano, data: torch.Tensor, ctx: int, stride: int = 128) -> dict:
    model.eval()
    nll, correct, count = 0.0, 0, 0
    starts = list(range(0, len(data) - 1, stride))
    for s in starts:
        x = data[s : s + ctx]
        y = data[s + 1 : s + ctx + 1]
        n = min(len(x), len(y))
        if n <= 0:
            break
        x, y = x[:n].unsqueeze(0), y[:n]
        logits = model(x)[0][0]
        first = 0 if s == 0 else ctx - stride
        if first >= n:
            continue
        lp = torch.log_softmax(logits[first:n], dim=-1)
        nll -= lp.gather(1, y[first:n].unsqueeze(1)).sum().item()
        correct += (lp.argmax(-1) == y[first:n]).sum().item()
        count += n - first
        if s + ctx >= len(data) - 1:
            break
    return {"bpc": nll / count / math.log(2), "accuracy": correct / count, "chars": count}


def quantise(sd: dict[str, torch.Tensor]):
    q, deq = {}, {}
    for name, t in sd.items():
        t = t.float()
        if t.dim() == 2:
            scale = t.abs().amax(dim=1).clamp(min=1e-8) / 127.0
            qi = torch.round(t / scale[:, None]).clamp(-127, 127).to(torch.int8)
            q[name] = ("i8", qi, scale)
            deq[name] = qi.float() * scale[:, None]
        else:
            q[name] = ("f32", t, None)
            deq[name] = t
    return q, deq


def write_bin(q: dict, out_dir: Path, cfg: Config, vocab: list[str]) -> int:
    out_dir.mkdir(parents=True, exist_ok=True)
    buf = bytearray()
    table = []

    def align():
        while len(buf) % 4:
            buf.append(0)

    for name, (dtype, t, scale) in q.items():
        align()
        entry = {"name": name, "shape": list(t.shape), "dtype": dtype, "offset": len(buf)}
        buf += t.numpy().astype(np.int8 if dtype == "i8" else np.float32).tobytes()
        if scale is not None:
            align()
            entry["scale_offset"] = len(buf)
            buf += scale.numpy().astype(np.float32).tobytes()
        table.append(entry)
    (out_dir / "weights.bin").write_bytes(bytes(buf))
    (out_dir / "model.json").write_text(json.dumps({"config": cfg.to_dict(), "vocab": vocab, "tensors": table}))
    return len(buf)


@torch.no_grad()
def parity_reference(model: TitanNano, vocab: list[str], prompts: list[str], steps: int = 60) -> list[dict]:
    model.eval()  # dropout off: references must be deterministic
    stoi = {c: i for i, c in enumerate(vocab)}
    refs = []
    for p in prompts:
        ids = [stoi[c] for c in p]
        logits = model(torch.tensor([ids]))[0][0, -1]
        gen = list(ids)
        for _ in range(steps):  # greedy continuation
            nxt = int(model(torch.tensor([gen[-model.cfg.ctx :]]))[0][0, -1].argmax())
            gen.append(nxt)
        refs.append({"prompt": p, "last_logits": [round(v, 5) for v in logits.tolist()],
                     "greedy": "".join(vocab[i] for i in gen[len(ids) :])})
    return refs


SAMPLE_PROMPTS = [
    "class Stack:\n    def __init__(self):\n        ",
    "def read_config(path):\n    ",
]


@torch.no_grad()
def sample_text(model: TitanNano, vocab: list[str], prompt: str, temperature: float = 0.5, seed: int = 0,
                n: int = 160, top_k: int = 8) -> str:
    """Seeded top-k sampling, the same procedure the browser demo uses. Not cherry-picked: one seed."""
    model.eval()
    stoi = {c: i for i, c in enumerate(vocab)}
    g = torch.Generator().manual_seed(seed)
    ids = [stoi[c] for c in prompt]
    for _ in range(n):
        p = torch.softmax(model(torch.tensor([ids[-model.cfg.ctx:]]))[0][0, -1] / temperature, -1)
        v, ix = p.topk(top_k)
        ids.append(int(ix[torch.multinomial(v / v.sum(), 1, generator=g)]))
    return "".join(vocab[i] for i in ids[len(prompt):])


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="data")
    ap.add_argument("--run", default="runs/titan-nano-v1")
    ap.add_argument("--site", default="../../site")
    args = ap.parse_args()
    data, run, site = Path(args.data), Path(args.run), Path(args.site)
    meta = json.loads((run / "config.json").read_text())
    vocab = json.loads((data / "manifest.json").read_text())["vocab"]
    cfg = Config(**meta["model"])
    test = load_split(data, "test", vocab)

    model = TitanNano(cfg)
    model.load_state_dict(torch.load(run / "best.pt", map_location="cpu"))
    fp = evaluate(model, test, cfg.ctx)
    print(f"float32 test: {fp}", flush=True)

    q, deq = quantise(model.state_dict())
    qmodel = TitanNano(cfg)
    qmodel.load_state_dict(deq)
    i8 = evaluate(qmodel, test, cfg.ctx)
    print(f"int8    test: {i8}", flush=True)

    size = write_bin(q, site / "public/models/titan-nano", cfg, vocab)
    prompts = ["def __init__(self", "import os\nimport sys\n\n\ndef main():\n    ", "    for i in range(len("]
    refs = parity_reference(qmodel, vocab, prompts)
    (run / "parity.json").write_text(json.dumps(refs, indent=1))

    curve = []
    with open(run / "log.csv") as f:
        for row in csv.DictReader(f):
            curve.append({"step": int(row["step"]), "train_bpc": round(float(row["train_loss"]) / math.log(2), 4),
                          "val_bpc": round(float(row["val_loss"]) / math.log(2), 4), "seconds": float(row["seconds"])})
    baselines = json.loads((run / "baselines.json").read_text())
    manifest = json.loads((data / "manifest.json").read_text())
    page = {
        "name": "Titan-nano",
        "version": "v1",
        "params": meta["params"],
        "config": meta["model"],
        "train": {k: meta["train"][k] for k in ("steps", "bs", "lr", "seed")},
        "torch": meta["torch"],
        "threads": meta["threads"],
        "train_seconds": curve[-1]["seconds"],
        "data": {
            "source": "Python " + manifest["python"] + " standard library (.py files, test suites excluded)",
            "licence": "Python Software Foundation License",
            "files": {s: manifest["splits"][s]["files"] for s in ("train", "val", "test")},
            "chars": {s: manifest["splits"][s]["chars"] for s in ("train", "val", "test")},
        },
        "test": {"float32": fp, "int8": i8},
        "baselines": baselines,
        "weights_bytes": size,
        "greedy_examples": [{"prompt": r["prompt"], "greedy": r["greedy"]} for r in refs],
        "samples": [
            {"prompt": pr, "completion": sample_text(qmodel, vocab, pr), "temperature": 0.5, "seed": 0, "top_k": 8}
            for pr in SAMPLE_PROMPTS
        ],
        "curve": curve,
    }
    out = site / "src/data/titan-nano.json"
    out.write_text(json.dumps(page, indent=1))
    print(f"wrote {out} and weights.bin ({size / 1e6:.2f} MB)")


if __name__ == "__main__":
    main()
