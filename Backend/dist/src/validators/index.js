import { z } from 'zod';
const optionalUrl = z.string().url().or(z.literal('')).optional();
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(200),
});
export const contactSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().email(),
    subject: z.string().trim().min(2).max(160),
    message: z.string().trim().min(10).max(3000),
});
export const projectSchema = z.object({
    slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/),
    title: z.string().trim().min(2).max(160),
    acronym: z.string().trim().min(2).max(20),
    description: z.string().trim().min(10).max(500),
    details: z.string().trim().min(10).max(10000),
    techStack: z.array(z.string().trim().min(1)).min(1).max(20),
    githubUrl: optionalUrl,
    liveUrl: optionalUrl,
    imageUrl: optionalUrl,
    isPublished: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
});
export const profileSchema = z.object({
    name: z.string().trim().min(2).max(100),
    role: z.string().trim().min(2).max(160),
    bio: z.string().trim().min(10).max(2000),
    location: z.string().trim().min(2).max(120),
    email: z.string().email(),
    githubUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    availability: z.string().trim().max(240).optional(),
    aboutTitle: z.string().trim().max(240).optional(),
    aboutText: z.string().trim().max(3000).optional(),
});
export const messageStatusSchema = z.object({
    status: z.enum(['unread', 'read', 'archived']),
});
export const idSchema = z.object({ id: z.string().min(1) });
//# sourceMappingURL=index.js.map