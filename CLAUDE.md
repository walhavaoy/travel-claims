# Travel Claims & Receipts (claims.tmpclaw.io)

Standalone web application for travel expense claim submission, manager approval, and finance payment tracking.

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Express 4.x
- **Language:** TypeScript (strict mode, ESM)
- **Database:** PostgreSQL via `pg` (connection pooling)
- **File uploads:** Multer (5MB limit, JPEG/PNG/PDF only)
- **Logging:** pino (never console.log)
- **Frontend:** Vanilla JS + HTML served from /public (no build step)
- **Container:** Multi-stage Dockerfile, UID 1001 non-root
- **Deployment:** Helm chart in `chart/` directory

## Directory Structure (Target)

```
travel-claims/
  src/
    index.ts              # Express app entry point
    config.ts             # Environment config (PORT, DATABASE_URL, etc.)
    db/
      pool.ts             # pg Pool setup
      migrate.ts          # Schema migration (DDL)
      seed.ts             # Stub user inserts
    middleware/
      auth.ts             # X-Forwarded-User forward-auth
    routes/
      claims.ts           # /api/claims CRUD + transitions
      receipts.ts         # /api/claims/:id/receipts upload/download
      export.ts           # /api/claims/export/csv
    types.ts              # Shared TypeScript interfaces
  public/
    index.html            # SPA shell
    css/
      styles.css          # Global styles
    js/
      app.js              # Router and page controller
      dashboard.js        # Dashboard view
      claim-form.js       # Create/edit form
      claim-detail.js     # Detail + receipts + history
      components.js       # Shared UI components
  chart/
    Chart.yaml
    values.yaml
    templates/
      deployment.yaml
      service.yaml
      pvc.yaml
  Dockerfile
  tsconfig.json
  package.json
```

## Commands

```bash
npm install              # Install dependencies
npm run build            # TypeScript compile (tsc)
npm run dev              # Development with tsx watch
npm start                # Production (node dist/index.js)
npm test                 # Run tests (vitest)
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | HTTP listen port |
| DATABASE_URL | (required) | PostgreSQL connection string |
| TRUST_FORWARD_AUTH | true | Trust X-Forwarded-User header |
| UPLOAD_DIR | /data/receipts | Receipt file storage path |
| NODE_ENV | production | Runtime environment |

## Code Conventions

- **Logging:** Always use pino (`import logger from './logger'`). Never console.log.
- **Error responses:** `{ error: string }` with appropriate HTTP status.
- **data-testid:** All interactive elements use prefix `travelclaims-` (e.g., `travelclaims-button-submit`).
- **SQL:** Parameterized queries only ($1, $2...). Never string concatenation.
- **Transactions:** Status transitions must use `BEGIN` + `SELECT ... FOR UPDATE` + `COMMIT`.
- **Types:** Define interfaces in types.ts. Avoid `any`.
- **Naming:** camelCase for TS, snake_case for DB columns, kebab-case for CSS classes.

## Key Design Decisions

1. **Single container:** API + static frontend in one Express server (no nginx sidecar).
2. **Forward auth only:** No login forms. Identity comes from X-Forwarded-User header.
3. **Stub users:** Alice (employee), Bob (manager), Carol (finance) with hardcoded UUIDs.
4. **No ORM:** Direct pg queries for simplicity and control over transactions.
5. **Vanilla JS frontend:** No build step, no bundler. JS files served directly from /public.
6. **Status machine:** draft -> submitted -> approved -> paid (+ rejected branch). Enforced in API with row-level locking.

## Archived Source Reference

The `src/claims-manager/` and `src/claims-ui/` directories contain the original MFE plugin code from the tmpclaw platform. Use as reference for:
- Data model and API patterns (`claims-ui/public/ui/claims.js`)
- Status badge styling and UI patterns
- Existing test IDs and conventions

Do NOT copy directly. The new app is a standalone Express server, not an MFE plugin.
