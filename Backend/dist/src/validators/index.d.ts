import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const adminAccountSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    currentPassword: z.ZodOptional<z.ZodString>;
    newPassword: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    subject: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export declare const projectSchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    acronym: z.ZodString;
    description: z.ZodString;
    details: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    techStack: z.ZodArray<z.ZodString>;
    githubUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    liveUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    imageUrl: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">, z.ZodNull]>>;
    imageUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
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
    avatarUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    resumeUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
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
export declare const experienceSchema: z.ZodObject<{
    role: z.ZodString;
    company: z.ZodString;
    location: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    current: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    description: z.ZodString;
    imageUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const educationSchema: z.ZodObject<{
    institution: z.ZodString;
    degree: z.ZodString;
    location: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const skillSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodString;
    level: z.ZodDefault<z.ZodNumber>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const serviceSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    icon: z.ZodString;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const certificationSchema: z.ZodObject<{
    name: z.ZodString;
    issuer: z.ZodString;
    issueDate: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    credentialUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    imageUrl: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const idSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
