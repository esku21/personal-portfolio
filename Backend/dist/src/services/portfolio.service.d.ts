import { prisma } from '../lib/prisma.js';
export declare function getPortfolio(): Promise<{
    profile: {
        id: string;
        name: string;
        role: string;
        bio: string;
        location: string;
        email: string;
        githubUrl: string | null;
        linkedinUrl: string | null;
        avatarUrl: string | null;
        resumeUrl: string | null;
        availability: string | null;
        aboutTitle: string | null;
        aboutText: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    projects: {
        id: string;
        slug: string;
        title: string;
        acronym: string | null;
        description: string;
        details: string | null;
        techStack: string[];
        githubUrl: string | null;
        liveUrl: string | null;
        imageUrl: string | null;
        imageUrls: string[];
        isPublished: boolean;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[];
    skills: {
        id: string;
        name: string;
        category: string;
        level: number;
        imageUrl: string | null;
        isPublished: boolean;
        sortOrder: number;
    }[];
    experience: {
        id: string;
        role: string;
        company: string;
        location: string | null;
        startDate: string;
        endDate: string | null;
        description: string;
        imageUrls: string[];
        isPublished: boolean;
        sortOrder: number;
    }[];
    education: {
        id: string;
        institution: string;
        degree: string;
        location: string | null;
        startDate: string;
        endDate: string | null;
        description: string | null;
        isPublished: boolean;
        sortOrder: number;
    }[];
    certifications: {
        id: string;
        name: string;
        issuer: string;
        issueDate: string | null;
        credentialUrl: string | null;
        imageUrl: string | null;
        isPublished: boolean;
        sortOrder: number;
    }[];
    services: {
        id: string;
        title: string;
        description: string;
        icon: string;
        isPublished: boolean;
        sortOrder: number;
    }[];
}>;
export declare function getPublishedProject(slug: string): import("../generated/prisma/index.js").Prisma.Prisma__ProjectClient<{
    id: string;
    slug: string;
    title: string;
    acronym: string | null;
    description: string;
    details: string | null;
    techStack: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    imageUrls: string[];
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null, null, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function listProjects(): import("../generated/prisma/index.js").Prisma.PrismaPromise<{
    id: string;
    slug: string;
    title: string;
    acronym: string | null;
    description: string;
    details: string | null;
    techStack: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    imageUrls: string[];
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}[]>;
type ReportPeriod = {
    from: Date;
    toExclusive: Date;
} | null;
export declare function getPortfolioReport(currentPeriod: ReportPeriod, previousPeriod: ReportPeriod): Promise<{
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
        skillCategories: {
            name: string;
            count: number;
        }[];
        serviceTypes: {
            name: string;
            count: number;
        }[];
        experienceOrganizations: {
            name: string;
            count: number;
        }[];
        educationQualifications: {
            name: string;
            count: number;
        }[];
    };
    period: {
        projectsCreated: {
            current: number;
            previous: number | null;
        };
        messagesReceived: {
            current: number;
            previous: number | null;
        };
    };
    activity: {
        bucket: string;
        events: {
            label: string;
            projects: number;
            messages: number;
        }[];
    };
    recentProjects: {
        createdAt: Date;
        id: string;
        isFeatured: boolean;
        isPublished: boolean;
        slug: string;
        title: string;
        updatedAt: Date;
    }[];
    dataQuality: {
        recordsWithoutCreationTimestamps: number;
        recordTypesWithoutCreationTimestamps: string[];
        projectCompletionStatusAvailable: boolean;
        experienceDurationReliable: boolean;
    };
}>;
export declare function createProject(data: Parameters<typeof prisma.project.create>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__ProjectClient<{
    id: string;
    slug: string;
    title: string;
    acronym: string | null;
    description: string;
    details: string | null;
    techStack: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    imageUrls: string[];
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function updateProject(id: string, data: Parameters<typeof prisma.project.update>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__ProjectClient<{
    id: string;
    slug: string;
    title: string;
    acronym: string | null;
    description: string;
    details: string | null;
    techStack: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    imageUrls: string[];
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function deleteProject(id: string): import("../generated/prisma/index.js").Prisma.Prisma__ProjectClient<{
    id: string;
    slug: string;
    title: string;
    acronym: string | null;
    description: string;
    details: string | null;
    techStack: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    imageUrls: string[];
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function getProfile(): import("../generated/prisma/index.js").Prisma.Prisma__ProfileClient<{
    id: string;
    name: string;
    role: string;
    bio: string;
    location: string;
    email: string;
    githubUrl: string | null;
    linkedinUrl: string | null;
    avatarUrl: string | null;
    resumeUrl: string | null;
    availability: string | null;
    aboutTitle: string | null;
    aboutText: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null, null, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function updateProfile(data: Parameters<typeof prisma.profile.upsert>[0]['create']): import("../generated/prisma/index.js").Prisma.Prisma__ProfileClient<{
    id: string;
    name: string;
    role: string;
    bio: string;
    location: string;
    email: string;
    githubUrl: string | null;
    linkedinUrl: string | null;
    avatarUrl: string | null;
    resumeUrl: string | null;
    availability: string | null;
    aboutTitle: string | null;
    aboutText: string | null;
    createdAt: Date;
    updatedAt: Date;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function listExperience(): import("../generated/prisma/index.js").Prisma.PrismaPromise<{
    id: string;
    role: string;
    company: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string;
    imageUrls: string[];
    isPublished: boolean;
    sortOrder: number;
}[]>;
export declare function createExperience(data: Parameters<typeof prisma.experience.create>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__ExperienceClient<{
    id: string;
    role: string;
    company: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string;
    imageUrls: string[];
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function updateExperience(id: string, data: Parameters<typeof prisma.experience.update>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__ExperienceClient<{
    id: string;
    role: string;
    company: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string;
    imageUrls: string[];
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function deleteExperience(id: string): import("../generated/prisma/index.js").Prisma.Prisma__ExperienceClient<{
    id: string;
    role: string;
    company: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string;
    imageUrls: string[];
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function listEducation(): import("../generated/prisma/index.js").Prisma.PrismaPromise<{
    id: string;
    institution: string;
    degree: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string | null;
    isPublished: boolean;
    sortOrder: number;
}[]>;
export declare function createEducation(data: Parameters<typeof prisma.education.create>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__EducationClient<{
    id: string;
    institution: string;
    degree: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string | null;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function updateEducation(id: string, data: Parameters<typeof prisma.education.update>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__EducationClient<{
    id: string;
    institution: string;
    degree: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string | null;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function deleteEducation(id: string): import("../generated/prisma/index.js").Prisma.Prisma__EducationClient<{
    id: string;
    institution: string;
    degree: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string | null;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function listSkills(): import("../generated/prisma/index.js").Prisma.PrismaPromise<{
    id: string;
    name: string;
    category: string;
    level: number;
    imageUrl: string | null;
    isPublished: boolean;
    sortOrder: number;
}[]>;
export declare function createSkill(data: Parameters<typeof prisma.skill.create>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__SkillClient<{
    id: string;
    name: string;
    category: string;
    level: number;
    imageUrl: string | null;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function updateSkill(id: string, data: Parameters<typeof prisma.skill.update>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__SkillClient<{
    id: string;
    name: string;
    category: string;
    level: number;
    imageUrl: string | null;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function deleteSkill(id: string): import("../generated/prisma/index.js").Prisma.Prisma__SkillClient<{
    id: string;
    name: string;
    category: string;
    level: number;
    imageUrl: string | null;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function listServices(): import("../generated/prisma/index.js").Prisma.PrismaPromise<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isPublished: boolean;
    sortOrder: number;
}[]>;
export declare function createService(data: Parameters<typeof prisma.service.create>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__ServiceClient<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function updateService(id: string, data: Parameters<typeof prisma.service.update>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__ServiceClient<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function deleteService(id: string): import("../generated/prisma/index.js").Prisma.Prisma__ServiceClient<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function listCertifications(): import("../generated/prisma/index.js").Prisma.PrismaPromise<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string | null;
    credentialUrl: string | null;
    imageUrl: string | null;
    isPublished: boolean;
    sortOrder: number;
}[]>;
export declare function createCertification(data: Parameters<typeof prisma.certification.create>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__CertificationClient<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string | null;
    credentialUrl: string | null;
    imageUrl: string | null;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function updateCertification(id: string, data: Parameters<typeof prisma.certification.update>[0]['data']): import("../generated/prisma/index.js").Prisma.Prisma__CertificationClient<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string | null;
    credentialUrl: string | null;
    imageUrl: string | null;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function deleteCertification(id: string): import("../generated/prisma/index.js").Prisma.Prisma__CertificationClient<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string | null;
    credentialUrl: string | null;
    imageUrl: string | null;
    isPublished: boolean;
    sortOrder: number;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export {};
