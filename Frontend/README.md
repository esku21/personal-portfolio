# Personal Portfolio

A full stack portfolio website with a public profile and project showcase, plus an authenticated administration area for maintaining portfolio content and reviewing contact messages.

## Features

- Public portfolio pages for profile, skills, experience, education, certifications, projects, and publications.
- Responsive interface with light and dark themes.
- Contact form backed by the API.
- Admin sign-in and protected dashboard for managing portfolio content.
- PostgreSQL persistence, input validation, request logging, rate limiting, and API documentation.

## Technology

### Frontend

- React 19 and TypeScript
- Vite 8 for development and production builds
- Tailwind CSS 4 for styling
- React Router for navigation
- Axios for API requests
- Framer Motion for animations
- Lucide React for icons
- Oxlint and Prettier for code quality and formatting

### Backend

- Node.js and TypeScript
- Express 5 REST API
- PostgreSQL database
- Prisma ORM with the PostgreSQL adapter
- Zod for request and environment validation
- JWT authentication and bcrypt password hashing
- Helmet, CORS, and express-rate-limit for API security
- Pino for logging
- Swagger UI for API documentation

## Requirements

- Node.js (use a current LTS release) and npm
- PostgreSQL  
  You can use a local PostgreSQL server or a hosted PostgreSQL database.

## Project layout

```text
myPortfolio/
├── Backend/       # Express API, Prisma schema, migrations, and seed data
└── Frontend/      # React application
```

## Installation

Open two terminals from the repository root, one for each application.

### 1. Configure and start the backend

```bash
cd Backend
npm install
```

Create `Backend/.env` with your PostgreSQL connection and local settings:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/portfolio?schema=public"
JWT_SECRET="replace-with-a-random-secret-at-least-16-characters"
PORT=5000
FRONTEND_URL="http://localhost:5173"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-strong-password"
```

Create the `portfolio` database first, then apply migrations and generate the Prisma client:

```bash
npm run prisma:migrate
npm run prisma:generate
```

Create or update the initial admin account using the configured `ADMIN_EMAIL` and `ADMIN_PASSWORD`:

```bash
npm run prisma:seed
```

Start the API in development mode:

```bash
npm run dev
```

The API listens at `http://localhost:5000`. Swagger documentation is available at `http://localhost:5000/api/docs`.

### 2. Configure and start the frontend

In the second terminal:

```bash
cd Frontend
npm install
```

The optional `Frontend/.env` setting can override the API address:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

If omitted, the frontend uses port 5000 on the same host as the page. Start the Vite development server:

```bash
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`). Sign in to the admin area at `/login` with the credentials configured when seeding the backend.

## Available commands

### Frontend (`Frontend/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create the production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

### Backend (`Backend/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API with automatic reload |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Start the compiled API |
| `npm run prisma:migrate` | Apply development database migrations |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:seed` | Seed/update the admin account |
| `npm test` | Run backend tests |

## API overview

The backend exposes public portfolio and contact endpoints, authentication endpoints, and protected admin endpoints under `/api`. See `/api/docs` while the backend is running for the available routes and request details.

## Configuration notes

- Keep `Backend/.env` private; do not commit database credentials or production secrets.
- `JWT_SECRET` must be at least 16 characters. Use a unique random value outside local development.
- Set `FRONTEND_URL` to the deployed frontend origin when deploying so the API CORS policy accepts it.
- Set `VITE_API_BASE_URL` to the deployed API base URL (including `/api`) when frontend and backend are hosted separately.
- For a production backend, build with `npm run build`, then run `npm start`.
