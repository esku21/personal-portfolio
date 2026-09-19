import { prisma } from '../lib/prisma.js';
export declare function getPortfolio(): Promise<{
    profile: any;
    projects: any;
    skills: any;
    experience: any;
    education: any;
    certifications: any;
    services: any;
}>;
export declare function getPublishedProject(slug: string): any;
export declare function listProjects(): any;
export declare function createProject(data: Parameters<typeof prisma.project.create>[0]['data']): any;
export declare function updateProject(id: string, data: Parameters<typeof prisma.project.update>[0]['data']): any;
export declare function deleteProject(id: string): any;
export declare function getProfile(): any;
export declare function updateProfile(data: Parameters<typeof prisma.profile.upsert>[0]['create']): any;
