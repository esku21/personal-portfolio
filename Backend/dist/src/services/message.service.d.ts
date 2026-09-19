export declare function createMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}): any;
export declare function listMessages(): any;
export declare function updateMessageStatus(id: string, status: string): any;
export declare function getStats(): Promise<{
    projects: any;
    messages: any;
    unread: any;
    published: any;
    featured: any;
}>;
