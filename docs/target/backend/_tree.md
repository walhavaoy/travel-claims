---
area: backend
status: planned
created: 2026-04-29
---

# Backend Area

> Express REST API handling authentication, claims CRUD, receipt uploads, and CSV export.

## Components

| Component | Description | Priority |
|-----------|-------------|----------|
| server | Express app setup, middleware stack, DB pool, static file serving, health check | P0 |
| auth | Keycloak forward-auth via X-Forwarded-User header, role resolution, user lookup | P0 |
| claims-api | CRUD endpoints for claims: list, get, create, update/transition, delete | P0 |
| receipts-api | Multipart upload via Multer, download with correct content-type, file validation | P0 |
| export | GET /api/claims/export/csv - finance-only CSV export of approved/paid claims | P1 |

## Shared Patterns

- All endpoints return JSON with consistent error shape: `{ error: string }`
- Status transitions use `SELECT ... FOR UPDATE` within a transaction
- pino logger on all request handlers
- Request validation before DB access
