import { Request, Response } from 'express';
export declare const getProjects: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const saveProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
