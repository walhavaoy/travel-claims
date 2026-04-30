# Travel Claims & Receipts (claims.tmpclaw.io)

Standalone web application for travel expense claim and receipt management.

## Project Overview

Employees submit travel expense claims with line items and receipt attachments. Managers review and approve/reject claims from their direct reports. Finance staff mark approved claims as paid and export CSV reports.

**Realm:** travel-claims-e4e54fca
**Domain:** claims.tmpclaw.io
**Namespace:** project-travel-claims-e4e54fca

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Express
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via `pg` (DATABASE_URL env, shared platform postgres)
- **Frontend:** Vanilla JS + HTML served from /public (no build step)
- **File uploads:** Multer (5MB limit, JPEG/PNG/PDF only)
- **Logging:** pino (never console.log)
- **Container:** Multi-stage Dockerfile, node:22-slim, UID 1001
- **Deploy:** Helm chart → Deployment + Service named "product" on port 3000

## Directory Structure

```
/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── config.ts             # Environment config
│   ├── db/
│   │   ├��─ pool.ts           # pg Pool from DATABASE_URL
│   │   └── migrate.ts        # Startup migration runner
│   ├── middleware/
│   │   ├── auth.ts           # X-Forwarded-User → user context
│   │   └── error.ts          # Global error handler
│   ├── routes/
│   │   ├── claims.ts         # Claims CRUD + status transitions
│   │   ├── receipts.ts       # Receipt upload/download
│   │   └── export.ts         # CSV export (finance only)
│   ├── services/
│   │   └── status-machine.ts # Status transition rules + FOR UPDATE
│   └── types.ts              # Shared TypeScript interfaces
├── migrations/
│   └── 001_initial.sql       # Schema + seed data
├── public/                   # Static frontend (vanilla JS)
│   ├── index.html
│   ├── app.js
│   └── style.css
├── chart/                    # Helm chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment.yaml
│       └── service.yaml
├── Dockerfile
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

## Build / Run / Test

```bash
npm install              # Install dependencies
npm run build            # TypeScript → dist/
npm run dev              # Dev server with tsx watch
npm start                # Production: node dist/index.js
npm test                 # Run tests (if present)
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3000 | HTTP listen port |
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| TRUST_FORWARD_AUTH | No | true | Trust X-Forwarded-User header |
| UPLOAD_DIR | No | /data/receipts | Receipt file storage path |

## Key Design Decisions

1. **Single container:** API + static frontend in one Express server. No separate frontend build or container.
2. **Startup migrations:** Schema applied on boot via simple SQL file runner. No CREATE DATABASE — platform provisions the DB.
3. **Forward-auth only:** No login forms. Identity from X-Forwarded-User header, looked up in users table.
4. **FOR UPDATE locks:** All status transitions acquire a row lock before checking current status, preventing TOCTOU races.
5. **Flat hierarchy:** Manager sees only direct reports (manager_id == self). No recursive/transitive chains.
6. **PVC-backed uploads:** Receipt files stored on disk at UPLOAD_DIR, backed by a PVC in Kubernetes.

## Data Model

### Status Flow
```
draft → submitted → approved → paid
                  ↘ rejected
```

### Stub Users
| Name | Role | Department | Manager | UUID |
|------|------|------------|---------|------|
| Alice | employee | engineering | Bob | a11c0000-0000-4000-8000-000000000002 |
| Bob | manager | engineering | (none) | b0b00000-0000-4000-8000-000000000001 |
| Carol | finance | finance | (none) | ca201000-0000-4000-8000-000000000003 |

## Code Conventions

- Use `pino` for all logging — never `console.log`
- TypeScript strict mode, no `any` unless truly unavoidable
- `data-testid` attributes on all interactive UI elements, prefix: `travelclaims-`
- Error responses: `{ error: "message" }` with appropriate HTTP status
- SQL parameterized queries only — never string interpolation
- UUIDs for all primary keys (gen_random_uuid())

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /healthz | No | Health check |
| GET | /api/me | Yes | Current user info |
| GET | /api/claims | Yes | Role-filtered claim list |
| GET | /api/claims/:id | Yes | Claim detail with line_items + history |
| POST | /api/claims | Yes | Create draft claim |
| PATCH | /api/claims/:id | Yes | Edit or transition status |
| DELETE | /api/claims/:id | Yes | Delete draft claim |
| POST | /api/claims/:id/receipts | Yes | Upload receipt for line item |
| GET | /api/claims/:id/receipts | Yes | List receipts for claim |
| GET | /api/receipts/:id/download | Yes | Download receipt file |
| GET | /api/claims/export/csv | Yes | CSV export (finance only) |
