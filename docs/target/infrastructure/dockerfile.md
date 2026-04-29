---
component: dockerfile
area: infrastructure
priority: P1
status: planned
created: 2026-04-29
---

# Dockerfile

> Multi-stage container build for the travel-claims application.

## Purpose

Build a production container image that compiles TypeScript, installs production dependencies, copies the public frontend assets, and runs as a non-root user.

## Requirements

### Core
- REQ-DK-01: Multi-stage build: builder stage compiles TS, final stage copies dist + node_modules + public [priority: must]
- REQ-DK-02: Base image: node:22-slim [priority: must]
- REQ-DK-03: Run as UID 1001 (non-root) [priority: must]
- REQ-DK-04: Create /data/receipts directory owned by UID 1001 for PVC mount [priority: must]
- REQ-DK-05: EXPOSE 3000, CMD ["node", "dist/index.js"] [priority: must]
- REQ-DK-06: Use npm ci for deterministic installs [priority: must]

### Extended
- REQ-DK-10: .dockerignore to exclude node_modules, .git, docs [priority: should]

## Acceptance Criteria

- `docker build .` succeeds
- Container starts and responds on port 3000
- Process runs as UID 1001 inside container

## Dependencies

- backend/server (TypeScript source must compile)
- frontend/components (public/ directory must exist)
