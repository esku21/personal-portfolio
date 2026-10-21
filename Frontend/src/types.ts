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
  imageUrl?: string | null;
  imageUrls?: string[];
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
  resumeUrl?: string;
  aboutSubtitle?: string;
  aboutTitle?: string;
  aboutText?: string;
  stats?: Array<{ value?: string | number; label?: string }>;
  skills?: Array<{ category?: string; items?: string[] }>;
  principles?: Array<{ title?: string; description?: string }>;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 0 - 100
  imageUrl?: string | null;
  isPublished?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  imageUrls?: string[];
  current?: boolean;
  isPublished?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  isPublished?: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // 'LayoutTemplate' | 'Layers3' | 'Compass' | 'Code' | 'Server' | etc.
  isPublished?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
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

export interface PortfolioReport {
  generatedAt: string;
  totals: {
    projects: number;
    publishedProjects: number;
    draftProjects: number;
    featuredProjects: number;
    skills: number;
    experience: number;
    education: number;
    services: number;
    certifications: number;
    messages: number;
    unreadMessages: number;
    admins: number;
    profiles: number;
  };
  distributions: {
    skillCategories: Array<{ name: string; count: number }>;
    serviceTypes: Array<{ name: string; count: number }>;
    experienceOrganizations: Array<{ name: string; count: number }>;
    educationQualifications: Array<{ name: string; count: number }>;
  };
  period: {
    projectsCreated: { current: number; previous: number | null };
    messagesReceived: { current: number; previous: number | null };
  };
  activity: {
    bucket: 'day' | 'month';
    events: Array<{ label: string; projects: number; messages: number }>;
  };
  recentProjects: Array<{
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  dataQuality: {
    recordsWithoutCreationTimestamps: number;
    recordTypesWithoutCreationTimestamps: string[];
    projectCompletionStatusAvailable: boolean;
    experienceDurationReliable: boolean;
  };
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