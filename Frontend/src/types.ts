export interface Metric {
  label: string;
  value: string;
}

// Matches PostgreSQL schema:
// id, slug, title, acronym, description, details, techStack, githubUrl, liveUrl, imageUrl, isPublished, isFeatured, createdAt, updatedAt
export interface Project {
  id: string;
  slug: string;
  title: string;
  acronym?: string;
  description: string;
  details?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: 'Municipal & Civic Systems' | 'FinTech & SaaS' | 'Tools & Utilities' | string;
  
  // Extended fields for case studies
  role?: string;
  timeline?: string;
  overview?: string;
  challenges?: string[];
  solutions?: string[];
  metrics?: Metric[];
}

export interface Profile {
  id?: string;
  name: string;
  role: string;
  email: string;
  location: string;
  bio: string;
  availability?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 0 - 100
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  current?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // 'LayoutTemplate' | 'Layers3' | 'Compass' | 'Code' | 'Server' | etc.
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt?: string;
}

export interface Stats {
  projects: number;
  published: number;
  unread: number;
  skills: number;
  certifications: number;
  experiences: number;
  educations: number;
  services: number;
}

export interface Portfolio {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  services: Service[];
}