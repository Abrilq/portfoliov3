export type Profile = {
  id: number;
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  availability: string;
  education_school: string;
  education_degree: string;
  education_start: string;
  education_end: string;
  skills: string[];
};

export type Experience = {
  id: string;
  company: string;
  title: string;
  location: string;
  start_date: string;
  end_date: string | null;
  highlights: string[];
  sort_order: number;
  published: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  role: string;
  year: string;
  category: string;
  summary: string;
  body_html: string;
  stack: string[];
  live_url: string;
  repo_url: string;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  sort_order: number;
  published: boolean;
};

export type PortfolioContent = {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  certifications: Certification[];
};