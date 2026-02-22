export type SocialLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type Project = {
  title: string;
  href: string;
  date: string;
  stack: string[];
  summary: string;
  points: string[];
};

export type BlogEntry = {
  title: string;
  href: string;
  source: string;
  role: string;
  stack: string[];
  summary: string;
  points: string[];
};

export type ExperienceEntry = {
  title: string;
  org: string;
  role: string;
  points: string[];
};

export type SkillGroup = {
  title: string;
  chips: string[];
};

export const profileLinks: SocialLink[] = [
  {
    label: "github",
    href: "https://github.com/Aditya-1304",
    external: true,
  },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/aditya-mandal1304/",
    external: true,
  },
  {
    label: "x",
    href: "https://x.com/AdityaMandal_",
    external: true,
  },
  {
    label: "email",
    href: "mailto:mandaladitya1614@gmail.com",
  },
];

export const projects: Project[] = [
  {
    title: "Laminar",
    href: "https://github.com/Aditya-1304/Laminar",
    date: "Jan 2026 - Present",
    stack: ["Rust", "Anchor", "TypeScript", "Pyth SDK"],
    summary:
      "Non-liquidatable leverage protocol on Solana built around tranche-based risk accounting.",
    points: [
      "Deterministic solvency engine with strict fixed-point math and invariant checks.",
      "Stability pool design for atomic debt-for-equity swaps in tail-risk scenarios.",
    ],
  },
  {
    title: "x402-Flash",
    href: "https://github.com/Aditya-1304/x402-flash",
    date: "Oct 2025 - Nov 2025",
    stack: ["Solana", "Anchor", "Rust", "TypeScript", "Redis"],
    summary:
      "Micropayment protocol for AI-agent transactions using HTTP 402 and WebSocket flow.",
    points: [
      "Hybrid settlement engine with Redis-backed voucher validation.",
      "Oracle-assisted dynamic fee strategy for reliable high-throughput settlement.",
    ],
  },
  {
    title: "AdiChess Engine",
    href: "https://github.com/Aditya-1304/chess_engine",
    date: "2025 - Present",
    stack: ["Rust", "UCI", "NNUE", "Alpha-Beta", "Lazy SMP"],
    summary:
      "UCI-compatible Rust chess engine focused on strong search depth and efficient evaluation.",
    points: [
      "Implements PVS, Null Move Pruning, and LMR with a lock-less transposition table.",
      "Uses HalfKP NNUE evaluation and multi-threaded Lazy SMP for stronger practical play.",
    ],
  },
  {
    title: "Moggu",
    href: "https://github.com/Aditya-1304/moggu",
    date: "August 2025",
    stack: ["Rust", "Ratatui", "Crossterm", "Tokio", "Image Crate"],
    summary:
      "Ultra-fast terminal image processing tool with pro filters and sub-200ms workflow.",
    points: [
      "21+ filters across color, enhancement, artistic, and geometric operations.",
      "Inline terminal preview support (chafa/viu) with responsive TUI and async file flow.",
    ],
  },
  {
    title: "Pump.fun Indexer",
    href: "https://github.com/Aditya-1304/pumpfun_indexer",
    date: "Oct 2025",
    stack: ["Solana", "Rust", "Tokio", "Redis", "SQLx"],
    summary:
      "Low-latency event indexer for Pump.fun market activity on Solana.",
    points: [
      "Custom Borsh parser for CREATE, TRADE, and COMPLETE events.",
      "Dual storage path: PostgreSQL persistence + Redis Pub/Sub real-time stream.",
    ],
  },
  {
    title: "Solana AI Agent",
    href: "https://github.com/Aditya-1304/solana-sdk",
    date: "Apr 2025 - Jun 2025",
    stack: ["Rust", "Anchor", "TypeScript", "Solana Web3.js"],
    summary:
      "Intent-to-transaction engine that maps natural language to Solana actions.",
    points: [
      "Modular action mapping for swaps, transfers, and token instructions.",
      "Plugin-ready architecture for AMM integrations and strategy extensions.",
    ],
  },
];

export const blogs: BlogEntry[] = [
  {
    title: "How Rust Uses Memory Behind the Scenes",
    href: "https://medium.com/@mandaladitya1614/how-rust-uses-memory-behind-the-scenes-062c7d16bf02",
    source: "Medium",
    role: "Technical deep dive",
    stack: ["Rust", "Memory", "Ownership", "Systems"],
    summary:
      "A practical breakdown of how Rust handles memory safety and performance under the hood.",
    points: [
      "Explains stack vs heap allocation and Rust ownership flow.",
      "Covers borrowing, lifetimes, and how safety works without a GC.",
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    title: "Open Source Contributor",
    org: "Helius Rust SDK",
    role: "Helius, Remote",
    points: [
      "Implemented getTransactionsForAddress in the Helius Rust SDK for historical transaction querying.",
      "Added integration tests and docs to keep behavior aligned with Helius API contracts.",
    ],
  },
  {
    title: "Solana Smart Contract Freelancer",
    org: "Multiple Clients",
    role: "Remote",
    points: [
      "Built a validator bidding platform with secure SPL-token transfers and Merkle whitelist logic.",
      "Collaborated on an RFP-generating agent with LangChain to reduce proposal drafting time.",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "languages",
    chips: [
      "Rust",
      "C/C++",
      "SQL (Postgres)",
      "NoSQL",
      "JavaScript/TypeScript",
      "HTML/CSS",
    ],
  },
  {
    title: "frameworks",
    chips: ["Anchor", "React", "Node.js", "Next.js"],
  },
  {
    title: "blockchain",
    chips: ["Solana", "Tokio", "Helius RPC", "Axum", "Actix"],
  },
  {
    title: "infra",
    chips: ["Docker", "Git", "Redis"],
  },
];

export const footerLinks: SocialLink[] = [
  {
    label: "email",
    href: "mailto:mandaladitya1614@gmail.com",
  },
  {
    label: "github",
    href: "https://github.com/Aditya-1304",
    external: true,
  },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/aditya-mandal1304/",
    external: true,
  },
  {
    label: "x",
    href: "https://x.com/AdityaMandal_",
    external: true,
  },
  {
    label: "discord",
    href: "https://discord.com/users/641275206324977664",
    external: true,
  },
];

export const resumeUrl =
  "https://drive.google.com/file/d/1dtaCC-Gs6WchlqW27Xw54irT_CxEfC2R/view";

export const githubProfileUrl = "https://github.com/Aditya-1304";

export const githubUser = "Aditya-1304";
