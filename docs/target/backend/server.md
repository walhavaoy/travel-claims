---
component: server
area: backend
priority: P0
status: planned
created: 2026-05-04
---

# Server

> Express application bootstrap, middleware, health, and shutdown.

## Purpose

Single entry point that initializes the database, runs migrations, mounts middleware, and starts listening on PORT.

## Requirements

### Core
- REQ-BE-01: Express app listening on PORT env var (default 3000) [priority: must]
- REQ-BE-02: Run migrations before accepting connections [priority: must]
- REQ-BE-03: GET /healthz returns {status: "ok"} [priority: must]
- REQ-BE-04: Graceful shutdown on SIGTERM/SIGINT [priority: must]
- REQ-BE-05: pino request logging middleware [priority: must]
- REQ-BE-06: Serve static files from /public directory [priority: must]
- REQ-BE-07: SPA fallback: non-API routes return index.html [priority: must]

### Extended
- REQ-BE-10: Readiness probe at /readyz (checks DB connectivity) [priority: should]

## Acceptance Criteria

- App starts and responds to /healthz within 5s
- Static files served with correct content types
- SPA routes (e.g. /claims/new) return index.html

## Dependencies

- REQ-DM-01 (migrations)
- DATABASE_URL, PORT env vars
