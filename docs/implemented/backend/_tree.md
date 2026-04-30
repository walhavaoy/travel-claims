---
area: backend
status: implemented
coverage: 0%
created: 2026-04-30
---

# Backend Area

> Express + TypeScript API server serving REST endpoints and static files.

## Components

| Component | Priority | Description |
|-----------|----------|-------------|
| server | P0 | Express app bootstrap, config, health check, static serving |
| auth | P0 | X-Forwarded-User middleware, user lookup, role resolution |
| claims-api | P0 | CRUD routes for claims with role-filtered listing |
| receipts | P0 | Multer upload, receipt download with correct content-type |
| export | P0 | CSV export of approved/paid claims for finance role |
| status-machine | P0 | Status transition logic with FOR UPDATE locks |
