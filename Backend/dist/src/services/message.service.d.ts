export declare function createMessage(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}): import("../generated/prisma/index.js").Prisma.Prisma__ContactMessageClient<{
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function listMessages(): import("../generated/prisma/index.js").Prisma.PrismaPromise<{
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare function updateMessageStatus(id: string, status: string): import("../generated/prisma/index.js").Prisma.Prisma__ContactMessageClient<{
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function deleteMessage(id: string): import("../generated/prisma/index.js").Prisma.Prisma__ContactMessageClient<{
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function getStats(): Promise<{
    projects: number;
    messages: number;
    unread: number;
    published: number;
    featured: number;
}>;
