---
component: server
area: backend
priority: P0
status: planned
created: 2026-04-30
---

# Server

> Express application bootstrap, configuration, and static file serving.

## Purpose

Single entry point that configures Express, runs migrations, mounts API routes, serves static files from /public, and handles SPA fallback routing.

## Requirements

### Core
- REQ-SV-01: Express server listening on PORT env var (default 3000) [priority: must]
- REQ-SV-02: Run database migrations before accepting connections [priority: must]
- REQ-SV-03: GET /healthz returns JSON { status: "ok" } [priority: must]
- REQ-SV-04: Serve static files from public/ directory [priority: must]
- REQ-SV-05: SPA fallback: non-API, non-static requests serve public/index.html [priority: must]
- REQ-SV-06: Use pino for all logging (never console.log) [priority: must]
- REQ-SV-07: Graceful shutdown on SIGTERM/SIGINT [priority: must]
- REQ-SV-08: Config from environment: PORT, DATABASE_URL, TRUST_FORWARD_AUTH, UPLOAD_DIR [priority: must]
- REQ-SV-09: JSON body parsing with reasonable size limit [priority: must]

### Extended
- REQ-SV-10: Request logging middleware with pino-http [priority: should]

## Acceptance Criteria

- Server starts and responds to /healthz
- Static files served with correct content types
- Non-existent paths return index.html (SPA routing)
- Server shuts down cleanly on SIGTERM

## Dependencies

- data/migrations (run before listen)
- backend/auth, backend/claims-api, backend/receipts, backend/export (mounted routes)
