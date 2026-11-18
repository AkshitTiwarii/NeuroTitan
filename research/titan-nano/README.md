# Titan-nano

NeuroTitan Labs' first language model: a character-level decoder-only transformer, trained from scratch on CPU to complete Python code, and run in the browser on our own TypeScript inference engine (`site/src/lib/titan.ts`).

## Reproduce

Python 3.13, PyTorch 2.11 (CPU), NumPy, Node 22. From this folder:

```bash
python data.py --out data                                   # build train/val/test from the local Python stdlib, split by file
python train.py --run runs/titan-nano-v1 --steps 2200 --bs 32 --eval-every 200 --threads 24 --seed 1337
python baselines.py --run runs/titan-nano-v1                # character n-grams, order picked on validation
python export.py --run runs/titan-nano-v1                   # full test eval (float32 and int8), write site files
node --experimental-strip-types parity.test.ts runs/titan-nano-v1   # browser engine must match PyTorch
```

**Windows note.** Windows 11 can put a training process started from a background shell into power-throttled "efficiency" mode, where it uses only a few cores (we measured 3 of 32). Run training from a foreground terminal, or disable power throttling for the process. Wall-clock time in `log.csv` for the published run includes about 10 throttled minutes at the start.

`data.py` reads whichever Python is installed, so a different Python version gives a slightly different dataset. The run in `runs/titan-nano-v1/config.json` records the versions used.

## Files

| File | What it does |
|---|---|
| `data.py` | Collects stdlib `.py` files (no test suites), normalises to printable ASCII, splits ~90/5/5 by a hash of each file path |
| `model.py` | The transformer: learned token and position embeddings, pre-LN blocks, causal attention, tanh-GELU MLP, tied output head |
| `train.py` | AdamW, warmup + cosine schedule, gradient clipping, fixed-batch validation; logs to `log.csv`, keeps the best checkpoint |
| `baselines.py` | Witten-Bell interpolated character n-grams, orders 0-7 |
| `export.py` | Sliding-window evaluation over every test character, int8 quantisation (one scale per row), browser export, parity references |
| `parity.test.ts` | Runs `site/src/lib/titan.ts` on the exported weights and compares with PyTorch |
| `runs/titan-nano-v1/` | `config.json`, `log.csv`, `baselines.json`, `parity.json` for the published run |

Not committed: `data/` (regenerate with `data.py`) and `best.pt` (float32 checkpoint; the int8 weights the site runs are in `site/public/models/titan-nano/`).

## Data and licence

Training data is the Python standard library source, under the Python Software Foundation License. The model and code in this folder are published by NeuroTitan Labs.

## Limits

Trained on one codebase; completes lines and short blocks; 256-character window; can produce plausible but wrong code. A research and teaching model, not a product.
