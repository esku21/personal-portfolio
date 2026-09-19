import type { NextFunction, Request, Response } from 'express';
export interface AuthRequest extends Request {
    adminId?: string;
}
export declare function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
