import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
export declare function login(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function me(req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
