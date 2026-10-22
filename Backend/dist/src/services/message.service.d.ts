export declare function createMessage(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}): import("../generated/prisma/models.js").Prisma__ContactMessageClient<{
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}, never, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: import("../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
}>;
export declare function listMessages(): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
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
export declare function updateMessageStatus(id: string, status: string): import("../generated/prisma/models.js").Prisma__ContactMessageClient<{
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}, never, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: import("../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
}>;
export declare function deleteMessage(id: string): import("../generated/prisma/models.js").Prisma__ContactMessageClient<{
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}, never, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: import("../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
}>;
export declare function getStats(): Promise<{
    projects: number;
    messages: number;
    unread: number;
    published: number;
    featured: number;
}>;
