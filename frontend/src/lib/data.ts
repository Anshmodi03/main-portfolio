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
  certificate?: string;
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
  bio: "I'm Ansh Modi, a Full Stack Developer skilled in the MERN stack and TypeScript. I build scalable web applications—from real-time social platforms to smart booking systems—combining clean architecture with pixel-precise UI.",
  bioLong: "I led full-stack development at MissionT5, building a scalable internship platform with Node.js, React, and MongoDB. With 2+ years across 50+ repositories—JavaScript, TypeScript, Next.js, and beyond—I'm passionate about clean code, modern tooling, and always hungry for what's next.",
  email: "modiaastha01@gmail.com",
  github: "https://github.com/Anshmodi03",
  linkedin: "https://www.linkedin.com/in/ansh-modi-/",
  location: "Remote",
  available: true,
};

// ─── Stats ───────────────────────────────────────────────────────────────────

export const stats = [
  { value: 50, suffix: "+", label: "Projects Completed" },
  { value: 2,  suffix: "+", label: "Years Experience" },
  { value: 50000, suffix: "+", label: "Lines of Code", display: "50K+" },
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
    description: "Deep mastery of closures, async/await, event loop, ES modules, and modern browser APIs",
    tags: ["ES6+", "Async/Await", "Event Loop"],
    category: "Frontend",
  },
  {
    name: "React & Next.js",
    icon: "⚛️",
    level: "Expert",
    years: "2+ years",
    description: "Component architecture, hooks, context, server components, and App Router with Next.js 16",
    tags: ["React 19", "Next.js 16", "App Router"],
    category: "Frontend",
  },
  {
    name: "HTML & CSS",
    icon: "🎨",
    level: "Expert",
    years: "2+ years",
    description: "Semantic HTML5, modern CSS with animations, Grid/Flexbox, and accessibility best practices",
    tags: ["Semantic HTML", "CSS3", "Accessibility"],
    category: "Frontend",
  },
  {
    name: "TailwindCSS",
    icon: "🎭",
    level: "Expert",
    years: "2+ years",
    description: "Utility-first responsive UI, custom design tokens, and component-driven styling at scale",
    tags: ["Responsive", "Utility-First", "Design Tokens"],
    category: "Frontend",
  },
  {
    name: "TypeScript",
    icon: "🔷",
    level: "Advanced",
    years: "2+ years",
    description: "Strict typing, generics, utility types, and type-safe full-stack development across React and Node.js",
    tags: ["Strict Mode", "Generics", "Type Safety"],
    category: "Frontend",
  },
  {
    name: "Redux",
    icon: "🔮",
    level: "Advanced",
    years: "2+ years",
    description: "Global state management with Redux Toolkit, slices, async thunks, and selectors",
    tags: ["Redux Toolkit", "State Management", "Async Thunks"],
    category: "Frontend",
  },
  {
    name: "GSAP",
    icon: "🎬",
    level: "Expert",
    years: "2+ years",
    description: "Premium animations — ScrollTrigger, SplitText, ScrambleText, DrawSVG, and timeline orchestration",
    tags: ["ScrollTrigger", "SplitText", "Timelines"],
    category: "Frontend",
  },
  // Backend
  {
    name: "Node.js",
    icon: "🟢",
    level: "Expert",
    years: "2+ years",
    description: "Scalable server-side runtime — REST APIs, real-time events, streaming, and async-first architecture",
    tags: ["Node.js", "Event Loop", "Async"],
    category: "Backend",
  },
  {
    name: "Express.js",
    icon: "🚂",
    level: "Expert",
    years: "2+ years",
    description: "RESTful API design with middleware chains, JWT auth, rate limiting, and error handling patterns",
    tags: ["REST API", "Middleware", "Auth"],
    category: "Backend",
  },
  {
    name: "MongoDB",
    icon: "🍃",
    level: "Expert",
    years: "2+ years",
    description: "Schema design with Mongoose, aggregation pipelines, Atlas clusters, and indexing for performance",
    tags: ["NoSQL", "Mongoose", "Aggregations"],
    category: "Backend",
  },
  {
    name: "Authentication & JWT",
    icon: "🔐",
    level: "Expert",
    years: "2+ years",
    description: "JWT-based auth flows, bcrypt password hashing, refresh tokens, and role-based access control",
    tags: ["JWT", "bcrypt", "OAuth"],
    category: "Backend",
  },
  {
    name: "REST API Design",
    icon: "🔗",
    level: "Expert",
    years: "2+ years",
    description: "RESTful endpoint design, versioning, pagination, validation, error handling, and API documentation",
    tags: ["REST", "Versioning", "Validation"],
    category: "Backend",
  },
  // Tools
  {
    name: "Git & GitHub",
    icon: "🔀",
    level: "Advanced",
    years: "2+ years",
    description: "50+ public repositories, branching strategies, PR workflows, code reviews, and GitHub Actions",
    tags: ["Git", "GitHub", "CI/CD"],
    category: "Tools",
  },
  {
    name: "Figma",
    icon: "🎯",
    level: "Intermediate",
    years: "2+ years",
    description: "UI/UX wireframing, component libraries, prototyping, and design-to-code handoff workflows",
    tags: ["UI Design", "Prototyping", "Design Systems"],
    category: "Tools",
  },
  {
    name: "Vercel & Deployment",
    icon: "▲",
    level: "Advanced",
    years: "2+ years",
    description: "CI/CD pipelines, preview deployments, environment variables, and performance optimization on Vercel",
    tags: ["Vercel", "CI/CD", "Performance"],
    category: "Tools",
  },
  {
    name: "Render",
    icon: "🌐",
    level: "Advanced",
    years: "2+ years",
    description: "Backend deployment on Render — web services, environment config, free-tier and production hosting",
    tags: ["Deployment", "Web Services", "Hosting"],
    category: "Tools",
  },
  {
    name: "Postman",
    icon: "📮",
    level: "Advanced",
    years: "2+ years",
    description: "API testing, collections, environment variables, automated test suites, and team collaboration",
    tags: ["API Testing", "Collections", "Automation"],
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
    id: "luxestore",
    name: "LuxeStore",
    description: "Production-grade luxury e-commerce with Google OAuth, Stripe payments, and animated UI.",
    longDesc: "LuxeStore is a full-stack luxury e-commerce platform featuring Google Sign-In via Firebase, Stripe multi-step checkout, product catalog with filtering/search/pagination, persistent cart & wishlist, and a user dashboard for orders and addresses.",
    tags: ["Full Stack", "E-Commerce", "MERN"],
    tech: ["React", "TypeScript", "Tailwind CSS", "GSAP", "Node.js", "Express.js", "MongoDB", "Firebase", "Stripe"],
    year: "2026",
    status: "Complete",
    featured: true,
    image: "/project/Luxestore.png",
    github: "https://github.com/Anshmodi03/luxestore-ecommerce",
    live: "https://luxestore-ecommerce.vercel.app",
    stats: [
      { label: "Commits", value: "56+" },
      { label: "Features", value: "10+" },
      { label: "Tech", value: "14+" },
    ],
  },
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
    image: "/project/parknest.png",
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
    image: "/project/connectify.png",
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
    image: "/project/imdb.png",
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
    certificate: "/certificates/missiont5.pdf",
  },
  {
    id: "nullclass",
    role: "Web Development Intern",
    company: "NullClass",
    location: "Remote",
    duration: "Oct 2025 – Feb 2026",
    type: "Internship",
    status: "Completed",
    description: "Completed intensive web development training and built a full-scale YouTube-like real-time streaming platform, gaining hands-on experience in full-stack architecture, video streaming, and production-grade frontend engineering.",
    achievements: [
      "Built a fully functional real-time YouTube-like platform from scratch end-to-end",
      "Implemented user authentication, video streaming, and content discovery pipeline",
      "Applied responsive design and performance optimisation across all device sizes",
      "Completed certified training in modern web development — HTML, CSS, JavaScript, React",
    ],
    tech: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    metrics: [
      { label: "Training completion", value: "100%" },
      { label: "Real-time features built", value: "5+" },
    ],
    certificate: "/certificates/nullclass.pdf",
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
