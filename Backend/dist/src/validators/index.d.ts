import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    subject: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export declare const projectSchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    acronym: z.ZodString;
    description: z.ZodString;
    details: z.ZodString;
    techStack: z.ZodArray<z.ZodString>;
    githubUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    liveUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    imageUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    isPublished: z.ZodDefault<z.ZodBoolean>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const profileSchema: z.ZodObject<{
    name: z.ZodString;
    role: z.ZodString;
    bio: z.ZodString;
    location: z.ZodString;
    email: z.ZodString;
    githubUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    linkedinUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    availability: z.ZodOptional<z.ZodString>;
    aboutTitle: z.ZodOptional<z.ZodString>;
    aboutText: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const messageStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        archived: "archived";
        read: "read";
        unread: "unread";
    }>;
}, z.core.$strip>;
export declare const idSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
