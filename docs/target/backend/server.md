---
component: server
area: backend
priority: P0
status: planned
created: 2026-04-29
---

# Server Setup

> Express application scaffold: middleware stack, PostgreSQL connection pool, static file serving, health check, and graceful shutdown.

## Purpose

Single entry point (src/index.ts) that wires together Express, the pg Pool, all API routes, static file serving from /public, and handles process lifecycle.

## Requirements

### Core
- REQ-SV-01: Express app listening on PORT env var (default 3000) [priority: must]
- REQ-SV-02: PostgreSQL connection pool via `pg.Pool` using DATABASE_URL env var [priority: must]
- REQ-SV-03: Run schema migration and seed on startup (ensure tables exist) [priority: must]
- REQ-SV-04: Serve static files from /public directory for the frontend [priority: must]
- REQ-SV-05: GET /healthz endpoint returning { status: "ok" } [priority: must]
- REQ-SV-06: Graceful shutdown on SIGTERM/SIGINT (close pool, stop server) [priority: must]
- REQ-SV-07: Use pino for all logging (never console.log) [priority: must]
- REQ-SV-08: JSON body parser middleware for API routes [priority: must]
- REQ-SV-09: SPA fallback: serve index.html for non-API, non-static routes [priority: must]

### Extended
- REQ-SV-10: Request logging middleware with pino-http [priority: should]
- REQ-SV-11: CORS headers for development (configurable via CORS_ORIGIN env) [priority: could]

## Acceptance Criteria

- `curl http://localhost:3000/healthz` returns 200 with JSON body
- Static files in /public are served with correct MIME types
- Application starts, connects to PostgreSQL, runs migrations, and is ready to serve

## Dependencies

- express, pg, pino, multer (npm packages)
- PostgreSQL instance accessible via DATABASE_URL
