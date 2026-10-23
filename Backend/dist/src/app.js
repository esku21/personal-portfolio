import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './lib/env.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errors.js';
import { publicRouter } from './routes/public.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { adminRouter } from './routes/admin.routes.js';
const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Portfolio API',
        version: '1.0.0',
        description: 'Public portfolio and authenticated content management API.',
    },
    servers: [{ url: '/' }],
    tags: [
        { name: 'Public' },
        { name: 'Authentication' },
        { name: 'Admin' },
    ],
    paths: {
        '/api/health': {
            get: {
                tags: ['Public'],
                summary: 'Check API and database health',
                responses: {
                    '200': { description: 'Healthy' },
                    '503': { description: 'Database unavailable' },
                },
            },
        },
        '/api/portfolio': {
            get: {
                tags: ['Public'],
                summary: 'Get published portfolio content',
                responses: {
                    '200': { description: 'Portfolio content' },
                },
            },
        },
        '/api/projects/{slug}': {
            get: {
                tags: ['Public'],
                summary: 'Get a published project',
                parameters: [
                    {
                        name: 'slug',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Project' },
                    '404': { description: 'Not found' },
                },
            },
        },
        '/api/contact': {
            post: {
                tags: ['Public'],
                summary: 'Send a contact message',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Contact' },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Created' },
                    '400': { description: 'Invalid input' },
                },
            },
        },
        '/api/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Authenticate an administrator',
                responses: {
                    '200': { description: 'JWT token' },
                    '401': { description: 'Invalid credentials' },
                },
            },
        },
        '/api/admin/stats': {
            get: {
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                summary: 'Get dashboard statistics',
                responses: {
                    '200': { description: 'Statistics' },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Contact: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    subject: { type: 'string' },
                    message: { type: 'string' },
                },
            },
        },
    },
};
export const app = express();
app.disable('x-powered-by');
// Render runs the app behind a reverse proxy.
// Trust one proxy hop so rate limiting can identify client IPs.
app.set('trust proxy', 1);
const allowedFrontendOrigins = new Set([
    env.FRONTEND_URL.replace(/\/+$/, ''),
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://10.230.49.216:5173',
]);
// CORS must run before API routes.
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedFrontendOrigins.has(origin.replace(/\/+$/, ''))) {
            callback(null, true);
        }
        else {
            callback(new Error(`Origin not allowed by CORS: ${origin}`));
        }
    },
    credentials: false,
}));
app.use('/api/admin/projects', requireAuth, express.json({ limit: '75mb' }));
app.use('/api/admin/experience', requireAuth, express.json({ limit: '75mb' }));
app.use(express.json({ limit: '8mb' }));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) => req.path.startsWith('/api/admin'),
}));
app.get('/api/health', async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({ status: 'ok', database: 'connected' });
    }
    catch (error) {
        logger.error({ error }, 'Database health check failed');
        res.status(503).json({
            status: 'error',
            database: 'unavailable',
        });
    }
});
app.use('/api', publicRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);
//# sourceMappingURL=app.js.map