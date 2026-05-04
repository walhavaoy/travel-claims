---
component: dockerfile
area: infrastructure
priority: P1
status: planned
created: 2026-05-04
---

# Dockerfile

> Multi-stage container build for the travel-claims service.

## Purpose

Produce a minimal, secure container image that runs the compiled TypeScript application.

## Requirements

### Core
- REQ-IN-01: Multi-stage build: builder (npm ci, tsc) and runtime stages [priority: must]
- REQ-IN-02: Base image node:22-slim [priority: must]
- REQ-IN-03: Run as UID 1001 non-root user [priority: must]
- REQ-IN-04: Copy dist/, public/, package.json, package-lock.json to runtime [priority: must]
- REQ-IN-05: npm ci --omit=dev in runtime stage [priority: must]
- REQ-IN-06: Create /data/receipts directory owned by UID 1001 [priority: must]
- REQ-IN-07: EXPOSE 3000 [priority: must]

### Extended
- REQ-IN-10: .dockerignore excluding node_modules, src/, .git [priority: should]

## Acceptance Criteria

- Image builds successfully with `docker build`
- Container starts and responds on port 3000
- Process runs as non-root (uid 1001)

## Dependencies

- TypeScript source compiles without errors
