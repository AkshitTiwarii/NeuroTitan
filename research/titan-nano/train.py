"""Train Titan-nano on CPU. Seeded and logged; rerun with the same arguments to reproduce.

Outputs in --run:
  config.json       model and training settings, torch version, thread count
  log.csv           step, train_loss, val_loss, lr, seconds
  best.pt           weights with the lowest validation loss
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import time
from pathlib import Path

import numpy as np
import torch

from model import Config, TitanNano


def load_split(data: Path, split: str, vocab: list[str]) -> torch.Tensor:
    stoi = {ch: i for i, ch in enumerate(vocab)}
    text = (data / f"{split}.txt").read_text(encoding="ascii")
    return torch.tensor(np.frombuffer(bytes(stoi[c] for c in text), dtype=np.uint8).astype(np.int64))


def batch(data: torch.Tensor, ctx: int, bs: int, gen: torch.Generator):
    ix = torch.randint(len(data) - ctx - 1, (bs,), generator=gen)
    x = torch.stack([data[i : i + ctx] for i in ix])
    y = torch.stack([data[i + 1 : i + ctx + 1] for i in ix])
    return x, y


@torch.no_grad()
def estimate(model: TitanNano, data: torch.Tensor, ctx: int, bs: int, n: int, seed: int) -> float:
    model.eval()
    g = torch.Generator().manual_seed(seed)  # same batches every time, so curves are comparable
    losses = [model(*batch(data, ctx, bs, g))[1].item() for _ in range(n)]
    model.train()
    return float(np.mean(losses))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="data")
    ap.add_argument("--run", default="runs/titan-nano-v1")
    ap.add_argument("--steps", type=int, default=3000)
    ap.add_argument("--bs", type=int, default=64)
    ap.add_argument("--lr", type=float, default=1e-3)
    ap.add_argument("--warmup", type=int, default=150)
    ap.add_argument("--eval-every", type=int, default=250)
    ap.add_argument("--seed", type=int, default=1337)
    ap.add_argument("--threads", type=int, default=0, help="0 = torch default")
    args = ap.parse_args()

    torch.manual_seed(args.seed)
    if args.threads:
        torch.set_num_threads(args.threads)
    data = Path(args.data)
    vocab = json.loads((data / "manifest.json").read_text())["vocab"]
    cfg = Config(vocab_size=len(vocab))
    train, val = load_split(data, "train", vocab), load_split(data, "val", vocab)

    model = TitanNano(cfg)
    decay = [p for n, p in model.named_parameters() if p.dim() >= 2]
    no_decay = [p for n, p in model.named_parameters() if p.dim() < 2]
    opt = torch.optim.AdamW([{"params": decay, "weight_decay": 0.1}, {"params": no_decay, "weight_decay": 0.0}],
                            lr=args.lr, betas=(0.9, 0.95))

    run = Path(args.run)
    run.mkdir(parents=True, exist_ok=True)
    meta = {"model": cfg.to_dict(), "train": vars(args), "params": model.n_params(), "torch": torch.__version__,
            "threads": torch.get_num_threads(), "train_chars": len(train), "val_chars": len(val)}
    (run / "config.json").write_text(json.dumps(meta, indent=1))
    print(f"params={model.n_params():,} train_chars={len(train):,} threads={torch.get_num_threads()}", flush=True)

    def lr_at(step: int) -> float:
        if step < args.warmup:
            return args.lr * (step + 1) / args.warmup
        p = (step - args.warmup) / max(1, args.steps - args.warmup)
        return args.lr * (0.1 + 0.9 * 0.5 * (1 + math.cos(math.pi * p)))  # cosine to 10%

    gen = torch.Generator().manual_seed(args.seed)
    best = float("inf")
    t0 = time.time()
    with open(run / "log.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["step", "train_loss", "val_loss", "lr", "seconds"])
        running = None
        for step in range(args.steps + 1):
            lr = lr_at(step)
            for g in opt.param_groups:
                g["lr"] = lr
            x, y = batch(train, cfg.ctx, args.bs, gen)
            _, loss, _ = model(x, y)
            opt.zero_grad(set_to_none=True)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            opt.step()
            running = loss.item() if running is None else 0.98 * running + 0.02 * loss.item()
            if step % args.eval_every == 0 or step == args.steps:
                v = estimate(model, val, cfg.ctx, args.bs, 24, seed=0)
                secs = time.time() - t0
                w.writerow([step, f"{running:.4f}", f"{v:.4f}", f"{lr:.6f}", f"{secs:.1f}"])
                f.flush()
                print(f"step {step:5d}  train {running:.3f}  val {v:.3f}  ({v / math.log(2):.3f} bpc)  {secs:6.0f}s", flush=True)
                if v < best:
                    best = v
                    torch.save(model.state_dict(), run / "best.pt")
    print(f"done. best val loss {best:.4f} ({best / math.log(2):.3f} bits/char)")


if __name__ == "__main__":
    main()
