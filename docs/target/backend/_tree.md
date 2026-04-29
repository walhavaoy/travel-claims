---
area: backend
status: planned
created: 2026-04-29
---

# Backend

> Express HTTP server providing REST API and serving the static frontend.

## Components

| Component | Priority | Description |
|-----------|----------|-------------|
| server | P0 | Express app setup, middleware, static serving, health check |
| auth | P0 | X-Forwarded-User header parsing, role lookup, request context |
| claims-api | P0 | Claims CRUD, status transitions with FOR UPDATE locks |
| receipts-api | P0 | Multer multipart upload, file download with content-type |
| export-api | P1 | CSV export of approved/paid claims for finance role |

## Route Overview

| Method | Path | Auth | Handler |
|--------|------|------|---------|
| GET | /healthz | none | Health check |
| GET | /api/claims | all roles | Role-filtered claim list |
| POST | /api/claims | employee | Create draft claim |
| GET | /api/claims/:id | owner/manager/finance | Claim detail |
| PATCH | /api/claims/:id | varies by action | Edit/submit/approve/reject/mark-paid |
| DELETE | /api/claims/:id | owner | Delete draft only |
| POST | /api/claims/:id/receipts | owner | Upload receipt |
| GET | /api/claims/:id/receipts | all roles | List/download receipts |
| GET | /api/claims/export/csv | finance | CSV export |
| GET | /* | none | Static file serving from /public |
