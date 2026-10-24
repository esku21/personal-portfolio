
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { env } from './lib/env.js'
import { logger } from './lib/logger.js'
import { prisma } from './lib/prisma.js'
import { requireAuth } from './middleware/auth.js'
import { errorHandler } from './middleware/errors.js'
import { publicRouter } from './routes/public.routes.js'
import { authRouter } from './routes/auth.routes.js'
import { adminRouter } from './routes/admin.routes.js'

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
}

export const app = express()

app.disable('x-powered-by')

// Render runs behind a reverse proxy.
app.set('trust proxy', 1)

// Configure allowed frontend origins.
const allowedFrontendOrigins = new Set(
  [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://10.230.49.216:5173',
  ]
    .filter((origin): origin is string => Boolean(origin))
    .map((origin) => origin.replace(/\/+$/, ''))
)

// CORS must run before API routes.
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedFrontendOrigins.has(origin.replace(/\/+$/, ''))
      ) {
        callback(null, true)
      } else {
        callback(new Error(`Origin not allowed by CORS: ${origin}`))
      }
    },
    credentials: false,
  })
)

// Security headers.
app.use(helmet())

// Request body limits.
app.use(
  '/api/admin/projects',
  requireAuth,
  express.json({ limit: '75mb' })
)

app.use(
  '/api/admin/experience',
  requireAuth,
  express.json({ limit: '75mb' })
)

app.use(express.json({ limit: '8mb' }))

// Rate limiting.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) => req.path.startsWith('/api/admin'),
  })
)

// Homepage: fixes "Cannot GET /".
// This confirms the backend is running; it does not serve the frontend UI.
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'Personal Portfolio API',
    status: 'running',
    message: 'Welcome to the Personal Portfolio API.',
    endpoints: {
      health: '/api/health',
      portfolio: '/api/portfolio',
      documentation: '/api-docs',
    },
  })
})

// API and database health check.
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      status: 'ok',
      database: 'connected',
    })
  } catch (error) {
    logger.error({ error }, 'Database health check failed')

    res.status(503).json({
      status: 'error',
      database: 'unavailable',
    })
  }
})

// Public API routes.
app.use('/api', publicRouter)

// Authentication routes.
app.use('/api/auth', authRouter)

// Protected admin routes.
app.use('/api/admin', adminRouter)

// Swagger API documentation.
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
)

// Handle unknown routes.
app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found.',
  })
})

// Centralized error handler must be last.
app.use(errorHandler)
