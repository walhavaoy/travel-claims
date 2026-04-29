---
project: travel-claims
domain: claims.tmpclaw.io
status: planned
created: 2026-04-29
---

# Travel Claims & Receipts - Target Architecture

> Standalone web application for travel expense claim submission, approval, and payment tracking.

## Areas

| Area | Description | Components | Priority |
|------|-------------|------------|----------|
| data | PostgreSQL schema, migrations, seed data | schema, migrations, seed | P0 |
| backend | Express API server, routes, middleware | server, auth, claims-api, receipts-api, export-api | P0 |
| frontend | Vanilla JS UI served from /public | dashboard, claim-form, claim-detail, shared | P1 |
| infrastructure | Dockerfile, Helm chart, deployment config | dockerfile, helm-chart, config | P0 |

## Priority Matrix

### P0 - Critical (must ship)
- data/schema - Database tables and constraints
- data/migrations - Schema migration runner
- data/seed - Stub users (Alice, Bob, Carol)
- backend/server - Express server, middleware stack, static serving
- backend/auth - Forward-auth header parsing, role mapping
- backend/claims-api - Claims CRUD and status transitions
- backend/receipts-api - Multipart upload and download
- infrastructure/dockerfile - Multi-stage build, non-root
- infrastructure/helm-chart - Deployment + Service + PVC
- infrastructure/config - Environment variable handling

### P1 - High (required for acceptance)
- backend/export-api - CSV export for finance role
- frontend/dashboard - Role-based claim listing
- frontend/claim-form - Create claim with line items
- frontend/claim-detail - View, actions, receipt display, history

### P2 - Medium
- frontend/shared - Status badges, layout, responsive design
