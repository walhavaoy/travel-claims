---
component: docker
area: infrastructure
priority: P0
status: planned
created: 2026-04-30
---

# Dockerfile

> Multi-stage Docker build for the travel-claims service.

## Purpose

Build a production container image with TypeScript compiled to JavaScript, production dependencies only, running as non-root UID 1001.

## Requirements

### Core
- REQ-DK-01: Multi-stage build: builder stage compiles TypeScript, final stage copies dist/ [priority: must]
- REQ-DK-02: Base image: node:22-slim [priority: must]
- REQ-DK-03: Run as UID 1001 (non-root) [priority: must]
- REQ-DK-04: Copy public/ directory for static frontend files [priority: must]
- REQ-DK-05: Create /data/receipts directory owned by UID 1001 [priority: must]
- REQ-DK-06: EXPOSE 3000 [priority: must]
- REQ-DK-07: CMD ["node", "dist/index.js"] [priority: must]
- REQ-DK-08: npm ci --omit=dev in production stage [priority: must]

## Acceptance Criteria

- Image builds successfully
- Container starts and responds to /healthz on port 3000
- Container runs as non-root user

## Dependencies

- backend/server (compiled output in dist/)
- frontend/shell (public/ directory)
