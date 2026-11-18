/**
 * Site-wide facts. Everything here must be true and checkable.
 * No counts (projects, papers, contributors) appear on the site until each one
 * links to the record that backs it.
 */

export const SITE = {
  name: "NeuroTitan Labs",
  url: "https://neurotitan.in",
  description:
    "Independent research lab working in machine learning, semiconductor design and quantum computing. Every result ships with the code and data behind it.",
  email: "neurotitancontact@gmail.com",
  github: "https://github.com/NeuroTitan-Hub",
} as const;

export const NAV = [
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export type Field = {
  id: "ai" | "semiconductors" | "quantum";
  index: string;
  name: string;
  summary: string;
  detail: string[];
  tools: string[];
};

export const FIELDS: Field[] = [
  {
    id: "ai",
    index: "01",
    name: "Machine learning",
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
    summary:
      "Quantum algorithms, variational methods and quantum machine learning, run on simulators with realistic noise and compared against classical baselines tuned just as carefully.",
    detail: [
      "A quantum method only matters if it beats the best classical method given the same budget. We set up that comparison before we look at the quantum result.",
      "Our experiments run on simulators unless a post says otherwise. We do not describe simulator results as hardware results.",
    ],
    tools: ["Qiskit", "PennyLane", "Cirq", "Qiskit Aer noise models"],
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

/** Work that exists today and can be opened. */
export const PROJECTS = [
  {
    name: "ECHO",
    href: "https://echoneuro.vercel.app/",
    note: "A wearable built into prescription glasses, with ESP32 firmware. In development.",
  },
  {
    name: "QML-benchmarks",
    href: "https://github.com/Satyabrat2005/QML-benchmarks",
    note: "Implementations and noisy-simulation benchmarks of QCNN, QFT, Grover, Shor, HHL, VQE and QAOA.",
  },
  {
    name: "NeuroTitan-Hub on GitHub",
    href: "https://github.com/NeuroTitan-Hub",
    note: "All of the lab's public repositories.",
  },
] as const;

export const PEOPLE = [
  { name: "Satyabrat Sahu", role: "Founder", github: "https://github.com/Satyabrat2005" },
  { name: "Kartik Bhardwaj", role: "Co-founder", github: "https://github.com/kartik1446" },
  { name: "Ashutosh Rath", role: "Co-founder", github: "https://github.com/GitGudScrubss" },
] as const;

export const CAMPUS_AMBASSADOR_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSdbtblF3w5Nqnckn_gW1zs3ybf24725lcJaZOKR54gunskXcg/viewform";
