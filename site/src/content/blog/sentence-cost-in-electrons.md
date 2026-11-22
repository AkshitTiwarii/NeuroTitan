---
title: "What does a sentence cost in electrons?"
description: "One sentence in 204 languages, traced from tokens to arithmetic to transistors on open silicon, with every formula derived and every number traceable."
field: AI
date: 2026-11-22
updated: 2026-11-22
authors: ["Satyabrat Sahu"]
repo: "https://github.com/NeuroTitan-Hub/sentence-cost-in-electrons"
draft: false
---

Type "Where is the nearest hospital?" into a chatbot in English and in Odia. The meaning is the same. The bill is not.

This post follows that one sentence all the way down. First into tokens, the pieces a language model actually reads. Then into multiply-adds and bytes moved from memory. Then into transistors switching on SkyWater's open 130 nm process, simulated one device at a time. At the bottom we count electrons: the charge that flows through the chip's supply, expressed as a number of electrons.

## Abstract

**Question.** When a language model reads the same sentence in different languages, how much more energy does one language cost than another, and where in the hardware does the difference come from?

**Method.** We follow one sentence through five layers:

1. Tokens: 204 languages, 8 tokenizers, measured.
2. Arithmetic and memory traffic for Qwen3-8B: counted exactly.
3. A model of a GPU server: tested against Deng et al.'s published measurements, with nothing fitted.
4. Transistor-level circuit simulation on the open sky130 process: arithmetic and memory, including chip-to-chip variation.
5. The charge that flows through the supply.

Finally, we measure real GPU energy on a laptop for 18 languages. Every formula is derived in the text, and every number traces to open code and data.

**Findings.** On Qwen3, Odia needs 9.70 times English's tokens and 9.86 times its arithmetic. A model built only from counted memory traffic puts Deng et al.'s 117 languages in the right order (rank correlation 0.94) but makes the gaps too large for 114 of 116 of them. On a server shared by many users, the energy gap grows faster than the token gap: it lies between the token ratio $r$ and $r^2$, and reaches 16.5× for a page of Odia. On silicon, the arithmetic is cheapest at 0.6 to 0.7 V, about 10 times cheaper than at 1.8 V, but minimum-size memory cells need about 1 V or more to work.

**What is new.** No single layer here is new. The contribution is the chain itself: open, end to end, every step derived, simulated or measured, and labelled as which. Along the way it yields a closed-form law for how the language gap grows on shared servers.

**First hardware measurement.** On a laptop GPU, with a smaller model of a different design, energy followed the token count almost one to one across 18 languages (slope 0.997 on log scales), and energy per generated token did not grow with context. That confirms the single-user case of our model. The shared-server mechanism and Qwen3-8B's absolute energies remain unverified.

## Key results

| # | Result | How we know |
|---|---|---|
| 1 | The same text costs Odia 9.70× English's tokens on Qwen3 [95% interval 9.57 to 9.83]. On other tokenizers the same Odia text costs 1.37× to 12.9× | measured |
| 2 | Reading one sentence takes 9.86× more multiply-adds in Odia: 2.02 trillion against 204.5 billion | derived |
| 3 | Counted memory traffic ranks 117 languages' measured GPU energy at 0.94, but over-predicts the size of the gap for 114 of 116 | derived model, checked against measurements by others |
| 4 | On a shared server the gap grows as $G = r\,(1 + (r-1)\,s)$, between $r$ and $r^2$: 16.5× for a page of Odia, against 9.70× the tokens | derived |
| 5 | Arithmetic on sky130 is cheapest at 0.6 to 0.7 V once chip-to-chip variation is counted, about 10× below 1.8 V | simulated |
| 6 | Minimum-size SRAM needs about 1 V on the typical corner and 1.4 to 1.8 V on every corner, so the low-voltage saving applies to arithmetic, not memory | simulated |
| 7 | One English sentence moves $8.8 \times 10^{17}$ electrons of charge through a sky130 chip's supply at 1.8 V; the Odia version moves $8.7 \times 10^{18}$ | derived from simulated energy |
| 8 | On a real laptop GPU, energy follows tokens almost one to one across 18 languages (slope 0.997), and energy per generated token does not grow with context, for one user | measured, on a smaller model of a different design |

## At a glance

![The chain in one picture. One average FLORES sentence read by Qwen3-8B: English needs 27.3 tokens, Odia 264.7 (9.70 times). That is 204.5 billion against 2.02 trillion multiply-adds (9.86 times), 0.25 J against 2.5 J on a simulated sky130 chip at 1.8 V, and 8.8 times 10 to the 17 against 8.7 times 10 to the 18 electrons of charge through the supply. On a GPU server shared by 64 users, a page of Odia costs 16.5 times English's energy.](/blog/sentence-cost-in-electrons/fig-0-abstract.svg)

*Takeaway: the same meaning costs Odia about ten times English's arithmetic. On a busy server it costs more than that, because memory traffic grows faster than the token count.*

## What is new in this work

**Contributions.**

1. **An end-to-end chain from a sentence's language to charge in a circuit.** It is open and rerunnable, and every link is labelled as derived, simulated or measured.
2. **A language-conditioned energy model built from counted memory traffic,** tested against independent GPU measurements with nothing fitted. We report where it fails as fully as where it works.
3. **A closed-form law for the language gap on shared servers,** $G = r\,(1 + (r-1)\,s)$, bounded by $r$ and $r^2$. It matches our full per-request model to within 0.3%.
4. **Circuit evidence on open silicon,** with Monte Carlo variation, that low supply voltage saves energy in arithmetic but not in minimum-size memory.

**What was already established.**

| Layer | Already established | What this post adds |
|---|---|---|
| Tokenizers treat languages unequally | Petrov et al. (2023): up to 15× for the same text | 204 languages × 8 tokenizers, with bootstrap 95% intervals |
| Language changes inference energy | Deng et al. (2026) measured it on GPUs in 122 languages: up to 8.3× per output token and 179× in total, English cheapest. Their explanation is in words: long outputs fill GPU memory, batches shrink, each token costs more | That explanation turned into counted numbers and tested against their data |
| Counting a transformer's arithmetic | Standard | Exact counts for Qwen3-8B, checked against PyTorch's own counter |
| GPU memory limits batching | Known in LLM serving (for example vLLM) | A two-regime formula for cost per token, applied language by language |
| Switching energy, leakage, the minimum-energy supply | Textbook device physics | Transistor-by-transistor simulation of the arithmetic on open sky130, at 3 corners and 13 supplies |
| SRAM stability | Seevinck's method (1987) | 1,000-cell Monte Carlo at 5 corners and 9 supplies on sky130 |
| A sentence's language traced down to charge in a circuit | We found no earlier work doing this end to end. That describes our search, not proof that none exists | The whole chain, with every number traceable to code and data |

## How to read this post

**Reading paths.**

| Time | For | Read |
|---|---|---|
| 5 minutes | Anyone | The [abstract](#abstract), the [key results](#key-results), the picture above, and [what did we actually learn?](#what-did-we-actually-learn) |
| 15 minutes | ML and systems readers | Add [1. Words to tokens](#1-words-to-tokens), [2. Tokens to arithmetic](#2-tokens-to-arithmetic), [3. Arithmetic to a server's clock](#3-arithmetic-to-a-servers-clock) [8. The whole chain](#8-the-whole-chain-one-sentence-two-languages) and [9. A first measurement on real hardware](#9-a-first-measurement-on-real-hardware) |
| The full post | Circuits, semiconductor and physics readers | Everything, including the derivations in [4](#4-a-capacitor-charged) to [7](#7-real-chips-are-not-all-alike) |

Every section opens with **In plain words**: the idea without any symbols. The detail follows.

**Four labels.** Every formula and number carries one, because they are not the same kind of thing:

- **derived**: follows from stated assumptions by algebra or a named physical law. This is a proof, and it is only as good as its assumptions, so we list them.
- **measured**: comes from data, ours or someone else's.
- **simulated**: comes from circuit simulation (ngspice). A simulation is evidence, not proof.
- **assumed**: a modelling choice. We give the range we tried.

Each derivation has the same parts: what it **assumes**, the **steps**, the **result**, and a **check** against data where we have one.

**Glossary.** Tap a term to open it.

<details><summary>Token</summary>A piece of text from the model's fixed vocabulary: a word, part of a word, or a few bytes. The model's work grows with the number of tokens.</details>
<details><summary>Multiply-add (MAC)</summary>One multiplication followed by one addition, a × b + c. Almost all of a language model's arithmetic is multiply-adds.</details>
<details><summary>KV cache</summary>The keys and values the model has already computed for earlier tokens, stored in GPU memory so they need not be recomputed. It grows with every token of context and must be read again for every new token.</details>
<details><summary>Roofline model</summary>A step can go no faster than the memory can deliver bytes, or the processor can do arithmetic, whichever is slower. The slower one is the bottleneck.</details>
<details><summary>Batch</summary>The number of requests a server processes together in one step. Larger batches share the cost of reading the model's weights.</details>
<details><summary>Supply voltage</summary>The voltage that powers the chip. Lower voltage saves energy but makes transistors slower.</details>
<details><summary>Subthreshold leakage</summary>The small current a transistor still passes when it is meant to be off. At low voltage, circuits run slowly and leak for longer, so leakage becomes a large share of the energy.</details>
<details><summary>Static noise margin (SNM)</summary>How large a voltage disturbance a memory cell can absorb without flipping its stored bit. Zero means the cell cannot hold its bit.</details>
<details><summary>Process corner</summary>A worst-case or best-case version of the transistors that a factory might produce: typical, fast, slow, or fast for one transistor type and slow for the other.</details>
<details><summary>Monte Carlo mismatch</summary>Simulating many copies of a circuit, each transistor with its own random variation, to see how many copies fail.</details>
<details><summary>Charge through the supply, in electrons</summary>The energy drawn divided by the charge of one electron times the voltage, E / (qV). Each electron is counted every time it passes through the supply, so this is not the number of distinct electrons in the chip.</details>

## 1. Words to tokens

**In plain words.** A language model does not read letters or words. It reads tokens, pieces of text from a fixed list. Languages that were common when the list was built get long pieces; rarer languages get short ones, so the same sentence needs many more of them. We counted how many, for the same 1,012 sentences in 204 languages.

We tokenized the 1,012 sentences of FLORES-200, the same content translated into 204 languages, with 8 tokenizers.

**Token ratio** [measured]. For language $L$ and tokenizer $T$, with $n_T(s_L)$ the number of tokens in sentence $s$ written in language $L$:

$$
R_{L} = \frac{\sum_{s=1}^{1012} n_T(s_L)}{\sum_{s=1}^{1012} n_T(s_{\text{eng}})}
$$

*Why a ratio of sums and not an average of per-sentence ratios.* A bill is paid per token in total, so the right quantity is total tokens over total tokens. An average of ratios would give a 3-token sentence the same weight as a 60-token one.

**How sure are we?** [derived procedure: the percentile bootstrap].

1. Draw 1,012 sentence indices at random, with replacement.
2. Compute $R_L$ on that resample.
3. Repeat 2,000 times.
4. Take the 2.5th and 97.5th percentiles of the 2,000 values as the 95% interval.

We resample sentence *indices*, so each resample keeps the English and Odia versions of the same sentence paired. The interval then measures how much the ratio depends on which sentences happened to be in FLORES.

On Qwen3's tokenizer, the model Deng et al. measured most:

| Language | Tokens per sentence | Ratio to English [95% interval] |
|---|---|---|
| English | 27.3 | 1.00 |
| Odia | 264.7 | 9.70 [9.57, 9.83] |
| Shan | 284.7 | 10.43 [10.26, 10.60] |

![Token ratio to English on Qwen3's tokenizer for all 204 FLORES languages, sorted. Most languages sit between 1 and 4; Odia (9.7) and Shan (10.4) are at the far end.](/blog/sentence-cost-in-electrons/fig-1-tokens.svg)

*Takeaway: on Qwen3, no language needs fewer tokens than English, 123 of the other 203 need at least twice as many, and Odia needs almost ten times as many.*

Odia is the second most expensive of 204 languages on Qwen3. The tokenizer matters as much as the language: the same Odia text is 1.37× English on BLOOM's tokenizer and 12.9× on Mistral-Nemo's.

## 2. Tokens to arithmetic

**In plain words.** For every token, the model does a fixed amount of arithmetic: about 7.6 billion multiplications, each followed by an addition. On top of that, each token compares itself with every token before it, which costs more the longer the text gets. Both parts can be counted exactly from the model's published shape.

**Lemma: the cost of one matrix** [derived]. Multiplying an $m \times n$ matrix by a vector of length $n$ gives $m$ outputs. Each output is a dot product of length $n$, which is $n$ multiply-adds. So the product costs exactly $mn$ multiply-adds.

**Multiply-adds per token** [derived].

*Assumes:* Qwen3-8B's published shapes:

| Symbol | Meaning | Value |
|---|---|---|
| $\ell$ | layers | 36 |
| $d$ | hidden size | 4,096 |
| $H$ | query heads | 32 |
| $K$ | key-value heads | 8 |
| $h$ | head size | 128 |
| $i$ | MLP width | 12,288 |
| $V$ | vocabulary | 151,936 |

*Steps:* in each layer a token's vector (length $d$) goes through these matrices:

- the query projection, $d \to Hh$;
- the key and value projections, $d \to Kh$ each;
- the output projection, $Hh \to d$;
- and an MLP of three matrices: gate and up, $d \to i$ each, then down, $i \to d$.

After the last layer, the output head maps $d \to V$. Applying the lemma to each matrix and adding:

$$
M_{\text{lin}} = \ell\,\big(\underbrace{dHh}_{Q} + \underbrace{2dKh}_{K,V} + \underbrace{Hhd}_{O} + \underbrace{3di}_{\text{MLP}}\big) + \underbrace{dV}_{\text{head}}
$$

Plugging in, each layer is $16.8 + 8.4 + 16.8 + 151.0 = 192.9$ million. Times 36 that is 6.95 billion, plus 0.62 billion for the head:

$$
M_{\text{lin}} = 7.57 \times 10^9 \ \text{multiply-adds per token}
$$

*What we left out, and how big it is.* Normalisation, rotary position encoding, the MLP's activation and the residual additions all act element by element on vectors of length $d$, $Hh$, $Kh$ or $i$. Together that is roughly $4d + 3(H+K)h + 2i \approx 6 \times 10^4$ simple operations per layer, against $1.9 \times 10^8$ multiply-adds: 0.03%.

**Attention** [derived].

*Assumes:* a token attends to $c$ earlier tokens.

*Steps:* in each layer, each query head computes a score $q \cdot k_j$ for every earlier token $j$, which is $c$ dot products of length $h$. It then forms the weighted sum $\sum_j a_j v_j$, another $c \cdot h$ multiply-adds. Query heads share key-value heads, but each query head still does its own arithmetic. So:

$$
M_{\text{attn}}(c) = 2\,\ell H h\, c = 294{,}912\, c
$$

The softmax adds $H c$ exponentials per layer, which is $1/(2h) = 0.4\%$ of the attention arithmetic. We leave it out.

At $c = 8192$ attention adds 2.42 billion, 24% of the total.

*Check:* a small PyTorch model in the same layout, counted by PyTorch's own operation counter, gave exactly these numbers at three context lengths. The parameter count matches Qwen's published 8.2 billion.

**Reading a whole sentence** [derived]. To read an $n$-token input, token $p$ attends to $p$ tokens (itself and those before it), so:

$$
M_{\text{read}}(n) = n\,M_{\text{lin}} + 2\ell Hh \sum_{p=1}^{n} p = n\,M_{\text{lin}} + 2\ell Hh\,\frac{n(n+1)}{2}
$$

For a 27-token sentence (the English mean, 27.3, rounded) this is $204.3 + 0.1 = 204.5$ billion multiply-adds. For short text the first term dominates, so arithmetic grows almost exactly in step with the token count.

**Bytes per token** [derived]. In 16-bit numbers (2 bytes each), the weights are $2 M_{\text{lin}} = 15.1$ GB. To produce a new token the model must also read the stored keys and values of every earlier token, the KV cache. Per earlier token that is one key vector and one value vector of length $h$, per key-value head, per layer:

$$
k = 2 \cdot \ell \cdot K \cdot h \cdot 2\ \text{bytes} = 2 \cdot 36 \cdot 8 \cdot 128 \cdot 2 = 147{,}456\ \text{bytes}
$$

*In words:* every token of context is 144 KiB that has to be read again for every new token the model writes.

## 3. Arithmetic to a server's clock

**In plain words.** A GPU server answers many users at once, in batches. Each step it must read the whole model from memory once, which the batch shares, plus each user's own stored context. Long texts take more memory per user, so fewer users fit in a batch, and each user carries a bigger share of the cost. We turned that idea into a formula and tested it against real GPU measurements.

Deng et al. ran Qwen3-8B on one NVIDIA L40S with vLLM, which serves many requests at once. To compare with them we need a model of one decoding step for a batch of $b$ requests. NVIDIA's page gives the L40S as 48 GB of memory, 864 GB/s of bandwidth, 362 TFLOPS in 16-bit, and 350 W.

**Time of one step** [derived bound, then an assumption].

*Steps:* each step reads the weights $W$ once for the whole batch, and each request's own KV cache, $k c$ bytes. A memory system cannot deliver bytes faster than its bandwidth, and a processor cannot do arithmetic faster than its peak (2 operations per multiply-add). So the step takes at least

$$
t \;\ge\; \max\!\left(\frac{W + b\,k\,c}{\text{bandwidth}},\ \frac{2 \cdot \text{multiply-adds}}{\text{peak}}\right)
$$

That inequality is derived.

*Assumes:* the step takes exactly this long, with memory and arithmetic overlapping perfectly at their peak rates. This is the "roofline" model.

*Check, and why we use ratios only.* At this equality, English's measured energy per token implies the GPU drew 861 W, but the L40S is limited to 350 W. So real steps take about 2.5 times longer than the ideal. We therefore never use absolute times. We use ratios to English, which are right if the inefficiency is the same factor for every language (an assumption).

**Batch size** [derived from memory capacity].

*Assumes:* $B$ bytes are left for KV cache after weights and runtime (we use 23 GB and tried 20 to 26), and vLLM's cap of 256 requests.

The batch is whatever fits:

$$
b = \min\!\left(256,\ \frac{B}{k\,c}\right), \qquad c = P + \frac{O}{2}
$$

Here $c$ is the mean context: a request carries its prompt of $P$ tokens, and over its life its $O$ output tokens average out to $O/2$.

**Theorem: cost per token in the two regimes** [derived].

*Assumes:* the step is memory-bound (true for every language at these sizes; the test script checks it). Time per token is $t/b$.

*Case 1, memory limits the batch.* This happens when $B/(kc) < 256$, that is, when $c > B/(256k) = 609$ tokens. Substitute $b = B/(kc)$:

$$
\frac{t}{b} = \frac{W + b\,k\,c}{\text{bandwidth}\cdot b} = \frac{1}{\text{bandwidth}}\left(\frac{W k c}{B} + k c\right) = \frac{k\,c}{\text{bandwidth}}\left(1 + \frac{W}{B}\right)
$$

*Case 2, the batch is at its cap.* With $b = 256$:

$$
\frac{t}{b} = \frac{1}{\text{bandwidth}}\left(\frac{W}{256} + k\,c\right)
$$

English, with $c = 313$, is in case 2. Most expensive languages are in case 1. So the predicted ratio for such a language is

$$
\frac{(t/b)_L}{(t/b)_{\text{eng}}} = \frac{k\,c_L\,(1 + W/B)}{W/256 + k\,c_{\text{eng}}}
$$

For Tibetan, $c = 3559$, this gives 8.3×.

*In words:* once memory is full, every term except $c$ is fixed by the model and the GPU, so **cost per token is proportional to context length**. A language whose answers are 20 times longer pays about 20 times more per token, on top of producing 20 times more tokens.

![Batch size against mean context per request, both on log scales, for Qwen3-8B on an L40S with 23 GB for KV cache. The batch stays at vLLM's cap of 256 up to about 609 tokens of context, then falls in proportion to 1 over context. English sits at the cap; Amharic gets 77 requests, Odia 56 and Shan 34.](/blog/sentence-cost-in-electrons/fig-7-memory.svg)

*Takeaway: past about 600 tokens of context, GPU memory rather than the 256-request cap decides how many users share each step. Languages with long contexts share the GPU with fewer others, so each token costs more.*

**Testing it against Deng et al.** [measured inputs, nothing fitted]. Inputs per language:

- their output length, from their table;
- our prompt length: the English Belebele prompt, measured at 220 tokens on Qwen3's tokenizer, times our FLORES ratio;
- the 23 GB we assume is left for KV cache.

The prediction is the formula above. Their energy readings are used only to score it.

| Language | Output tokens per answer | Predicted | Measured (Deng et al.) |
|---|---|---|---|
| Tibetan | 3,937 | 8.3× | 8.1× |
| Southern Pashto | 4,164 | 6.3× | 8.0× |
| Tigrinya | 3,695 | 6.4× | 6.9× |
| Shan | 4,667 | 10.7× | 6.7× |
| Amharic | 2,276 | 4.7× | 4.6× |

![Predicted against measured energy per token, relative to English, for 117 languages on log axes. Points cluster around the diagonal; rank correlation 0.94.](/blog/sentence-cost-in-electrons/fig-2-deng-test.svg)

*Takeaway: counted memory traffic puts the languages in the right order, but predicts gaps that are too large for almost every one of them.*

Over the 117 languages both datasets share, the rank correlation (section 10) is 0.94.

**What that does and does not show.** The theorem above already tells you the catch: in case 1 the model reduces to "cost per token ∝ context". And mean context alone ranks the languages exactly as well, 0.94.

So the test shows that Deng et al.'s explanation is *consistent* with counted memory traffic. It does not prove it, and it does not single out our model over simpler ones. What the model adds is the reason context matters: the bytes, and the memory that limits the batch.

**Where it fails.** The ranking is good, but the sizes are not. The model over-predicts 114 of the 116 languages other than English, and its typical miss (the median, in either direction) is 1.44×. In the figure, almost every point sits below the diagonal. So the model gets the order right and the size of the gap too large.

The worst eight are over-predicted by 2.2 to 2.5×: Burmese, Maltese, Eastern Panjabi, Fulfulde, Sindhi, Gujarati, Odia and Kannada. We have three candidate explanations and cannot separate them without Deng et al.'s per-request data, which they say they will release.

**Time, not bits.** Count only the energy of moving bits and doing multiply-adds: GDDR memory at 7.5 to 14 pJ per bit, and our multiply-add from section 5. Then the top ratio reaches only 3.0 to 4.6×, against 8.1× measured. The energy of the bits themselves does not explain the gap. Time does: the GPU draws power while a small batch waits on memory.

## 4. A capacitor, charged

**In plain words.** Every bit a chip computes or moves ends up as a tiny wire being filled with charge and emptied again. Think of filling a tank through a pipe. The tap supplies a fixed amount of energy, the tank keeps half of it, and friction in the pipe turns the other half into heat, however wide or narrow the pipe. Emptying the tank wastes the half it kept. So every fill-and-empty cycle costs the same energy, and that energy grows with the square of the voltage.

**Theorem: charging costs $CV^2$, half of it lost whatever the resistance** [derived].

*Assumes:* a capacitor $C$, initially empty, connected at $t = 0$ to an ideal supply $V$ through a resistance $R$.

*Steps.* Kirchhoff's voltage law gives $V = IR + q/C$ with $I = dq/dt$. Its solution is

$$
q(t) = CV\left(1 - e^{-t/RC}\right), \qquad I(t) = \frac{V}{R}\, e^{-t/RC}
$$

The supply delivers charge $Q = CV$, all of it at voltage $V$:

$$
E_{\text{supply}} = \int_0^\infty V\, I\, dt = V\,Q = C V^2
$$

The capacitor ends up holding

$$
E_{\text{stored}} = \int_0^{Q} \frac{q}{C}\, dq = \frac{Q^2}{2C} = \frac{1}{2} C V^2
$$

And the resistor turns into heat

$$
E_R = \int_0^\infty I^2 R\, dt = \frac{V^2}{R}\int_0^\infty e^{-2t/RC}\, dt = \frac{V^2}{R}\cdot\frac{RC}{2} = \frac{1}{2} C V^2
$$

*Result:* $E_{\text{supply}} = E_{\text{stored}} + E_R$, as energy conservation requires, and $R$ cancels. A faster or slower transistor changes how quickly the energy is lost, not how much.

When the gate switches back, the stored half is dumped to ground through the other transistor. So one full charge and discharge costs $CV^2$ from the supply. If a gate's output rises with probability $\alpha$ per operation (its activity), on average:

$$
E_{\text{dyn}} = \alpha\, C\, V^2
$$

**Check** [simulated]. A sky130 inverter driving four others takes 12.2 fJ per transition at 1.8 V. $V^2$ scaling predicts $12.2 \times (0.5/1.8)^2 = 0.94$ fJ at 0.5 V. The simulation gives 0.69 fJ. That is lower than $V^2$, because the formula assumes a fixed $C$ and the transistors' own capacitance shrinks at low voltage.

**Electrons, not joules** [derived]. The supply pushes charge $Q = E/V$ through the circuit, which is $N_e = E/(qV)$ electrons, with $q = 1.602 \times 10^{-19}$ C. Since $E \propto V^2$, $N_e \propto V$.

*In words:* halving the voltage moves half the charge, each electron carrying half the energy, so energy falls four times.

*What this number is and is not.* $E/(qV)$ is charge throughput: the charge that passes through the supply, expressed in electrons. The same electrons go round the circuit again and again, and each pass counts. It is not the number of distinct electrons in the chip, which is far smaller. When this post says a sentence costs so many electrons, it means this throughput.

## 5. Transistors: why lower voltage is cheaper and slower

**In plain words.** Lowering the voltage makes each switch cheaper, because energy goes with the square of the voltage. But transistors also get slower, and below about half a volt very quickly: every 0.1 V saved makes them about 9.5 times slower. A transistor that is switched off still leaks a little current, and a slow circuit leaks for longer. So there is a sweet spot: lower than that, the leakage costs more than the switching saves.

**The subthreshold current** [derived, sketch of standard device physics]. Below its threshold voltage $V_{th}$, a transistor does not switch fully off. Electrons cross from source to drain over an energy barrier.

*Assumes:* the electrons are in thermal equilibrium, so the share with enough energy to cross a barrier of height $\phi$ is the Boltzmann factor $e^{-q\phi/kT}$.

*Steps:* the gate lowers the barrier. The gate oxide and the depletion layer underneath form a capacitive divider, so a gate voltage $V_{GS}$ moves the barrier by $V_{GS}/n$, with $n = 1 + C_{\text{dep}}/C_{\text{ox}} \ge 1$. So:

$$
I = I_0 \, e^{(V_{GS} - V_{th})/(n\, v_T)}, \qquad v_T = \frac{kT}{q} = 25.9\ \text{mV at } 27\,^{\circ}\text{C}
$$

*In words:* every $n v_T \ln 10 \approx 60n$ mV less gate voltage cuts the current ten times.

**Delay** [derived]. A gate's delay is roughly the time its on-current takes to move the load's charge: $t_d \approx C V / I_{\text{on}}$. Below threshold, $I_{\text{on}} = I_0 e^{(V - V_{th})/(n v_T)}$, so

$$
\ln t_d = \ln V - \frac{V}{n\,v_T} + \text{constant}
$$

and delay grows exponentially as the supply falls.

**Check, and the value of $n$** [simulated]. The simulated inverter's delay grows:

| Supply step | Delay grows by |
|---|---|
| Each 100 mV between 0.5 V and 0.3 V | 9.3 to 9.8× |
| 0.6 V → 0.5 V | 8.0× |
| 0.7 V → 0.6 V | 5.7× |

Above 0.5 V the growth slows because the transistor is leaving the subthreshold region. From 0.5 V down to 0.4 V delay grows by 9.44×. Taking logarithms of the delay formula at the two supplies:

$$
\ln 9.44 = \ln\frac{0.4}{0.5} + \frac{0.1\ \text{V}}{n\,v_T} \quad\Rightarrow\quad n = \frac{0.1}{0.0259\,(\ln 9.44 + \ln 1.25)} = 1.6
$$

If we drop the slowly varying factor $V$, we get 1.7. Either way $n$ falls in the usual range of 1 to 2 for bulk transistors.

![Simulated inverter delay against supply voltage on a log scale, typical corner. Below 0.5 V the curve is a straight line, about 9.5 times slower per 100 mV.](/blog/sentence-cost-in-electrons/fig-3-delay.svg)

*Takeaway: below about 0.5 V, every 100 mV of supply saved makes the circuit about 9.5 times slower.*

**The minimum-energy supply** [derived form; simulated inputs; assumed activity and depth].

*Assumes:* a block of $N$ gates, each with load $C$ and activity $\alpha$. The clock period is set by a path $L$ gates deep, $T = L\,t_d$. Every gate leaks a current $I_{\text{leak}}$ for the whole period.

*Steps:* energy per operation is switching plus leakage:

$$
E_{\text{op}} = N\alpha C V^2 + N\,I_{\text{leak}}\,V\,T
$$

Substitute $T = L\,CV/I_{\text{on}}$:

$$
E_{\text{op}} = N C V^2 \big(\alpha + L\,\rho(V)\big), \qquad \rho(V) = \frac{I_{\text{leak}}}{I_{\text{on}}}
$$

*Why there is a minimum.* The factor $V^2$ falls as the supply falls. In the ideal subthreshold formula, $I_{\text{leak}} = I_0 e^{-V_{th}/(n v_T)}$ and $I_{\text{on}} = I_0 e^{(V - V_{th})/(n v_T)}$, so $\rho(V) = e^{-V/(n v_T)}$, which grows exponentially as $V$ falls. Write $x = V/(n v_T)$. Then $E_{\text{op}} \propto x^2(\alpha + L e^{-x})$, and setting the derivative to zero:

$$
2\alpha + L e^{-x}(2 - x) = 0 \quad\Longleftrightarrow\quad (x - 2)\,e^{-x} = \frac{2\alpha}{L}
$$

The larger root $x^\ast$ is the minimum. With $n = 1.7$, $L = 20$ and $\alpha$ from 0.02 to 0.2, it sits at $V^\ast = x^\ast n v_T = 0.22$ to $0.35$ V.

The ideal formula also falls toward zero as $V \to 0$. That is not physical: at a few $v_T$, $\rho$ approaches 1, on and off currents become almost equal, and logic stops working.

*Check against simulation.* Our simulated inverter leaks much more than the ideal formula. Its measured ratio $\rho = P_{\text{leak}}\,t_d / E_{\text{dyn}}$ is about 100 times the ideal value between 0.4 and 0.6 V. We have not separated the causes; drain-induced barrier lowering is one known effect the ideal formula leaves out.

Using the simulated $\rho$ instead of the ideal one moves the minimum up. With $L = 20$ and $\alpha$ from 0.02 to 0.2, the typical corner's minimum lands at 0.45 to 0.6 V. There, energy per operation is 10 to 17 times lower than at 1.8 V, and the circuit runs 500 to 13,000 times slower. Every number in the rest of the post uses the simulation, not the ideal formula.

**An 8-bit multiply-add** [simulated plus composed]. We simulated a 28-transistor full adder, transistor by transistor, at 13 supplies and 3 process corners, checking every output for every input pattern. An 8-bit multiply-add is 72 such adders: 56 for the multiplier array, and 16 for a 16-bit accumulator. Its critical path is about 30 carry delays. Using $E_{\text{MAC}} = 72\,(E_{\text{add}} + P_{\text{leak}}\,T)$ with $T = 30\,t_{\text{carry}}$:

| Typical corner | Energy per multiply-add | Electrons per multiply-add | Speed |
|---|---|---|---|
| 1.8 V | 1.25 pJ | 4.3 million | baseline |
| 0.5 V | 0.101 pJ | 1.3 million | about 4,900× slower |

These are lower bounds: AND gates, wires and registers are not counted.

## 6. Memory: the bit that has to travel

**In plain words.** Moving data costs far more than computing on it. Reading one bit from the memory chips beside a processor costs over 100 times more than reading it from memory on the processor itself. A language model's weights are far too big to fit on the processor, so they travel every time. And the tiny memory cells on the chip have their own problem: each one is a pair of switches holding each other in place, and a small disturbance can flip it.

**On-chip SRAM** [simulated]. We simulated a column of 128 six-transistor cells built from SkyWater's own SRAM transistors. Reading a bit (the bit line falls 100 mV, then restores) costs:

| Supply | Energy per bit read |
|---|---|
| 1.8 V | 14.8 fJ |
| 0.9 V | 4.3 fJ |
| 0.5 V | 1.6 fJ |

This is the cell and bit line only. A real cache adds decoders, sense amplifiers and long wires. Horowitz's 45 nm figure for an 8 KB cache at 0.9 V works out to 156 fJ per bit, 36 times our floor at the same voltage.

**Off-chip memory** [measured, published]. From sources we opened:

| Memory | Energy per bit | Source |
|---|---|---|
| GDDR6 | 7.5 pJ | Micron, vendor figure |
| HBM2 | 3.9 to 4.0 pJ | O'Connor et al., NVIDIA, 2017 |
| Commodity DRAM | 20 to 41 pJ | Horowitz, 2014 |

Off-chip costs 100 times or more per bit than on-chip, even against a real cache.

**Energy of moving data** [derived: bits times energy per bit]:

$$
E_{\text{mem}} = \text{bytes} \times 8 \times e_{\text{bit}}
$$

Qwen3-8B's 15.1 GB of weights do not fit in any chip's SRAM, so each decoding step reads them from off-chip memory: $15.1 \times 10^9 \times 8 \times 7.5\ \text{pJ} = 0.91$ J per step on GDDR6.

**SRAM stability** [derived from the definition of Seevinck et al., 1987]. A memory cell is two inverters, each feeding the other. Plot each one's output against its input on the same axes (one with the axes swapped) and you get two curves that cross three times, forming a "butterfly" with two wings. The cell holds a bit as long as both wings are open.

The *static noise margin* is the side of the largest square that fits inside a wing, taking the smaller wing. It is the largest voltage disturbance the cell can absorb without flipping.

*Lemma.* Take a square with sides parallel to the axes, lower-left corner on one curve and upper-right corner on the other. Its diagonal has slope 1. So the side of the largest square equals the largest horizontal distance between the two curves, measured along lines of slope 1:

$$
\text{SNM} = \min_{\text{wings}}\ \max_{\text{lines of slope 1}} \big( x_A - x_B \big)
$$

This is how our code measures it. If a wing closes up, the margin is zero and the cell can hold only one value. *Read* margin is the same measurement with the cell connected to its bit lines, as happens during a read. *Write* margin is the bit-line voltage at which the cell flips.

## 7. Real chips are not all alike

**In plain words.** No factory makes two identical transistors. The smallest ones, used in memory, vary the most. We simulated thousands of slightly different copies to see what that does. Arithmetic still works at low voltage, but it has to run at the pace of its slowest copies, which costs energy. Memory cells start to fail outright: at the voltage where arithmetic is cheapest, most minimum-size cells cannot be read reliably.

**Pelgrom's law** [measured law: an empirical fit to many test chips, built into the foundry's models]. The standard deviation of the threshold difference between two matched transistors falls with their area:

$$
\sigma(\Delta V_{th}) = \frac{A_{V_t}}{\sqrt{W L}}
$$

For one transistor on its own, the spread is $A_{V_t}/\sqrt{2WL}$, because the difference of two independent draws has twice the variance of one. SkyWater's mismatch models apply this to every transistor. SRAM transistors are the smallest on the chip, so they scatter the most.

**Monte Carlo** [simulated].

- **SRAM:** 1,000 cells per process corner, each transistor with its own random draw. For each cell we measured its hold margin, its read margin and whether it writes, at 9 supplies from 1.8 V to 0.5 V.
- **Logic:** 50 copies of the full adder per corner, at 6 supplies from 1.8 V to 0.45 V.

**Theorem: the clock has to wait for the slow copies** [derived].

*Assumes:* a path of $N = 30$ adder stages. Stage delays are independent random variables with mean $\mu$ and standard deviation $\sigma$. (This is true of the transistor-by-transistor mismatch we simulate. Variation shared across the whole chip is what the process corners cover.)

*Steps:* the mean of a sum is the sum of the means, $N\mu$. For independent variables the variance of a sum is the sum of the variances, $N\sigma^2$, so the standard deviation is $\sqrt{N}\sigma$. By the central limit theorem the sum is close to Gaussian. A clock three standard deviations above the mean,

$$
T_{\text{clk}} = N\mu + 3\sqrt{N}\,\sigma
$$

is met by a fraction $\Phi(3) = 99.87\%$ of paths, where $\Phi$ is the standard normal distribution function.

*Consequence for energy:* every gate leaks for the whole period, so $E_{\text{MAC}} = 72\,(E_{\text{add}} + P_{\text{leak}}\,T_{\text{clk}})$. Spread costs energy, not just speed. A real chip has many paths, which all have to pass, so it needs more than 3 sigma. Our variation penalty is therefore a lower bound.

**Theorem: how many sigma a memory needs** [derived].

*Assumes:* a memory works only if every cell works (no spare rows, no error correction). Cells fail independently, each with probability $p$. Margins are Gaussian with mean $\mu$ and standard deviation $\sigma$.

*Steps:* the yield is

$$
Y = (1 - p)^N, \qquad \ln Y = N \ln(1 - p) = -Np - \frac{Np^2}{2} - \cdots
$$

A 1 MB cache has $N = 8 \times 2^{20} = 8.39 \times 10^6$ cells. For $Y = 99\%$, $p = -\ln(0.99)/N = 1.20 \times 10^{-9}$. The dropped term $Np^2/2$ is $6 \times 10^{-12}$, so the approximation $Y \approx e^{-Np}$ is safe. A cell fails when its margin is below zero, with probability $\Phi(-\mu/\sigma)$. Setting that equal to $p$:

$$
\frac{\mu}{\sigma} = -\Phi^{-1}\!\left(1.20 \times 10^{-9}\right) = 5.97 \approx 6
$$

*In words:* a megabyte of memory with no spare rows works only if each cell's margin sits about six standard deviations above failure.

**What 1,000 cells can and cannot see** [derived: the "rule of three"]. If none of $n$ cells fails, any failure rate $p$ with $(1-p)^n < 0.05$ is ruled out at 95% confidence. Solving gives $p < 1 - 0.05^{1/n} \approx 3/n$. For $n = 1000$ that is 0.3%, six orders of magnitude above the $10^{-9}$ we need.

So below a few tenths of a percent we cannot count failures. We extrapolate from $\mu/\sigma$ instead, which assumes the Gaussian tail holds that far out. That is an assumption we cannot test with 1,000 cells.

**SRAM results** [simulated, 1,000 cells per corner and supply, 27 °C]. The share of cells that cannot be read without losing their bit (read margin at or below zero):

| Corner | 1.0 V | 0.9 V | 0.8 V | 0.7 V | 0.6 V | 0.5 V |
|---|---|---|---|---|---|---|
| typical | 0 | 0 | 0 | 0.5% | 15.4% | 69.6% |
| fast | 0 | 0 | 0 | 0.4% | 5.5% | 33.5% |
| slow | 0 | 0 | 3.8% | 27% | 92% | 100% |
| slow n, fast p | 3.9% | 21.6% | 63.1% | 95% | 100% | 100% |

The fifth corner, fast n with slow p, reads well but has trouble writing. 0.1% of its cells cannot be written at 1.0 V, rising to 16% at 0.6 V. On the slow and slow-n corners, many cells cannot even hold their bit with nothing happening: at 0.5 V, 83% on the slow corner and 92.5% on the slow-n corner.

The lowest supply where the margin reaches 6 sigma (the 1 MB rule above):

| Corner | Read | Write |
|---|---|---|
| typical | 1.0 V | 0.9 V |
| fast | 1.0 V | 0.8 V |
| slow | 1.2 V | 1.0 V |
| slow n, fast p | 1.8 V (5.8 sigma at 1.4 V) | 1.2 V |
| fast n, slow p | 0.7 V | 1.4 V |

![Share of SRAM cells that fail to read, against supply voltage, for four process corners, with the logic's cheapest supply band (0.5 to 0.6 V) shaded. In that band, 5 to 100% of cells fail.](/blog/sentence-cost-in-electrons/fig-5-sram.svg)

*Takeaway: at the voltages where arithmetic is cheapest, 5 to 100% of minimum-size memory cells fail to read, so memory needs a higher supply than logic.*

**What it means.** The logic in section 5 is cheapest near 0.5 to 0.6 V. Minimum-size SRAM cells on this process need about 1 V on the typical corner, and 1.4 to 1.8 V to work on every corner, if they are to fill a 1 MB memory with no spare rows. At 0.5 V, 70% of typical cells fail. So the saving from low voltage applies to arithmetic, not to on-chip memory. Real chips handle this by giving SRAM its own, higher supply, or with larger cells and extra assist circuits. Those cost area and energy we have not counted.

**Logic results** [simulated, 50 adders per corner and supply, 27 °C]. Every copy added correctly at every point but one: 1 of 50 fast-corner adders gave a wrong sum at 0.45 V. The cost of variation is in time, not in errors. Adder delay spreads more as the supply falls. Its standard deviation over mean on the typical corner:

| Supply | 1.8 V | 1.0 V | 0.7 V | 0.5 V |
|---|---|---|---|---|
| Spread | 2% | 7% | 25% | 47% |

With the clock set by the theorem above, energy per 8-bit multiply-add:

| Corner | 1.8 V | 1.0 V | 0.7 V | 0.6 V | 0.5 V | 0.45 V |
|---|---|---|---|---|---|---|
| typical, no variation | 1245 fJ | 342 fJ | 155 fJ | 116 fJ | **101 fJ** | 121 fJ |
| typical, with variation | 1245 fJ | 336 fJ | 156 fJ | **123 fJ** | 134 fJ | 180 fJ |
| slow, with variation | 1252 fJ | 326 fJ | 148 fJ | **119 fJ** | 150 fJ | 262 fJ |
| fast, with variation | 1276 fJ | 353 fJ | **182 fJ** | 185 fJ | 382 fJ | 684 fJ |

(1 fJ = 0.001 pJ. The lowest value in each row is in bold.)

![Energy per 8-bit multiply-add against supply voltage, log scale: one ideal typical adder, and typical, slow and fast corners with variation. Each curve has a minimum between 0.5 and 0.7 V.](/blog/sentence-cost-in-electrons/fig-4-energy.svg)

*Takeaway: once chip-to-chip variation is counted, the cheapest supply is 0.6 to 0.7 V rather than 0.5 V, and the best saving falls from 12× to about 10×.*

At 1.0 V and above, variation changes little. At 0.5 V it adds 32% on the typical corner, because the clock must wait for the slow copies and every gate leaks while it waits. The cheapest supply moves up: from 0.5 V to 0.6 V on the typical and slow corners, and to 0.7 V on the fast corner, which leaks most. The best saving over 1.8 V falls from 12× to about 10× (1245 / 123).

## 8. The whole chain: one sentence, two languages

**In plain words.** Now put the steps together for one sentence. Odia needs about ten times the tokens, so about ten times the arithmetic, so about ten times the energy and charge on a chip. If you use a model alone, that is the whole story. On a busy server shared by many users, the gap grows further, because the part of the work that depends on how much text came before grows faster than the token count.

Put it together for reading one FLORES sentence with Qwen3-8B (prompt processing, one pass).

**Arithmetic** [derived, sections 1 and 2]. A 27-token English sentence needs 204.5 billion multiply-adds. The 265-token Odia version needs 9.86 times as many: slightly more than the 9.7× token ratio, because attention grows with $n^2$.

**What one multiply-add means here** [assumed mapping]. Qwen3-8B on a GPU multiplies 16-bit floating-point numbers (bf16) and adds the results in 32-bit. Our circuit multiplies two 8-bit integers and accumulates into 16 bits. So this is a stand-in, and it leaves out:

- registers and the wires that bring operands to the multiplier;
- control logic and clock distribution;
- on-chip memory (section 6 covers it separately);
- everything a real GPU adds around its arithmetic units.

*How much the number format matters.* Horowitz's 45 nm figures give 0.23 pJ for an 8-bit integer multiply-add and 1.5 pJ for a 16-bit floating-point one, about 6.5 times more. If the same ratio held on sky130 (we have not tested it), a bf16-style multiply-add would cost about 8 pJ at 1.8 V, and every arithmetic energy in the next table would rise by the same factor. Read the table as a floor for the arithmetic alone.

**Energy and electrons** [simulated energy per operation; sky130; lower bound]. With $E = M \cdot E_{\text{MAC}}$ and $N_e = E/(qV)$:

| | English, 1.8 V | English, 0.5 V | Odia, 1.8 V | Odia, 0.5 V |
|---|---|---|---|---|
| Arithmetic energy | 0.25 J | 0.021 J | 2.5 J | 0.20 J |
| Charge through the supply, in electrons | $8.8 \times 10^{17}$ | $2.6 \times 10^{17}$ | $8.7 \times 10^{18}$ | $2.5 \times 10^{18}$ |

<div data-electron-explorer data-src="/blog/sentence-cost-in-electrons/explorer.json">
<p><em>The interactive explorer needs JavaScript. The table above gives the same numbers for English and Odia.</em></p>
</div>

Going from 1.8 V to 0.5 V cuts energy 12.3 times but electrons only 3.4 times. That is what section 4 predicts: $12.3 \times 0.5/1.8 = 3.4$, because energy goes as $V^2$ and charge as $V$. This table uses one typical adder with no variation. With variation (section 7) the 0.5 V column rises by about a third, and the cheapest supply becomes 0.6 V.

This is arithmetic alone, on 130 nm silicon, as a lower bound. Reading the weights once from GDDR6 memory adds 0.91 J, for any language. On a modern GPU every number here is different. We have not opened a source for 4 to 5 nm energies, so we make no claim about today's chips.

**Alone versus on a busy server** [derived]. For this part we use published figures for both costs: a 45 nm 16-bit multiply-add (1.5 pJ, Horowitz) and GDDR6 memory.

**Theorem: the language gap lies between $r$ and $r^2$** [derived].

*Assumes:* a language with token ratio $r$ has a prompt $P_L = rP$ and an answer $O_L = rO$ tokens long, where $P$ and $O$ are English's. Each request's share of the weight reads is $W/b$ per step.

*Steps:* split one request's energy into two parts.

- **Linear part:** the weight reads and the fixed per-token arithmetic. It is proportional to the number of tokens, so it scales as $r$.
- **Quadratic part:** attention arithmetic and KV-cache reads. Output token $j$ attends to $P + j$ earlier tokens, so this part is proportional to

$$
\sum_{j=1}^{O} (P + j) = OP + \frac{O(O+1)}{2} \approx O\left(P + \frac{O}{2}\right)
$$

which scales as $r^2$ (and likewise for the prompt, $\sum_p p \approx P^2/2$).

Let $s$ be the share of English's energy in the quadratic part. Then the energy ratio is

$$
G = (1-s)\,r + s\,r^2 = r\,\big(1 + (r-1)\,s\big)
$$

Since $0 \le s \le 1$, $G$ lies between $r$ and $r^2$.

*Check:* the closed form matches our full per-request model to within 0.3% in all six cases we ran (1, 20 and 200 input sentences, alone or in a batch of 64).

*In words:*

- **Alone, with short text:** weight reads are 97.5 to 98.4% of the energy, so $s$ is near zero and the energy gap equals the token gap. Odia costs 9.75× English, against a token ratio of 9.70×.
- **On a server shared with 64 users:** the weight reads are split 64 ways, $s$ grows, and the gap grows faster than the token gap.
- **A page of text and a short answer:** Odia rises to 16.5× ($s = 0.08$). Across the three multiply-add energies and three memory energies we tried, and the token count's 95% interval, it ranges from 13.9 to 31.5×.
- **A long document:** Odia reaches 24× ($s = 0.17$), with a range of 21 to 63×.

![Energy ratio to English against token ratio, alone and on a busy server, with the curves y = r and y = r squared as bounds.](/blog/sentence-cost-in-electrons/fig-6-gap.svg)

*Takeaway: on a shared server, the energy gap between languages grows faster than the token gap, toward its square.*

## 9. A first measurement on real hardware

**In plain words.** Everything above is calculation or simulation, so we measured. On a laptop GPU, we gave a language model the same 20 sentences in 18 languages, asked it to copy them back, and recorded the GPU's power ten times a second. Energy followed the token count almost exactly: a language that needed four times the tokens used about four times the energy. And each generated token cost about the same whatever the language and however long the text. That is what our formulas predict for one user alone.

**Setup** [measured].

| | |
|---|---|
| GPU | NVIDIA GeForce RTX 4060 Laptop GPU, 8 GB |
| Power reading | Board power from nvidia-smi (`power.draw.instant`) every 100 ms. NVIDIA gives these readings as accurate to ±5 W |
| Model | A 4-bit fine-tune of Qwen3.5-4B, served by Ollama 0.31.2, entirely in GPU memory |
| Text | The first 20 FLORES-200 devtest sentences in each of 18 languages |
| Tasks | **copy**: "Copy the following text exactly", so the answer is as long as the text and in the same language. **read**: "Reply with only the word OK", which isolates the cost of reading the prompt |
| Controls | Temperature 0. A unique request number at the start of every prompt, so no request reuses cached work from another. Language order shuffled in each repeat |

This is not the model of sections 2 and 3: Qwen3-8B needs about 16 GB, which this GPU does not have. The model here also differs in design. Only 8 of its 32 main layers keep a KV cache that grows with every token; the other 24 keep a fixed-size state. So this run tests what does not depend on that difference.

**Energy of one request** [derived from measured power]. With power samples $P(t_i)$ every 100 ms, the energy of a request from $t_0$ to $t_1$ is the trapezoid sum

$$
E = \sum_i \frac{P(t_i) + P(t_{i+1})}{2}\,(t_{i+1} - t_i)
$$

over the samples between $t_0$ and $t_1$. Splitting the sum at the first generated token gives the energy of reading the prompt and of writing the answer.

**What went wrong, and how we handled it.** The laptop's charger came out 26 minutes into the run. The GPU dropped from about 88 W to about 42 W while copying, and ran about a third slower. We analyse only the requests that finished before the switch: 34 copies, covering all 18 languages, 16 of them twice. The requests made on battery are kept separate, as a check, and never mixed in. Even while plugged in, the laptop changed power state once more. As a result, 6 of the 16 languages with two repeats agree within 5%, but 10 differ by more than 15%. The numbers below are means, and a controlled rerun is planned.

**Results, plugged in** [measured].

| Language | Tokens read | Token ratio | Energy per request | Energy ratio | Energy per generated token |
|---|---|---|---|---|---|
| English | 728 | 1.00 | 1.08 kJ | 1.00 | 1.47 J |
| Chinese (Simplified) | 734 | 1.01 | 1.25 kJ | 1.16 | 1.71 J |
| Hindi | 1,450 | 1.99 | 2.27 kJ | 2.11 | 1.55 J |
| Tamil | 1,960 | 2.69 | 2.72 kJ | 2.53 | 1.37 J |
| Burmese | 2,374 | 3.26 | 4.30 kJ | 3.99 | 1.79 J |
| Odia | 2,778 | 3.81 | 4.48 kJ | 4.16 | 1.59 J |
| Amharic | 2,940 | 4.04 | 5.40 kJ | 5.02 | 1.82 J |
| Khmer | 3,944 | 5.41 | 6.90 kJ | 6.41 | 1.85 J |
| Shan | 5,604 | 7.69 | 8.46 kJ | 7.86 | 1.69 J |

Nine of the 18 languages are shown; the rest are in the [code and data](https://github.com/NeuroTitan-Hub/sentence-cost-in-electrons).

- **Energy against tokens.** Across all 18 languages, the slope of log energy ratio against log token ratio is 0.997, and the rank correlation is 0.94.
- **Per generated token.** Energy ranges from 1.32 to 1.98 J. A straight-line fit against context length has slope $(1.8 \pm 2.4) \times 10^{-5}$ J per token of context ($R^2 = 0.03$): no measurable growth over 1,000 to 8,000 tokens.
- **Per token read.** About 32 mJ per prompt token of board energy (±4 mJ, $R^2 = 0.67$), or 25 mJ above idle. So writing a token costs about 50 times more than reading one.

![GPU power over time for one English and one Odia copy request, plugged in. Both start with a short low-power stretch, then the prompt is read in under a second and the answer is written at a steady 100 to 105 W. English finishes after 11 seconds, Odia after 43.](/blog/sentence-cost-in-electrons/fig-8-telemetry.svg)

*Takeaway: the GPU draws about the same power whatever the language. Odia costs more because the same text takes four times as long to write.*

![Measured energy ratio against token ratio for 18 languages on log axes, plugged in. The points lie close to the line where the energy ratio equals the token ratio, from English at 1 to Shan at about 7.8.](/blog/sentence-cost-in-electrons/fig-9-measured-gap.svg)

*Takeaway: measured on hardware, energy follows the token count almost one to one for a single user.*

![Energy per generated token against mean context length for 18 languages, plugged in. All points lie between 1.3 and 2.0 J with no upward trend from about 1,000 to 8,000 tokens.](/blog/sentence-cost-in-electrons/fig-10-per-token.svg)

*Takeaway: for one user on this model, a generated token costs the same whether the text so far is short or long.*

**What this confirms, and what it does not.**

- **Confirmed on hardware: energy follows tokens for one user.** Section 8's theorem gives $G = r$ when the context-dependent share $s$ is near zero. One user alone, on a model where only a quarter of the layers keep a growing cache, is that case. The measured slope is 0.997.
- **Confirmed: the tokenizer is a lever.** The same Odia text costs 3.81× English's tokens on this model's tokenizer (248,320 entries), against 9.70× on Qwen3's. The energy gap shrinks with it.
- **Consistent with our explanation, but not proof of it.** Deng et al. measured per-token energy varying up to 8.3× between languages on a busy server. Here, with one user, per-token energy hardly varies. That fits the claim that the per-token gap comes from batching and memory on a shared server rather than from the language itself. But this is a different model, so it supports the claim without proving it.
- **Not tested.** Batching and memory pressure (we sent one request at a time), Qwen3-8B itself, and absolute energies for any server.
- **The battery runs as a check.** The 20 battery-powered copies show the same pattern: rank correlation 0.99, slope 0.92. Each request used about 23% less energy, at about two-thirds of the speed. That is in the direction section 5 predicts for lower clock and voltage, but we did not measure voltage, so we claim nothing more.
- **Caveats.** Board power only, not CPU or memory. Two repeats, with the spread described above. For Shan, the model did not copy faithfully: it wrote 16% more characters than it was given. Its per-token energy is still valid; its total is less clean.

## 10. Statistics we used

**In plain words.** Two tools carry the statistics. A rank correlation asks only whether two lists put the languages in the same order. A bootstrap estimates how much a result would change with a different sample of sentences.

**Rank correlation** [derived definition]. Spearman's $\rho$ is the ordinary (Pearson) correlation computed on ranks instead of values. It asks only whether the two lists put the languages in the same order, so one large miss cannot dominate it. With no ties it reduces to

$$
\rho = 1 - \frac{6 \sum_i d_i^2}{n(n^2 - 1)}
$$

where $d_i$ is the difference between language $i$'s predicted and measured rank. Deng et al.'s per-token energies have two decimals, so 117 languages share only 24 distinct values. The shortcut formula is then wrong, so we give tied values their average rank and compute the Pearson correlation of those ranks directly.

**Intervals** [derived procedure]. All 95% intervals on token ratios are percentile bootstrap intervals over sentences (section 1). The ranges on the busy-server gaps are not statistical intervals. They are the spread over the modelling choices we tried, which we report because we do not know the true values.

## What did we actually learn?

**Measured by us.**

- Token counts for 204 languages on 8 tokenizers.
- The length of the English Belebele prompt: 220 tokens.
- GPU energy per request, per token read and per token generated, for 18 languages on a laptop GPU (section 9), with a model smaller than and different from Qwen3-8B.

**Measured by others, used here.**

- Deng et al.'s GPU energy per language.
- Published energy per bit for off-chip memory (Horowitz, O'Connor et al., Micron).

**Derived, from stated assumptions.**

- Operation and byte counts.
- The cost per token in its two regimes.
- The bound $r \le G \le r^2$ on the language gap.
- Charging energy $CV^2$.
- The 6-sigma rule for memory.

**Simulated, not measured on hardware.**

- Every sky130 energy, delay and memory margin, including the Monte Carlo runs.

**Predicted by our model and checked against measurement.**

- The order of languages by energy per token: rank correlation 0.94 with Deng et al.
- For one user, energy follows the token count: measured slope 0.997 on our own GPU.

**Predicted but not yet verified.**

- Absolute energy per language: our model over-predicts 114 of 116 languages.
- Whether memory pressure on batch size is really what drives the gap.
- How energy splits between reading and writing on a server. On our laptop GPU, a generated token cost about 50 times a token read.
- Anything about modern chips, or about temperatures other than 27 °C.

**Next.** A controlled rerun with the laptop's power mode held fixed and more repeats, several requests at once to test the batching mechanism directly, and, with more GPU memory, Qwen3-8B itself.

## Limitations

- **One small hardware measurement.** Section 9 is a single laptop GPU, a 4-bit model smaller than Qwen3-8B and of a different design, one request at a time, and at most two repeats per language with a 5 to 47% spread. Every other energy number is derived, simulated, or measured by others.
- **One process, one temperature.** 130 nm open silicon at 27 °C. Chips run hotter, and leakage grows quickly with temperature. Our memory figures are published ones from 2014 to 2020; we make no claim about 4 to 5 nm chips.
- **Floors, not totals.** Our multiply-add and SRAM numbers leave out gates, wires, decoders, sense amplifiers and control. The 8-bit circuit stands in for 16-bit floating-point arithmetic (section 8).
- **Prompt lengths are scaled, not measured.** We measured the English Belebele prompt only; other languages are scaled by our FLORES ratio.
- **An idealised server.** The roofline model's absolute times are about 2.5 times too short, so we use ratios only. It assumes vLLM-style batching up to 256 requests.
- **A difference we have not closed.** An earlier 128-cell column test (with a real write driver) failed to write on the slow corner at 0.8 V and below. The Monte Carlo cell, with an ideally driven bit line, writes down to 0.7 V. The likely cause is the write driver and the loaded bit line, not the cell, but we have not confirmed it.
- **The explorer's server mode** uses published energies (45 nm arithmetic, GDDR6 memory), not our sky130 simulations, and shows energy, not electrons, because we do not model a GPU's supply voltages.
- **No outside review before publishing.** If an expert finds an error, we fix it here with a dated note.

## Reproducibility

All code and data are at [github.com/NeuroTitan-Hub/sentence-cost-in-electrons](https://github.com/NeuroTitan-Hub/sentence-cost-in-electrons), under MIT for code and CC BY-SA 4.0 for data.

One script, `m6/popper_check.py`, recomputes every number in this post from the data files. The analysis steps (operation counts, the server model, the whole chain) rerun in seconds. The circuit simulations need ngspice 47 and the sky130 PDK, at the versions given in the repository.

## Updates

- **22 November 2026, evening.** Added section 9, our first measurement on real hardware: GPU energy for 18 languages on a laptop GPU. Energy follows the token count for one user, as the model predicts. We also report what went wrong (the charger came out mid-run) and how we handled it.
- **22 November 2026, later.** Restructured for clarity, prompted by an outside reader's review:
  - an abstract, key results and four numbered contributions;
  - a plain-language opening to every section;
  - a visual abstract, reading paths and a glossary;
  - a memory-pressure figure and a takeaway under every figure;
  - an account of how our 8-bit circuit stands in for the model's 16-bit arithmetic;
  - a note that our electron counts are charge throughput, not distinct electrons;
  - a closing section on what we measured, derived, simulated and have not verified.

  No result changed.
- **22 November 2026.** Corrected section 8: the 13.9 to 31.5× range for Odia covers the multiply-add and memory energies we tried and the token count's 95% interval. It does not cover prompt lengths and memory budgets, as we first wrote. Added the explorer's second mode, the whole request on a GPU server. Read the abstracts of Seevinck et al. and Pelgrom et al., and checked our 8.3× and 179× against Deng et al.'s abstract, which gives the same figures.

## Sources

- Deng et al., "The Language-Energy Divide: Measuring Energy Costs of Multilingual LLM Inference", arXiv 2606.21869v3, EMNLP 2026.
- Petrov, La Malfa, Torr, Bibi, "Language Model Tokenizers Introduce Unfairness Between Languages", NeurIPS 2023, arXiv 2305.15425.
- Horowitz, "Computing's energy problem (and what we can do about it)", ISSCC 2014, DOI 10.1109/ISSCC.2014.6757323.
- O'Connor et al., "Fine-Grained DRAM", MICRO 2017, DOI 10.1145/3123939.3124545.
- Micron GDDR6X figures via Tom's Hardware, 2020-09-06 (vendor claim).
- Seevinck, List, Lohstroh, "Static-noise margin analysis of MOS SRAM cells", IEEE Journal of Solid-State Circuits 22(5), 748-754, October 1987, DOI 10.1109/JSSC.1987.1052809. We read the abstract (IEEE Xplore, 2026-11-22): the paper derives the static noise margin analytically and gives a way to simulate it. The largest-square construction we quote is the standard form of their definition. It is in the body of the paper, which we have not read.
- Pelgrom, Duinmaijer, Welbers, "Matching properties of MOS transistors", IEEE Journal of Solid-State Circuits 24(5), 1433-1439, October 1989, DOI 10.1109/JSSC.1989.572629 (details from Crossref). We read the abstract (IEEE Xplore, 2026-11-22): the paper analyses and measures threshold-voltage mismatch. The area law we quote is the standard form of their result. It is in the body of the paper, which we have not read.
- NLLB Team / Meta, FLORES-200, CC BY-SA 4.0. Belebele (facebook/belebele), CC BY-SA 4.0.
- SkyWater SKY130 PDK; ngspice 47.
- NVIDIA L40S product page, opened 2026-11-19.
