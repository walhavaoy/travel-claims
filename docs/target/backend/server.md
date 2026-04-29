---
component: server
area: backend
priority: P0
status: planned
created: 2026-04-29
---

# Express Server

> Main application entry point: Express server with middleware stack, static file serving, and health check.

## Purpose

Single Express process that serves both the REST API and the vanilla JS frontend. Runs on PORT (default 3000). Handles graceful shutdown.

## Requirements

### Core
- REQ-SV-01: Express server listening on PORT env var (default 3000) [priority: must]
- REQ-SV-02: Serve static files from /public directory for the frontend [priority: must]
- REQ-SV-03: GET /healthz returns 200 with { status: "ok" } [priority: must]
- REQ-SV-04: JSON body parser middleware for API routes [priority: must]
- REQ-SV-05: Pino HTTP request logging middleware [priority: must]
- REQ-SV-06: Run database migrations before accepting connections [priority: must]
- REQ-SV-07: Graceful shutdown on SIGTERM/SIGINT [priority: must]
- REQ-SV-08: SPA fallback — serve index.html for non-API, non-static routes [priority: must]

### Extended
- REQ-SV-10: Request ID middleware (X-Request-Id header) [priority: should]

## Acceptance Criteria
- Server starts and accepts HTTP requests on configured port
- Static files served with correct MIME types
- Health check responds to /healthz
- API routes and static routes coexist without conflicts
- Server shuts down gracefully (drains connections)

## Dependencies
- data/migrations (must complete before listening)
- backend/auth (middleware in stack)
- infrastructure/config (PORT, DATABASE_URL env vars)
