export type SocialLink = {
  label: string;
  href: string;
  external?: boolean;
  copyValue?: string;
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
    href: "https://github.com/ShreyanshGolchha01",
    external: true,
  },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/shreyansh-golchha-04113816b/",
    external: true,
  },
  {
    label: "x",
    href: "https://x.com/ShreyanshGolch5",
    external: true,
  },
  {
    label: "email",
    href: "mailto:shreyanshgolchha1112@gmail.com",
  },
];

export const projects: Project[] = [
  {
    title: "SkillBridge",
    href: "#",
    date: "Jan 2026 - Ongoing",
    stack: ["React", "Node.js", "MongoDB", "Express.js"],
    summary:
      "A web platform connecting students and companies through freelance and internship opportunities.",
    points: [
      "Built a full-stack MERN application where students apply for roles and companies post requirements.",
      "Implemented authentication, role-based access (student/company), and college-focused listings.",
    ],
  },
  {
    title: "Green Palna",
    href: "https://gpy.ssipmt.in/admin/login",
    date: "Apr 2025 - Jul 2025",
    stack: ["Node.js", "Express.js", "Flutter", "SQL"],
    summary:
      "A government-focused platform promoting plantation awareness and environmental sustainability.",
    points: [
      "Developed participation and tracking flows for tree-plantation and structured green initiatives.",
      "Implemented user engagement, data tracking, and awareness campaign features.",
    ],
  },
  {
    title: "TiffinHub",
    href: "https://tiffinhub.live",
    date: "Aug 2025 - Ongoing",
    stack: ["Node.js", "Flutter", "React", "MongoDB"],
    summary:
      "A full-stack app for PG students to track and manage daily tiffin usage efficiently.",
    points: [
      "Built a calendar-based system to monitor and maintain day-wise tiffin counts.",
      "Integrated frontend and backend with React, Node.js, and MongoDB-based storage.",
    ],
  },
  {
    title: "Jewellery Website",
    href: "#",
    date: "Jul 2025 - Aug 2025",
    stack: ["HTML", "CSS", "Bootstrap"],
    summary:
      "A responsive jewellery website developed during vocational training.",
    points: [
      "Designed a mobile-friendly layout using Bootstrap grid system and containers.",
      "Implemented responsive behavior across screen sizes and devices.",
    ],
  },
];

export const blogs: BlogEntry[] = [
  {
    title: "Blog Title",
    href: "#",
    source: "Platform",
    role: "Article type",
    stack: ["Topic 1", "Topic 2"],
    summary: "Add your blog summary here.",
    points: ["Add takeaway 1.", "Add takeaway 2."],
  },
];

export const experience: ExperienceEntry[] = [
  {
    title: "Web Development Trainee",
    org: "Skyvo Technologies Pvt Ltd",
    role: "Raipur, In-office",
    points: [
      "Learned and worked with Angular framework to develop basic web application components.",
      "Built small projects implementing frontend features, component structure, and responsive UI.",
    ],
  },
  {
    title: "Web Development Intern",
    org: "Acedemor",
    role: "Delhi, Online",
    points: [
      "Learned fundamentals of MongoDB, Express.js, React.js, and Node.js during the internship program.",
      "Developed a small full-stack web project implementing basic CRUD operations and frontend-backend integration.",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "languages",
    chips: [
      "C/C++",
      "Python",
      "Java",
      "JavaScript",
      "PHP",
      "SQL",
      "Dart",
    ],
  },
  {
    title: "frameworks",
    chips: ["React", "Node.js", "Flutter", "Flask", "Bootstrap"],
  },
  {
    title: "core competencies",
    chips: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Database Design",
      "Operating Systems",
      "Computer Networks",
      "System Architecture",
      "Full-Stack Development",
      "Cloud Computing",
    ],
  },
  {
    title: "infra",
    chips: [
      "Git",
      "Linux",
      "MySQL",
      "RESTful APIs",
      "Google Cloud Platform",
      "Android Studio",
      "VS Code",
      "Arduino",
    ],
  },
];

export const footerLinks: SocialLink[] = [
  {
    label: "email",
    href: "mailto:shreyanshgolchha1112@gmail.com",
  },
  {
    label: "github",
    href: "https://github.com/ShreyanshGolchha01",
    external: true,
  },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/shreyansh-golchha-04113816b/",
    external: true,
  },
  {
    label: "x",
    href: "https://x.com/ShreyanshGolch5",
    external: true,
  },
  {
    label: "discord",
    href: "#discord",
    copyValue: "508519391831523328",
  },
];

export const resumeUrl = "https://shreyanshgolchha.me/resume.pdf";

export const githubProfileUrl = "https://github.com/ShreyanshGolchha01";

export const githubUser = "ShreyanshGolchha01";

