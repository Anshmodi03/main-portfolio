// ─── Types ──────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  longDesc: string;
  tags: string[];
  tech: string[];
  year: string;
  status: "Complete" | "In Progress";
  featured: boolean;
  image: string;
  github: string;
  live: string;
  stats?: { label: string; value: string }[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: "Full-time" | "Internship";
  status: "Completed" | "Current";
  description: string;
  achievements: string[];
  tech: string[];
  metrics: { label: string; value: string }[];
}

export interface Skill {
  name: string;
  icon: string;
  level: "Expert" | "Advanced" | "Intermediate" | "Learning";
  years: string;
  description: string;
  tags: string[];
  category: "Frontend" | "Backend" | "Tools" | "Exploring";
}

export interface ExploringItem {
  name: string;
  icon: string;
  status: "Learning" | "Exploring" | "Interested";
}

// ─── Personal Info ───────────────────────────────────────────────────────────

export const personal = {
  name: "Ansh Modi",
  initials: "AM",
  role: "Full Stack Developer",
  tagline: "Building the future, one line at a time.",
  bio: "I'm Ansh Modi, a Full Stack Developer from India, skilled in the MERN stack (MongoDB, Express.js, React, Node.js). I build scalable web applications—from real-time platforms to smart booking systems—combining clean architecture with modern UI.",
  bioLong: "I led development of a scalable internship platform at MissionT5, delivering responsive front-end interfaces and robust backend systems. Certified by upGrad, I'm passionate about innovative tech solutions and always hungry to learn what's next.",
  email: "modiaastha01@gmail.com",
  github: "https://github.com/Anshmodi03",
  linkedin: "https://www.linkedin.com/in/ansh-modi-/",
  location: "India",
  available: true,
};

// ─── Stats ───────────────────────────────────────────────────────────────────

export const stats = [
  { value: 40, suffix: "+", label: "Projects Completed" },
  { value: 1, suffix: "+", label: "Years Experience" },
  { value: 10000, suffix: "+", label: "Lines of Code", display: "10K+" },
  { value: 24, suffix: "/7", label: "Learning Mode" },
];

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skills: Skill[] = [
  // Frontend
  {
    name: "JavaScript ES6+",
    icon: "⚡",
    level: "Expert",
    years: "2+ years",
    description: "Modern JavaScript with ES6+ features, async/await, and advanced programming patterns",
    tags: ["ES6+", "Async/Await", "Modern JS"],
    category: "Frontend",
  },
  {
    name: "React & Redux",
    icon: "⚛️",
    level: "Expert",
    years: "2+ years",
    description: "Advanced React with hooks, context, and Redux for state management",
    tags: ["React", "Redux", "Hooks"],
    category: "Frontend",
  },
  {
    name: "HTML & CSS",
    icon: "🎨",
    level: "Expert",
    years: "2+ years",
    description: "Semantic HTML and optimized CSS for accessibility and performance",
    tags: ["Semantic HTML", "CSS3", "Accessibility"],
    category: "Frontend",
  },
  {
    name: "TailwindCSS",
    icon: "🎭",
    level: "Expert",
    years: "2+ years",
    description: "Responsive, modern UI design with utility-first CSS framework",
    tags: ["Responsive", "Utility-First", "Modern UI"],
    category: "Frontend",
  },
  {
    name: "Vanilla JavaScript",
    icon: "🍦",
    level: "Advanced",
    years: "2+ years",
    description: "Pure JavaScript for performance-critical applications and DOM manipulation",
    tags: ["DOM", "Performance", "Pure JS"],
    category: "Frontend",
  },
  // Backend
  {
    name: "Node.js",
    icon: "🟢",
    level: "Expert",
    years: "2+ years",
    description: "Server-side JavaScript with event-driven architecture and async patterns",
    tags: ["Node.js", "Event Loop", "Async"],
    category: "Backend",
  },
  {
    name: "Express.js",
    icon: "🚂",
    level: "Expert",
    years: "2+ years",
    description: "RESTful API design, middleware, authentication and rate limiting",
    tags: ["REST API", "Middleware", "Auth"],
    category: "Backend",
  },
  {
    name: "MongoDB",
    icon: "🍃",
    level: "Expert",
    years: "2+ years",
    description: "NoSQL database design, aggregations, indexing and Mongoose ODM",
    tags: ["NoSQL", "Mongoose", "Aggregations"],
    category: "Backend",
  },
  // Tools
  {
    name: "Git & GitHub",
    icon: "🔀",
    level: "Advanced",
    years: "2+ years",
    description: "Version control, branching strategies, PR workflows and CI/CD",
    tags: ["Git", "GitHub", "CI/CD"],
    category: "Tools",
  },
  {
    name: "Figma",
    icon: "🎯",
    level: "Intermediate",
    years: "1+ year",
    description: "UI/UX design, prototyping and design-to-code handoff",
    tags: ["UI Design", "Prototyping", "Design Systems"],
    category: "Tools",
  },
  {
    name: "Vercel & Deployment",
    icon: "▲",
    level: "Advanced",
    years: "1+ year",
    description: "Frontend deployment, environment management and performance optimization",
    tags: ["Vercel", "Deployment", "Performance"],
    category: "Tools",
  },
];

// ─── Exploring ────────────────────────────────────────────────────────────────

export const exploring: ExploringItem[] = [
  { name: "Machine Learning", icon: "🤖", status: "Learning" },
  { name: "Artificial Intelligence", icon: "🧠", status: "Learning" },
  { name: "Blockchain", icon: "⛓️", status: "Exploring" },
  { name: "AR / VR", icon: "🥽", status: "Interested" },
  { name: "DevOps", icon: "🚀", status: "Learning" },
  { name: "Cybersecurity", icon: "🔐", status: "Exploring" },
  { name: "Game Development", icon: "🎮", status: "Interested" },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "parknest",
    name: "ParkNest",
    description: "Smart parking solution with real-time availability and intelligent booking.",
    longDesc: "ParkNest is a smart parking solution offering real-time spot availability, intelligent booking system, and seamless user experience for urban parking management.",
    tags: ["MERN", "Full Stack"],
    tech: ["React", "JavaScript", "Tailwind CSS", "Framer Motion", "Node.js", "Express.js", "MongoDB", "REST API"],
    year: "2024",
    status: "Complete",
    featured: true,
    image: "/parknest.png",
    github: "https://github.com/Anshmodi03/ParkNest",
    live: "https://parknest.vercel.app/",
    stats: [
      { label: "Stars", value: "85+" },
      { label: "Users", value: "200+" },
      { label: "Bookings", value: "1.2k+" },
    ],
  },
  {
    id: "connectify",
    name: "Connectify",
    description: "Full-stack MERN social platform with real-time messaging and post engagement.",
    longDesc: "Connectify is a full-stack MERN social media platform for connecting, posting, and interacting. Features real-time messaging, post engagement, and user profiles.",
    tags: ["MERN", "Full Stack", "Social"],
    tech: ["React", "JavaScript", "Tailwind CSS", "Framer Motion", "Node.js", "Express.js", "MongoDB", "REST API"],
    year: "2024",
    status: "Complete",
    featured: true,
    image: "/connectify.png",
    github: "https://github.com/Anshmodi03/MERN-social-media",
    live: "https://mern-social-media-rho.vercel.app/home",
    stats: [
      { label: "Stars", value: "120+" },
      { label: "Posts", value: "500+" },
      { label: "Users", value: "150+" },
    ],
  },
  {
    id: "imdb-clone",
    name: "IMDB Clone",
    description: "React-powered movie discovery app with TMDB API integration.",
    longDesc: "A React app that mimics IMDb using the TMDB API to showcase trending movies and TV shows with detailed information, ratings, and search functionality.",
    tags: ["React", "API"],
    tech: ["React", "CSS", "JavaScript", "TMDB API"],
    year: "2024",
    status: "Complete",
    featured: true,
    image: "/imdb.png",
    github: "https://github.com/Anshmodi03/imdb-clone",
    live: "https://anshmodi03-imdb-clone.vercel.app/",
    stats: [
      { label: "Stars", value: "65+" },
      { label: "Views", value: "800+" },
      { label: "Searches", value: "2k+" },
    ],
  },
];

export const otherProjects: Omit<Project, "featured" | "stats">[] = [
  {
    id: "job-listing",
    name: "Job Listing Site",
    description: "Comprehensive job listing platform with modern UI and search functionality.",
    longDesc: "A comprehensive job listing platform built with React for browsing and searching job opportunities with modern UI",
    tags: ["React", "Frontend"],
    tech: ["React", "CSS", "JavaScript", "Tailwind CSS"],
    year: "2024",
    status: "Complete",
    image: "",
    github: "https://github.com/Anshmodi03/job-lisiting-site",
    live: "https://job-lisiting-site.vercel.app/",
  },
  {
    id: "fitness-tracker",
    name: "Fitness Tracker",
    description: "Activity logging and progress visualization toward personal fitness goals.",
    longDesc: "A React fitness tracker that logs activities and visualizes progress toward personal fitness goals",
    tags: ["React", "Frontend"],
    tech: ["React", "Tailwind CSS", "CSS", "JavaScript"],
    year: "2024",
    status: "Complete",
    image: "",
    github: "https://github.com/Anshmodi03/fitness-tracker",
    live: "https://fitness-tracker-brown.vercel.app/",
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    description: "Lightweight personal finance manager built with React.",
    longDesc: "A lightweight expense tracker built with React for managing personal finances and budget tracking",
    tags: ["React", "Frontend"],
    tech: ["React", "CSS", "JavaScript"],
    year: "2024",
    status: "Complete",
    image: "",
    github: "https://github.com/Anshmodi03/expense-tracker",
    live: "https://anshmodi-expense-tracker.vercel.app/",
  },
  {
    id: "meal-recommendation",
    name: "Meal Recommendation",
    description: "Top 10 healthy recipes based on chosen cuisine and city.",
    longDesc: "A React microservice that recommends the top 10 healthy recipes based on your chosen cuisine and city",
    tags: ["React", "API"],
    tech: ["React", "CSS", "JavaScript", "Tailwind CSS"],
    year: "2024",
    status: "Complete",
    image: "",
    github: "https://github.com/Anshmodi03/meal-recomandation",
    live: "https://ansh-meal-recomandation.vercel.app/",
  },
];

// ─── Experience ────────────────────────────────────────────────────────────────

export const experiences: Experience[] = [
  {
    id: "missiont5",
    role: "Team Lead Full Stack Developer",
    company: "MissionT5",
    location: "Remote",
    duration: "5 months",
    type: "Full-time",
    status: "Completed",
    description: "Led the development of a scalable full-stack internship platform, architecting responsive front-end interfaces and robust backend systems to enhance user engagement and operational efficiency.",
    achievements: [
      "Developed full-stack internship platform from scratch with integrated chatbot",
      "Built ParkNest — a smart parking app with real-time slot tracking",
      "Reduced support queries by 30% through chatbot integration",
      "Maintained 100% project uptime with optimized MERN stack",
    ],
    tech: ["React", "Node.js", "MongoDB", "Express.js", "REST API", "TypeScript"],
    metrics: [
      { label: "Support queries reduced", value: "30%" },
      { label: "Project uptime", value: "100%" },
    ],
  },
  {
    id: "innovativearc",
    role: "Frontend Developer Intern",
    company: "InnovativeArc Solutions",
    location: "Remote",
    duration: "1 month",
    type: "Internship",
    status: "Current",
    description: "Contributed to dynamic, user-friendly web interfaces, focusing on responsive front-end design and seamless user experiences for enterprise-level applications.",
    achievements: [
      "Built interactive UI components for client-facing dashboard",
      "Developed EventSync — an event management web app with real-time updates",
      "Improved UI responsiveness by 25% through optimized CSS and React components",
      "Achieved 99% cross-browser compatibility for EventSync",
    ],
    tech: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
    metrics: [
      { label: "UI responsiveness improved", value: "25%" },
      { label: "Cross-browser compatibility", value: "99%" },
    ],
  },
];

// ─── Tech Marquee ─────────────────────────────────────────────────────────────

export const marqueeRow1 = [
  "React", "Node.js", "TypeScript", "MongoDB", "Express.js",
  "Tailwind CSS", "REST API", "Git", "Three.js", "Framer Motion",
];

export const marqueeRow2 = [
  "JavaScript", "Redux", "HTML5", "CSS3", "Figma",
  "Vercel", "GitHub", "Vite", "Next.js", "React Three Fiber",
];

// ─── Process Steps ────────────────────────────────────────────────────────────

export const processSteps = [
  {
    number: "01",
    icon: "🔍",
    title: "Understand",
    description: "Deep-dive into your requirements, goals and existing codebase. No assumptions — just clarity.",
  },
  {
    number: "02",
    icon: "📐",
    title: "Plan",
    description: "Architecture-first approach. TypeScript, tested, and built to scale from day one.",
  },
  {
    number: "03",
    icon: "⚡",
    title: "Build",
    description: "MERN stack, clean commits, responsive from first pixel. Shipped in 2–5 day sprints.",
  },
  {
    number: "04",
    icon: "🚀",
    title: "Deliver",
    description: "Deploy, document, and hand off with a full walkthrough. No mysteries left behind.",
  },
];

// ─── Skills grouped ────────────────────────────────────────────────────────────

export const skillsByCategory = {
  frontend: skills.filter((s) => s.category === "Frontend"),
  backend: skills.filter((s) => s.category === "Backend"),
  tools: skills.filter((s) => s.category === "Tools"),
};

// ─── Services ────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export const services: Service[] = [
  {
    id: "s1",
    number: "01",
    title: "Full Stack Web Apps",
    description:
      "End-to-end MERN stack applications — from auth and REST APIs to React frontends. Built for scale, speed, and real-world production.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
  },
  {
    id: "s2",
    number: "02",
    title: "UI / UX Engineering",
    description:
      "Pixel-perfect interfaces with GSAP animations, smooth scroll, and premium micro-interactions that make users stay.",
    tags: ["Next.js", "TailwindCSS", "GSAP", "Lenis"],
  },
  {
    id: "s3",
    number: "03",
    title: "API & Backend Systems",
    description:
      "RESTful APIs, JWT auth, rate-limiting, and real-time WebSocket features. Clean architecture with Express 5 and TypeScript.",
    tags: ["Express.js", "TypeScript", "JWT", "REST"],
  },
  {
    id: "s4",
    number: "04",
    title: "Performance & Optimization",
    description:
      "Auditing, optimizing, and deploying fast web experiences. Core Web Vitals, bundle splitting, and edge deployments.",
    tags: ["TypeScript", "Vercel", "Web Vitals", "SEO"],
  },
];
