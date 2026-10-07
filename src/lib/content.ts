import type { Certification, Experience, PortfolioContent, Profile, Project } from "@/lib/types";

export const fallbackProfile: Profile = {
  id: 1,
  name: "John Clarence A. Legaspi",
  role: "Frontend developer & IT graduate",
  location: "Bocaue, Bulacan, Philippines",
  email: "clarence.legaspi.dev@gmail.com",
  phone: "+63 961 261 4463",
  website: "https://clarence-port.vercel.app",
  summary:
    "Information Technology graduate with hands-on experience in web development, frontend engineering, and enterprise system enhancement. I build responsive web experiences and improve the workflows behind them.",
  availability: "Open to frontend and web development opportunities",
  education_school: "Dr. Yanga's Colleges Inc.",
  education_degree: "Bachelor of Science in Information Technology",
  education_start: "2021",
  education_end: "2025",
  skills: ["HTML", "CSS", "JavaScript", "TypeScript", "C#", "PHP", "MySQL", "React", "Vite", "Klaviyo", "Replo", "Shopify", "Flutter", "Unity", "Blender", "Figma", "Git"],
};

export const fallbackExperiences: Experience[] = [
  {
    id: "freelance-shopify",
    company: "Shopify E-commerce Client",
    title: "Freelance Web Developer",
    location: "Remote",
    start_date: "2025-11-01",
    end_date: "2026-02-28",
    highlights: ["Developed responsive Klaviyo email templates for e-commerce campaigns", "Implemented dynamic email content with Liquid variables", "Built Shopify landing pages with Replo", "Improved mobile usability and structured page layouts"],
    sort_order: 1,
    published: true,
  },
  {
    id: "st-martin-internship",
    company: "St. Martin Cooperative",
    title: "IT Intern (Programmer)",
    location: "On-site",
    start_date: "2025-03-01",
    end_date: "2025-07-31",
    highlights: ["Enhanced the Service Request Form system with new features and usability improvements", "Refined a hierarchical approval workflow", "Collaborated with IT teammates to test updates, troubleshoot issues, and support internal users"],
    sort_order: 2,
    published: true,
  },
];

export const fallbackProjects: Project[] = [
  {
    id: "lost-and-found", slug: "lost-and-found", title: "Lost & Found WebApp", role: "Team Leader, Full-Stack Developer", year: "2025", category: "Service platform",
    summary: "A service-based web app for tracking found items through clear, role-based workflows.",
    body_html: "<p>Led a three-member team to plan and build a service-based web application. The experience organizes item tracking around clear roles and a predictable handoff from report to resolution.</p><h2>My contribution</h2><p>I shaped the system architecture, coordinated implementation, and built role-aware workflows that make each item easier to follow.</p>",
    stack: ["Full-stack development", "Role-based workflows", "Team leadership"], live_url: "", repo_url: "", featured: true, sort_order: 1, published: true,
  },
  {
    id: "pre-advising", slug: "pre-advising", title: "Pre-advising System", role: "UI/UX Designer, Frontend Developer", year: "2025", category: "Education",
    summary: "A focused subject-planning interface organized around course, year level, and semester.",
    body_html: "<p>Designed a web interface that helps students view and manage subjects by course, year, and semester. The information structure keeps academic planning easy to scan.</p><h2>Design focus</h2><p>Clear navigation, readable subject groupings, and a direct path from overview to individual semester details.</p>",
    stack: ["UI/UX design", "Frontend development", "Education"], live_url: "", repo_url: "", featured: true, sort_order: 2, published: true,
  },
  {
    id: "eyewear-store", slug: "eyewear-store", title: "E-commerce Website", role: "Project Leader, Frontend Developer", year: "2024", category: "Commerce",
    summary: "An eyewear storefront with responsive product displays and product variant selection.",
    body_html: "<p>Led frontend development for an eyewear e-commerce website, building a responsive storefront that makes product options simple to compare.</p><h2>What I built</h2><p>Responsive product displays and variant selection features designed to stay clear across screen sizes.</p>",
    stack: ["E-commerce", "Responsive UI", "Product variants"], live_url: "", repo_url: "", featured: true, sort_order: 3, published: true,
  },
  {
    id: "ar-learning", slug: "ar-learning", title: "Augmented Reality Learning", role: "3D Designer, Full-Stack Developer", year: "2024", category: "Interactive learning",
    summary: "An AR mobile experience using ARCore and C# to make learning interactive.",
    body_html: "<p>Developed an augmented reality mobile application with ARCore and C#. The project combines 3D assets with interactive features to support an engaging learning experience.</p>",
    stack: ["ARCore", "C#", "3D design"], live_url: "", repo_url: "", featured: true, sort_order: 4, published: true,
  },
  {
    id: "damath", slug: "damath", title: "DaMath Educational Game", role: "3D Designer", year: "2024", category: "Game design",
    summary: "Interactive 3D chessboard and game assets modeled in Blender.",
    body_html: "<p>Modeled the interactive 3D chessboard and game assets for an educational DaMath game, translating familiar board-game elements into a digital learning environment.</p>",
    stack: ["Blender", "3D modeling", "Education"], live_url: "", repo_url: "", featured: false, sort_order: 5, published: true,
  },
];

export const supplementalProjects: Project[] = [
  {
    id: "ordering-system",
    slug: "ordering-system",
    title: "Ordering System Application",
    role: "UI/UX Designer",
    year: "",
    category: "Ordering system",
    summary: "A web application for organizing and processing orders.",
    body_html: "<p>An ordering system application for organizing and processing orders through a web interface.</p>",
    stack: ["Web application"],
    live_url: "https://clarence-port.vercel.app/projects/ordering-system",
    repo_url: "",
    featured: true,
    sort_order: 6,
    published: true,
  },
];

export const personalProjects: Project[] = [
  {
    id: "drinking-session",
    slug: "drinking-session",
    title: "Drinking Session",
    role: "Personal project",
    year: "",
    category: "Personal project",
    summary: "A turn-taking app that keeps track of whose turn it is during a drinking session.",
    body_html: "<p>Designed to make group turn-taking easier to follow. Add participants, arrange their order, and tap to reveal who goes next. The interface also supports a full-screen view for use on desktop or mobile.</p>",
    stack: ["HTML5", "CSS3", "JavaScript"],
    live_url: "https://shotpuno.vercel.app/",
    repo_url: "",
    featured: false,
    sort_order: 1,
    published: true,
  },
  {
    id: "srt-renamer",
    slug: "srt-renamer",
    title: "SRT Renamer",
    role: "Personal project",
    year: "",
    category: "Personal project",
    summary: "A utility for renaming SRT subtitle files.",
    body_html: "<p>A small utility project for renaming SRT subtitle files.</p>",
    stack: ["Subtitle utility"],
    live_url: "https://srt-renamer.vercel.app/",
    repo_url: "",
    featured: false,
    sort_order: 2,
    published: true,
  },
];

export const fallbackCertifications: Certification[] = [
  { id: "networking-basics", title: "Networking Basics", issuer: "Cisco", year: "2024", sort_order: 1, published: true },
  { id: "predictive-project-management", title: "Fundamentals of Predictive Project Management", issuer: "Project Management Institute", year: "2023", sort_order: 2, published: true },
  { id: "cybersecurity", title: "Introduction to Cybersecurity", issuer: "Cisco", year: "2023", sort_order: 3, published: true },
  { id: "excel-associate", title: "MS Office Excel Associate", issuer: "Microsoft", year: "2023", sort_order: 4, published: true },
];

export const fallbackContent: PortfolioContent = {
  profile: fallbackProfile,
  experiences: fallbackExperiences,
  projects: fallbackProjects,
  certifications: fallbackCertifications,
};