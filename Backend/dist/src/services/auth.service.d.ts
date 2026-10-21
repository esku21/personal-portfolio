export declare function authenticate(email: string, password: string): Promise<{
    token: string;
    admin: {
        id: string;
        email: string;
        name: string;
    };
} | null>;
export declare function findAdmin(id: string): import("../generated/prisma/index.js").Prisma.Prisma__AdminClient<{
    email: string;
    id: string;
    name: string;
} | null, null, import("../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare function updateAdminAccount(id: string, data: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
}): Promise<{
    email: string;
    id: string;
    name: string;
} | null>;
