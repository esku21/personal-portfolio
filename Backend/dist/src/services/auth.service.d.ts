export declare function authenticate(email: string, password: string): Promise<{
    token: any;
    admin: {
        id: any;
        email: any;
        name: any;
    };
} | null>;
export declare function findAdmin(id: string): any;
