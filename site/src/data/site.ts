/**
 * Site-wide facts. Everything here must be true and checkable.
 * No counts (projects, papers, contributors) appear on the site unless they
 * are computed from a source at build time (see src/lib/github.ts).
 */

export const SITE = {
  name: "NeuroTitan Labs",
  url: "https://neurotitan.in",
  description:
    "Independent research lab working in machine learning, semiconductor design and quantum computing. Every result ships with the code and data behind it.",
  email: "neurotitancontact@gmail.com",
  github: "https://github.com/NeuroTitan-Hub",
  githubOrg: "NeuroTitan-Hub",
} as const;

export const NAV = [
  { href: "/ai", label: "NeuroTitan AI" },
  { href: "/semiconductors", label: "Semiconductors" },
  { href: "/research", label: "Research" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export type Field = {
  id: "ai" | "semiconductors" | "quantum";
  index: string;
  name: string;
  href: string;
  summary: string;
  detail: string[];
  tools: string[];
};

export const FIELDS: Field[] = [
  {
    id: "ai",
    index: "01",
    name: "Machine learning",
    href: "/ai",
    summary:
      "Deep learning, NLP, reinforcement learning and large language models. We care most about measurement: what a technique costs, where it breaks, and whether a published result reproduces.",
    detail: [
      "Most claims about models are made on hardware and budgets that readers do not have. We test them at the scale people actually run: small open models, a single machine, fixed seeds.",
      "When we reproduce a paper we report the numbers that matched and the ones that did not, with the configuration that produced each.",
    ],
    tools: ["PyTorch", "Hugging Face", "llama.cpp", "scikit-learn"],
  },
  {
    id: "semiconductors",
    index: "02",
    name: "Semiconductors",
    href: "/semiconductors",
    summary:
      "Device behaviour, digital design and open EDA. We build circuits on the open SkyWater 130 nm process with open tools, so anyone can rerun the flow from RTL to layout.",
    detail: [
      "Textbook trade-offs (speed against area, supply voltage against energy) look different after synthesis, placement and routing. We measure them on a real process design kit instead of quoting them.",
      "Every design comes with its RTL or netlist, testbench, flow configuration and the raw reports the figures are drawn from.",
    ],
    tools: ["Verilog / SystemVerilog", "Yosys", "OpenROAD", "Magic", "ngspice", "SkyWater sky130 PDK"],
  },
  {
    id: "quantum",
    index: "03",
    name: "Quantum computing",
    href: "/research#quantum",
    summary:
      "Quantum algorithms, variational methods and quantum machine learning, run on simulators with realistic noise and compared against classical baselines tuned just as carefully.",
    detail: [
      "A quantum method only matters if it beats the best classical method given the same budget. We set up that comparison before we look at the quantum result.",
      "Our experiments run on simulators unless a post says otherwise. We do not describe simulator results as hardware results.",
    ],
    tools: ["Qiskit", "PennyLane", "Cirq", "Qiskit Aer noise models"],
  },
];

/** The six AI domains from the original site, rewritten to describe the work plainly. */
export const AI_DOMAINS = [
  {
    name: "Natural language processing",
    body: "Language models, tokenization and evaluation. How text becomes numbers, and how much meaning survives the trip, especially for Indian languages.",
  },
  {
    name: "Computer vision",
    body: "Recognition, detection and segmentation with OpenCV and deep networks, measured on public datasets with fixed splits.",
  },
  {
    name: "Reinforcement learning",
    body: "Agents that learn from interaction, including reinforcement-learning search over neural architectures.",
  },
  {
    name: "Neural architecture",
    body: "How structure (depth, width, attention, quantization) trades accuracy against memory and speed on ordinary hardware.",
  },
  {
    name: "AI safety and evaluation",
    body: "Fair baselines, honest error bars and reproducible evaluations, so a claim about a model can be checked by someone else.",
  },
  {
    name: "Generative AI",
    body: "Models that produce text, images and code: what they can be trusted with, and what it costs to run them locally.",
  },
] as const;

export type Product = {
  name: string;
  status: "In development" | "Open source" | "Concept" | "In research";
  kind: "live" | "dev" | "idle";
  summary: string;
  points: string[];
  links: { label: string; href: string }[];
};

/** Only things that exist. Status words are deliberate: see the office audit, finding F1. */
export const PRODUCTS: Product[] = [
  {
    name: "ECHO",
    status: "In development",
    kind: "dev",
    summary:
      "A memory assistant for people living with Alzheimer's, built into prescription glasses. Context-aware cues for the wearer, real-time alerts for caregivers.",
    points: ["ESP32 hardware and firmware", "Face, voice and emotion detection", "Privacy-first design"],
    links: [
      { label: "Project site", href: "https://echoneuro.vercel.app/" },
      { label: "Code", href: "https://github.com/NeuroTitan-Hub/echo_1" },
    ],
  },
  {
    name: "NeuroTitan AI",
    status: "In research",
    kind: "dev",
    summary:
      "Our language-model work. No model has been released yet; the first results are measurements of tokenizers, quantization and small-model training, published with code.",
    points: ["Live tokenizer playground on this site", "Evaluation code released with every result"],
    links: [{ label: "Read more", href: "/ai" }],
  },
  {
    name: "QML-benchmarks",
    status: "Open source",
    kind: "live",
    summary:
      "Implementations and noisy-simulation benchmarks of QCNN, QFT, Grover, Shor, HHL, VQE and QAOA: scalability, optimisation behaviour and robustness under NISQ noise.",
    points: ["Qiskit and PennyLane", "Structured, repeatable experiments"],
    links: [{ label: "Code", href: "https://github.com/Satyabrat2005/QML-benchmarks" }],
  },
  {
    name: "OmniMind",
    status: "Concept",
    kind: "idle",
    summary:
      "A design for a multi-agent decision system that combines reinforcement learning, forecasting and language-model reasoning. Currently an architecture document, not working software.",
    points: ["Multi-agent reinforcement learning", "Simulation before action"],
    links: [{ label: "Design document", href: "https://github.com/NeuroTitan-Hub/OmniMind" }],
  },
  {
    name: "NeuroTitan AI dev hub",
    status: "Open source",
    kind: "live",
    summary:
      "The lab's shared repository for building and testing AI projects across NLP, vision and reinforcement learning.",
    points: ["Open to contributors"],
    links: [{ label: "Code", href: "https://github.com/NeuroTitan-Hub/NeuroTitan-Ai_dev" }],
  },
];

export const PRINCIPLES = [
  {
    title: "Code and data with every result",
    body: "Each post links a public repository with the code, the data, the random seeds and the exact versions used. A reader should be able to rerun it from the README.",
  },
  {
    title: "Negative results count",
    body: "If a reproduction misses the paper's number, or an idea does not work, we publish that and say by how much.",
  },
  {
    title: "Fair baselines",
    body: "A new method is compared against the strongest simple alternative with the same tuning budget, not against a weak one.",
  },
  {
    title: "Open tools",
    body: "We prefer open-source tools and open process design kits, so that nothing we report depends on a licence the reader cannot get.",
  },
] as const;

/** The three pillars from the original site, kept and stated as commitments. */
export const PILLARS = [
  { title: "Open source", body: "Code, data and designs are public by default. Private work is the exception and we say why." },
  { title: "Research first", body: "We start from a question and a primary source, not from a product pitch." },
  { title: "Community", body: "Students and engineers can join through the campus ambassador programme and contribute on GitHub." },
] as const;

export const TOOLS = [
  "PyTorch", "llama.cpp", "Hugging Face", "Qiskit", "PennyLane", "Cirq", "Yosys", "OpenROAD",
  "Magic VLSI", "ngspice", "SkyWater sky130", "Verilog", "Icarus Verilog", "OpenCV", "ESP32",
] as const;

export const PEOPLE = [
  { name: "Satyabrat Sahu", role: "Founder", github: "https://github.com/Satyabrat2005" },
  { name: "Kartik Bhardwaj", role: "Co-founder", github: "https://github.com/kartik1446" },
  { name: "Ashutosh Rath", role: "Co-founder", github: "https://github.com/GitGudScrubss" },
] as const;

export const CAMPUS_AMBASSADOR_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSdbtblF3w5Nqnckn_gW1zs3ybf24725lcJaZOKR54gunskXcg/viewform";
