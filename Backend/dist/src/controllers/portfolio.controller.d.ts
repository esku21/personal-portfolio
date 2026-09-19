import type { NextFunction, Request, Response } from 'express';
export declare function portfolio(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function projectDetails(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
