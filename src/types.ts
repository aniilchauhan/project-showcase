export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  content?: string; // Markdown case study content
  thumbnail: string;
  gallery: string[];
  videoUrl?: string;
  demoUrl?: string;
  liveUrl: string;
  githubRepo?: string; // For GitHub stats
  category: Category;
  tags: string[];
  techStack: string[];
  isFeatured: boolean;
  views?: number;
  clicks?: number;
  createdAt: string;
}

export type Category = 'Mobile App' | 'Web App' | 'Website' | 'AI' | 'SaaS' | 'E-commerce';

export interface Lead {
  id: string;
  name: string;
  email: string;
  interest: string;
  message: string;
  projectId?: string;
  createdAt: string;
}

export interface User {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}
