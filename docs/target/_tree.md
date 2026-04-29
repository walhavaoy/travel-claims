---
project: travel-claims
status: planned
created: 2026-04-29
---

# Travel Claims & Receipts - Target Architecture

> Standalone web application for travel expense claim submission, manager approval, and finance payment tracking.

## Areas

| Area | Description | Components | Priority |
|------|-------------|------------|----------|
| data | Database schema, migrations, seed data | schema, seeds | P0 |
| backend | Express REST API, auth, file uploads | server, auth, claims-api, receipts-api, export | P0 |
| frontend | Vanilla JS UI served from /public | dashboard, claim-form, claim-detail, components | P1 |
| infrastructure | Dockerfile, Helm chart, CI config | dockerfile, helm-chart | P1 |

## Dependency Order

1. **data** - Schema and seeds must exist before API can function
2. **backend/server** - Express app scaffold, config, DB pool
3. **backend/auth** - Forward-auth middleware (all routes depend on identity)
4. **backend/claims-api** - Core CRUD + status transitions
5. **backend/receipts-api** - File upload/download (depends on claims existing)
6. **backend/export** - CSV export (depends on claims-api)
7. **frontend/components** - Shared UI primitives (badges, buttons)
8. **frontend/dashboard** - Role-based landing page
9. **frontend/claim-form** - Create/edit claim with line items
10. **frontend/claim-detail** - View claim, receipts, history, actions
11. **infrastructure/dockerfile** - Multi-stage build
12. **infrastructure/helm-chart** - K8s deployment manifests

## Status Flow

```
draft --> submitted --> approved --> paid
                   \-> rejected
```
