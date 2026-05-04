---
area: backend
status: planned
created: 2026-05-04
---

# Backend Area

> Express REST API with forward-auth, claim management, and receipt uploads.

## Components

| Component | Priority | Description |
|-----------|----------|-------------|
| server | P0 | Express app setup, middleware, health check, graceful shutdown |
| auth | P0 | X-Forwarded-User header parsing, user lookup, role enforcement |
| claims-api | P0 | CRUD + status transitions for claims and line items |
| receipts-api | P0 | Multipart file upload, download, deletion |
| export | P1 | CSV export of paid claims for finance role |

## Key Decisions

- Express 5 with async error handling
- Middleware chain: request logging -> auth -> route handler
- Role-based access enforced per-route (not global)
- Transactions with FOR UPDATE for status transitions (no TOCTOU)
- Multer for multipart, files to /data/receipts PVC
