/*
 * The lab figure: one set of points that becomes each field in turn. Used on the homepage and in
 * the opening of inner pages. Sharp points on a canvas; still under reduced motion; pauses off screen.
 *
 * <canvas data-figure data-shapes="0,1,2"> picks which shapes to cycle through (0 network, 1 chip,
 * 2 sphere); one shape means it stays and only turns. An element with data-figure-caption and
 * data-captions (JSON, one per shape index) is updated as the shape changes.
 */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function loopWhileVisible(el: Element, draw: (t: number) => void) {
  let on = false;
  let raf = 0;
  const tick = (t: number) => {
    draw(t);
    raf = requestAnimationFrame(tick);
  };
  const update = () => {
    const want = on && document.visibilityState === "visible";
    if (want && !raf) raf = requestAnimationFrame(tick);
    if (!want && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  new IntersectionObserver(([e]) => {
    on = e.isIntersecting;
    update();
  }).observe(el);
  document.addEventListener("visibilitychange", update);
}

/* Shapes ----------
 * Machine learning: five layers of a network, with an activation wave moving through them.
 * Semiconductors:   a die grid, with a signal sweeping across it.
 * Quantum:          points on a Bloch sphere, with a state circle precessing around it.
 * Same 840 points every time; they glide from one shape to the next.
 */
type V3 = [number, number, number];
const N = 840;

function networkShape(): V3[] {
  const layers = 5;
  const radii = [0.78, 0.6, 0.42, 0.6, 0.78];
  const per = N / layers;
  const out: V3[] = [];
  for (let l = 0; l < layers; l++) {
    for (let i = 0; i < per; i++) {
      const r = radii[l] * Math.sqrt((i + 0.5) / per);
      const a = i * 2.39996323; // golden angle: an even disc of points
      out.push([-1.35 + (l * 2.7) / (layers - 1), r * Math.sin(a), r * Math.cos(a)]);
    }
  }
  return out;
}

function chipShape(): V3[] {
  // 28 x 30 grid = 840, a flat die
  const out: V3[] = [];
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 30; j++) {
      out.push([-1 + (2 * j) / 29, 0, -0.93 + (1.86 * i) / 27]);
    }
  }
  return out;
}

function sphereShape(): V3[] {
  const out: V3[] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.39996323;
    out.push([r * Math.cos(a), y, r * Math.sin(a)]);
  }
  return out;
}

/** How "lit" (red) a point is in each shape at time t, from 0 to 1. */
const accents = [
  // network: a wave moving from the input layer to the output layer
  (p: V3, t: number) => clamp(1 - Math.abs(((p[0] + 1.35) / 2.7) * 4 - ((t * 1.4) % 6.5 - 1)) * 2.4),
  // chip: a signal line sweeping across the die
  (p: V3, t: number) => clamp(1 - Math.abs(p[0] - (((t * 0.7) % 2.6) - 1.3)) * 14),
  // sphere: a great circle (the state's orbit) precessing around the vertical axis
  (p: V3, t: number) => {
    const a = t * 0.8;
    const n: V3 = [Math.sin(a) * 0.6, 0.8, Math.cos(a) * 0.6];
    return clamp(1 - Math.abs(p[0] * n[0] + p[1] * n[1] + p[2] * n[2]) * 12);
  },
];

export function figure(c: HTMLCanvasElement) {
  const order = (c.dataset.shapes || "0,1,2").split(",").map(Number);
  const caption = c.parentElement?.querySelector<HTMLElement>("[data-figure-caption]") ?? null;
  const captions: string[] = JSON.parse(caption?.dataset.captions || "[]");
  const shapes = [networkShape(), chipShape(), sphereShape()];
  // Each shape has the camera angle that reads best for it; the camera glides between them.
  const views = [
    { yaw: 0.52, pitch: -0.16 }, // network: layers seen side by side
    { yaw: 0.45, pitch: -0.95 }, // chip: looking down on the die
    { yaw: 0, pitch: -0.32 }, // sphere
  ];
  // Network connections: a fixed sample of links between neighbouring layers.
  const per = N / 5;
  const links: [number, number][] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let l = 0; l < 4; l++) {
    for (let k = 0; k < 46; k++) {
      links.push([l * per + Math.floor(rnd() * per), (l + 1) * per + Math.floor(rnd() * per)]);
    }
  }
  const chipCorners: V3[] = [
    [-1.08, 0, -1.01],
    [1.08, 0, -1.01],
    [1.08, 0, 1.01],
    [-1.08, 0, 1.01],
  ];

  const ctx = c.getContext("2d")!;
  let w = 0;
  let h = 0;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.clientWidth;
    h = c.clientHeight;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener("resize", resize);

  let mx = 0;
  let my = 0;
  addEventListener("pointermove", (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  });
  let rx = 0;
  let ry = 0;

  const HOLD = 4.4; // seconds a shape stays
  const MORPH = 1.6; // seconds to glide to the next
  const CYCLE = HOLD + MORPH;
  let shown = -1;
  const PX = new Float32Array(N);
  const PY = new Float32Array(N);
  const LIT = new Float32Array(N);

  const spin = (p: V3, a: number): V3 => {
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    return [p[0] * ca + p[2] * sa, p[1], -p[0] * sa + p[2] * ca];
  };

  const draw = (ms: number) => {
    const t = ms / 1000;
    const k = Math.floor(t / CYCLE);
    const phase = t - k * CYCLE;
    const from = order[k % order.length];
    const to = order[(k + 1) % order.length];
    const m = from === to || phase < HOLD ? 0 : easeInOut((phase - HOLD) / MORPH);
    const current = m < 0.5 ? from : to;
    if (caption && current !== shown && captions[current]) {
      shown = current;
      caption.classList.remove("is-in");
      void caption.offsetWidth;
      caption.textContent = captions[current];
      caption.classList.add("is-in");
    }
    const weight = (i: number) => (from === i ? 1 - m : 0) + (to === i ? m : 0);

    rx += (my * 0.12 - rx) * 0.05;
    ry += (mx * 0.25 - ry) * 0.05;
    const yaw = views[from].yaw + (views[to].yaw - views[from].yaw) * m + 0.22 * Math.sin(t * 0.35) + ry;
    const pitch = views[from].pitch + (views[to].pitch - views[from].pitch) * m + rx;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const scale = Math.min(w, h) * 0.34;
    const ox = w / 2;
    const oy = h / 2;
    const project = (x: number, y: number, z: number) => {
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const persp = 3.4 / (3.4 + z2);
      return [ox + x1 * scale * persp, oy + y2 * scale * persp, z2] as const;
    };

    ctx.clearRect(0, 0, w, h);
    const sphereSpin = t * 0.25;
    const A = shapes[from];
    const B = shapes[to];

    // points
    const pts: { x: number; y: number; d: number; lit: number }[] = [];
    for (let i = 0; i < N; i++) {
      const a = from === 2 ? spin(A[i], sphereSpin) : A[i];
      const b = to === 2 ? spin(B[i], sphereSpin) : B[i];
      const mi = clamp(m * 1.25 - (i / N) * 0.25);
      const [px, py, z2] = project(
        a[0] + (b[0] - a[0]) * mi,
        a[1] + (b[1] - a[1]) * mi,
        a[2] + (b[2] - a[2]) * mi,
      );
      const lit = (1 - mi) * accents[from](a, t) + mi * accents[to](b, t);
      PX[i] = px;
      PY[i] = py;
      LIT[i] = lit;
      pts.push({ x: px, y: py, d: clamp((1.2 - z2) / 2.4), lit });
    }

    // network links (fade with the network's share of the picture)
    const wn = weight(0);
    if (wn > 0.02) {
      ctx.lineWidth = 0.6;
      for (const [i, j] of links) {
        const hot = Math.min(LIT[i], LIT[j]);
        ctx.strokeStyle = hot > 0.2 ? `rgba(229,87,78,${0.6 * wn * hot})` : `rgba(236,232,225,${0.1 * wn})`;
        ctx.beginPath();
        ctx.moveTo(PX[i], PY[i]);
        ctx.lineTo(PX[j], PY[j]);
        ctx.stroke();
      }
    }

    // chip outline and pads
    const wc = weight(1);
    if (wc > 0.02) {
      const cs = chipCorners.map((p) => project(p[0], p[1], p[2]));
      ctx.strokeStyle = `rgba(236,232,225,${0.4 * wc})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      cs.forEach(([x, y], n) => (n ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.stroke();
      ctx.strokeStyle = `rgba(236,232,225,${0.22 * wc})`;
      for (let n = 0; n < 8; n++) {
        const u = -0.85 + (n * 1.7) / 7;
        for (const [p0, p1] of [
          [[u, 0, -1.01], [u, 0, -1.2]],
          [[u, 0, 1.01], [u, 0, 1.2]],
        ] as [V3, V3][]) {
          const [x0, y0] = project(p0[0], p0[1], p0[2]);
          const [x1, y1] = project(p1[0], p1[1], p1[2]);
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }
    }

    // sphere axis and equator
    const ws = weight(2);
    if (ws > 0.02) {
      ctx.strokeStyle = `rgba(236,232,225,${0.2 * ws})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      const [ax0, ay0] = project(0, -1.25, 0);
      const [ax1, ay1] = project(0, 1.25, 0);
      ctx.beginPath();
      ctx.moveTo(ax0, ay0);
      ctx.lineTo(ax1, ay1);
      ctx.stroke();
      ctx.beginPath();
      for (let n = 0; n <= 64; n++) {
        const a = (n / 64) * Math.PI * 2;
        const [ex, ey] = project(Math.cos(a) * 1.02, 0, Math.sin(a) * 1.02);
        if (n) ctx.lineTo(ex, ey);
        else ctx.moveTo(ex, ey);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // points last, far ones first
    pts.sort((p, q) => p.d - q.d);
    for (const p of pts) {
      const r = (0.75 + p.d * 1.35) * (1 + p.lit * 0.7);
      ctx.fillStyle =
        p.lit > 0.05 ? `rgba(229,87,78,${0.35 + 0.65 * p.lit})` : `rgba(236,232,225,${0.16 + p.d * 0.76})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, 6.2832);
      ctx.fill();
    }
  };

  if (reduce) {
    draw(1200);
    return;
  }
  loopWhileVisible(c, draw);
}


document.querySelectorAll<HTMLCanvasElement>("canvas[data-figure]").forEach(figure);
