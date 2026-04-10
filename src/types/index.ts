// types.ts
export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  linkedin: string;
  github: string;
}

export interface Education {
  id?: number | string;
  degree: string;
  institution: string;
  period?: string;
  grade?: string;
}

export interface WorkExperience {
  id?: number | string;
  company: string;
  role: string;
  year: string;
  description: string;
}

export interface ProjectLinks {
  youtube?: string;
  github?: string;
  report?: string;
}

export interface ProjectDetails {
  agents?: Array<{ name: string; startNode: string; goalNode?: string }>;
  totalNodes?: number;
  packageCount?: number;
  algorithms?: {
    initial?: string;
    return?: string;
  };
  features?: string[];
  gameplay?: string;
}

export interface Project {
  id: number;
  title: string;
  role: string;
  year: string;
  description: string;
  technologies: string[];
  links: ProjectLinks;
  details?: ProjectDetails;
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PortfolioData {
  personal: PersonalInfo;
  education: Education[];
  projects: Project[];
  skills: Skills;
  workExperiences: WorkExperience[];
}