# Travel Claims & Receipts — Project Instructions

## Overview
Standalone travel expense claim & receipt management system. Employees submit claims with line items and receipts; managers approve/reject; finance marks as paid and exports CSV. Deployed at claims.tmpclaw.io.

## Tech Stack
- **Runtime:** Node.js 22
- **Framework:** Express (latest)
- **Language:** TypeScript 5.6+ with strict mode
- **Database:** PostgreSQL via `pg` (DATABASE_URL from platform)
- **File uploads:** Multer, stored on PVC at /data/receipts
- **Frontend:** Vanilla JS + HTML served from /public (no build step)
- **Logging:** pino (never console.log)
- **Container:** Multi-stage Dockerfile, UID 1001
- **Orchestration:** Helm chart (Deployment "product" + Service on port 3000)

## Directory Structure (target)
```
/
├── src/                    # TypeScript source
│   ├── index.ts           # Entry point: migrations then Express listen
│   ├── config.ts          # Environment config
│   ├── db.ts              # pg Pool setup
│   ├── migrate.ts         # Migration runner
│   ├── seed.ts            # Stub user seeder
│   ├── middleware/
│   │   ├── auth.ts        # X-Forwarded-User -> user lookup
│   │   ├── logger.ts      # pino request logging
│   │   └── errors.ts      # Global error handler
│   ├── routes/
│   │   ├── claims.ts      # /api/claims CRUD + transitions
│   │   ├── receipts.ts    # /api/claims/:id/receipts upload/download
│   │   └── export.ts      # /api/claims/export/csv
│   └── types.ts           # Shared interfaces
├── public/                 # Static frontend (vanilla JS, no build)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── pages/             # Page modules
├── migrations/             # SQL migration files (001_init.sql, etc.)
├── chart/                  # Helm chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── Dockerfile
├── .dockerignore
├── package.json
├── tsconfig.json
└── docs/                   # Architecture docs
```

## Build & Run
```bash
npm install          # Install deps
npm run build        # tsc -> dist/
npm run dev          # tsx watch src/index.ts (dev mode)
npm start            # node dist/index.js (production)
npm test             # vitest (when tests exist)
```

## Environment Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | yes | — | PostgreSQL connection string |
| PORT | no | 3000 | HTTP listen port |
| TRUST_FORWARD_AUTH | no | true | Trust X-Forwarded-User header |
| UPLOAD_DIR | no | /data/receipts | Receipt file storage path |
| LOG_LEVEL | no | info | pino log level |

## Code Conventions
- Use pino for all logging (import from a shared logger instance)
- Use parameterized SQL queries ($1, $2) — never string interpolation
- All interactive UI elements must have `data-testid="travelclaims-{element}"` attributes
- Error responses: `{ error: string, details?: string }` with appropriate HTTP status
- Use UUID v4 for all primary keys (gen_random_uuid() in PostgreSQL)
- Transactions: always use client from pool.connect(), with try/finally release
- Status transitions: SELECT ... FOR UPDATE within transaction
- TypeScript strict mode, no `any` types, define interfaces for all data shapes

## Status Flow
```
draft -> submitted -> approved -> paid
                  \-> rejected
```

## Auth Model
- Forward-auth: identity from X-Forwarded-User header
- Three stub users (seeded on startup):
  - Alice (employee, engineering, reports to Bob)
  - Bob (manager, engineering)
  - Carol (finance, finance dept)
- Role enforcement per route, not global

## Key Design Decisions
1. Single service serves both API and UI (no separate frontend deploy)
2. No ORM — raw pg with parameterized queries for simplicity and control
3. Migrations are sequential .sql files run via a simple runner on startup
4. FOR UPDATE locks prevent TOCTOU on status transitions
5. File uploads stored on filesystem PVC (not blob storage) — simplest for MVP
6. No framework for frontend — vanilla JS keeps it zero-dependency and fast
