"""Titan-nano: a small decoder-only transformer over characters.

Deliberately plain so it can be re-implemented line for line in the browser
(site/src/lib/titan.ts):
  - learned token and position embeddings
  - pre-LayerNorm blocks: x += Attn(LN(x)); x += MLP(LN(x))
  - causal multi-head self-attention, MLP with tanh-approximated GELU
  - final LayerNorm, output head tied to the token embedding
"""
from __future__ import annotations

import math
from dataclasses import asdict, dataclass

import torch
import torch.nn as nn
import torch.nn.functional as F


@dataclass
class Config:
    vocab_size: int = 96
    ctx: int = 256
    n_layer: int = 4
    n_head: int = 4
    d_model: int = 192
    dropout: float = 0.1

    def to_dict(self) -> dict:
        return asdict(self)


class Attention(nn.Module):
    def __init__(self, c: Config):
        super().__init__()
        self.n_head = c.n_head
        self.qkv = nn.Linear(c.d_model, 3 * c.d_model)
        self.proj = nn.Linear(c.d_model, c.d_model)
        self.drop = nn.Dropout(c.dropout)
        self.register_buffer("mask", torch.tril(torch.ones(c.ctx, c.ctx)).view(1, 1, c.ctx, c.ctx), persistent=False)

    def forward(self, x: torch.Tensor, return_attn: bool = False):
        B, T, C = x.shape
        q, k, v = self.qkv(x).split(C, dim=2)
        hd = C // self.n_head
        q = q.view(B, T, self.n_head, hd).transpose(1, 2)
        k = k.view(B, T, self.n_head, hd).transpose(1, 2)
        v = v.view(B, T, self.n_head, hd).transpose(1, 2)
        if not return_attn:
            # Fused kernel for training speed; mathematically the same as the explicit path below.
            y = F.scaled_dot_product_attention(q, k, v, is_causal=True, dropout_p=self.drop.p if self.training else 0.0)
            y = y.transpose(1, 2).contiguous().view(B, T, C)
            return self.drop(self.proj(y)), None
        att = (q @ k.transpose(-2, -1)) / math.sqrt(hd)
        att = att.masked_fill(self.mask[:, :, :T, :T] == 0, float("-inf"))
        att = F.softmax(att, dim=-1)
        y = self.drop(att) @ v
        y = y.transpose(1, 2).contiguous().view(B, T, C)
        y = self.drop(self.proj(y))
        return (y, att) if return_attn else (y, None)


class Block(nn.Module):
    def __init__(self, c: Config):
        super().__init__()
        self.ln1 = nn.LayerNorm(c.d_model)
        self.attn = Attention(c)
        self.ln2 = nn.LayerNorm(c.d_model)
        self.fc = nn.Linear(c.d_model, 4 * c.d_model)
        self.out = nn.Linear(4 * c.d_model, c.d_model)
        self.drop = nn.Dropout(c.dropout)

    def forward(self, x: torch.Tensor, return_attn: bool = False):
        a, att = self.attn(self.ln1(x), return_attn)
        x = x + a
        x = x + self.drop(self.out(F.gelu(self.fc(self.ln2(x)), approximate="tanh")))
        return x, att


class TitanNano(nn.Module):
    def __init__(self, c: Config):
        super().__init__()
        self.cfg = c
        self.tok = nn.Embedding(c.vocab_size, c.d_model)
        self.pos = nn.Embedding(c.ctx, c.d_model)
        self.drop = nn.Dropout(c.dropout)
        self.blocks = nn.ModuleList([Block(c) for _ in range(c.n_layer)])
        self.ln_f = nn.LayerNorm(c.d_model)
        self.apply(self._init)
        for name, p in self.named_parameters():  # scaled init for residual projections (GPT-2)
            if name.endswith("proj.weight") or name.endswith("out.weight"):
                nn.init.normal_(p, mean=0.0, std=0.02 / math.sqrt(2 * c.n_layer))

    @staticmethod
    def _init(m: nn.Module) -> None:
        if isinstance(m, nn.Linear):
            nn.init.normal_(m.weight, mean=0.0, std=0.02)
            nn.init.zeros_(m.bias)
        elif isinstance(m, nn.Embedding):
            nn.init.normal_(m.weight, mean=0.0, std=0.02)

    def forward(self, idx: torch.Tensor, targets: torch.Tensor | None = None, return_attn: bool = False):
        B, T = idx.shape
        x = self.drop(self.tok(idx) + self.pos(torch.arange(T, device=idx.device)))
        attns = []
        for b in self.blocks:
            x, att = b(x, return_attn)
            attns.append(att)
        logits = self.ln_f(x) @ self.tok.weight.T  # tied output head
        loss = None if targets is None else F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1))
        return logits, loss, (attns if return_attn else None)

    def n_params(self) -> int:
        return sum(p.numel() for p in self.parameters())
