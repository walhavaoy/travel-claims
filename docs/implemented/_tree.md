---
project: travel-claims
status: implemented
coverage: 0%
created: 2026-04-30
---

# Travel Claims - Target Architecture

> Standalone travel expense claims web application at claims.tmpclaw.io.

## Area Index

| Area | Description | Components | Priority |
|------|-------------|------------|----------|
| data | Database schema, migrations, seed data | schema, migrations | P0 |
| backend | Express server, API routes, middleware | server, auth, claims-api, receipts, export, status-machine | P0 |
| frontend | Vanilla JS UI served from /public | shell, dashboard, claim-form, claim-detail | P1 |
| infrastructure | Docker, Helm, deployment config | docker, helm | P0 |

## Priority Matrix

### P0 - Critical (must ship)
- data/schema - PostgreSQL tables and indexes
- data/migrations - Schema migration runner
- backend/server - Express app setup and config
- backend/auth - Forward-auth middleware
- backend/claims-api - Claims CRUD + status transitions
- backend/receipts - Receipt upload/download via Multer
- backend/export - CSV export for finance role
- infrastructure/docker - Multi-stage Dockerfile
- infrastructure/helm - Helm chart (Deployment + Service)

### P1 - High (must ship, depends on P0)
- frontend/shell - HTML shell, routing, styles
- frontend/dashboard - Role-based dashboard view
- frontend/claim-form - Create claim with line items
- frontend/claim-detail - Detail view with actions
