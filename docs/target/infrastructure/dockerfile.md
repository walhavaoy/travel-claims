---
component: dockerfile
area: infrastructure
priority: P0
status: planned
created: 2026-04-29
---

# Dockerfile

> Multi-stage Docker build producing a minimal Node.js 22 image running as non-root.

## Purpose

Build the TypeScript backend to JavaScript and package with the static frontend into a production container image.

## Requirements

### Core
- REQ-DF-01: Multi-stage build — builder stage compiles TypeScript, final stage copies only dist/ and public/ [priority: must]
- REQ-DF-02: Base image: node:22-slim [priority: must]
- REQ-DF-03: Run as UID 1001 (non-root) [priority: must]
- REQ-DF-04: Expose port 3000 [priority: must]
- REQ-DF-05: Install only production dependencies in final stage [priority: must]
- REQ-DF-06: Create /data/receipts directory with correct ownership [priority: must]
- REQ-DF-07: CMD: node dist/index.js [priority: must]

### Extended
- REQ-DF-10: .dockerignore excludes node_modules, .git, src/, tsconfig.json [priority: should]

## Acceptance Criteria
- `docker build .` succeeds
- Container starts and responds to /healthz
- Process runs as UID 1001
- /data/receipts directory exists and is writable

## Dependencies
- backend/server (entry point at dist/index.js)
- frontend/shared (public/ directory)
