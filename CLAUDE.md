# Travel Claims & Receipts (claims.tmpclaw.io)

Standalone web application for travel expense claim submission, manager approval, and finance payment tracking.

## Project Context
- **Domain:** claims.tmpclaw.io
- **Realm:** travel-claims-e4e54fca
- **Namespace:** project-travel-claims-e4e54fca
- **Repo:** git@github.com:walhavaoy/travel-claims.git

## Tech Stack
- **Runtime:** Node.js 22
- **Framework:** Express
- **Language:** TypeScript (strict mode), compiled with `tsc` to `dist/`
- **Database:** PostgreSQL via `pg` driver, connection via `DATABASE_URL`
- **Frontend:** Vanilla JS + HTML served from `public/`, no build step
- **File uploads:** Multer (5MB limit, jpeg/png/pdf only), stored at `/data/receipts`
- **Logging:** Pino (never console.log)
- **Container:** Multi-stage Dockerfile, runs as UID 1001, port 3000
- **Deployment:** Helm chart, Deployment + Service named `product`

## Directory Structure (Target)
```
/
├── src/                    # TypeScript source
│   ├── index.ts           # Express server entry point
│   ├── config.ts          # Environment variable loading
│   ├── db/
│   │   ├── pool.ts        # pg Pool setup
│   │   ├── migrate.ts     # Migration runner
│   │   └── migrations/    # SQL migration files
│   ├── middleware/
│   │   └── auth.ts        # X-Forwarded-User auth middleware
│   ├── routes/
│   │   ├── claims.ts      # Claims CRUD + status transitions
│   │   ├── receipts.ts    # Receipt upload/download
│   │   └── export.ts      # CSV export
│   └── types.ts           # Shared TypeScript interfaces
├── public/                 # Static frontend (no build step)
│   ├── index.html
│   ├── app.js
│   └── style.css
├── chart/                  # Helm chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── dist/                   # Compiled JS (gitignored)
├── Dockerfile
├── tsconfig.json
├── package.json
└── docs/                   # Project documentation
    ├── target/             # Specifications
    └── implemented/        # Implementation tracking
```

## Build / Run / Test
```bash
npm install                 # Install dependencies
npm run build               # tsc -> dist/
npm start                   # node dist/index.js
npm run dev                 # tsx watch src/index.ts
npm test                    # Jest tests (when added)
```

## Environment Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3000 | HTTP listen port |
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| TRUST_FORWARD_AUTH | No | true | Enable X-Forwarded-User auth |
| UPLOAD_DIR | No | /data/receipts | Receipt storage path |
| LOG_LEVEL | No | info | Pino log level |

## Code Conventions
- **Logging:** Always use Pino (`import pino from 'pino'`), never `console.log`
- **Types:** Strict TypeScript, no `any`. Define interfaces for all data shapes in `types.ts`
- **data-testid:** All interactive UI elements must have `data-testid="travelclaims-{element}-{name}"` (e.g., `travelclaims-button-submit`, `travelclaims-input-destination`)
- **SQL:** Use parameterized queries (`$1`, `$2`), never string interpolation
- **Status transitions:** Always use `SELECT ... FOR UPDATE` in a transaction
- **Error handling:** Express error middleware, meaningful HTTP status codes (400/401/403/404/409/413/415)
- **API fields:** snake_case (e.g., `submitter_id`, `trip_dates`, `line_items`)
- **IDs:** UUID via `gen_random_uuid()`

## Key Design Decisions
1. **No ORM** — raw SQL via `pg` for transparency and control over FOR UPDATE locks
2. **Migrations on startup** — simple version-tracked migrations, no external tooling
3. **Forward-auth only** — no login form, identity from X-Forwarded-User header
4. **Single container** — one Express process serves API + static files
5. **No frontend build step** — plain JS/CSS/HTML in `public/`

## Database
- **Host:** postgres.tmpclaw.svc.cluster.local
- **Database:** travel_claims
- **Tables:** users, claims, line_items, receipts, claim_history

## Stub Users
| Name | Role | Department | Manager |
|------|------|------------|---------|
| Alice | employee | Engineering | Bob |
| Bob | manager | Engineering | - |
| Carol | finance | Finance | - |

## Status Flow
```
draft -> submitted -> approved -> paid
                  \-> rejected
```
