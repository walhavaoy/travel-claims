---
component: config
area: infrastructure
priority: P0
status: planned
created: 2026-04-29
---

# Configuration

> Environment variables and runtime configuration for the travel-claims service.

## Purpose

Centralize all configuration in environment variables following 12-factor app principles.

## Requirements

### Core
- REQ-CF-01: PORT — HTTP listen port, default 3000 [priority: must]
- REQ-CF-02: DATABASE_URL — PostgreSQL connection string (e.g., postgresql://user:pass@host:5432/travel_claims) [priority: must]
- REQ-CF-03: TRUST_FORWARD_AUTH — boolean, enables X-Forwarded-User header auth [priority: must]
- REQ-CF-04: UPLOAD_DIR — receipt storage path, default /data/receipts [priority: must]
- REQ-CF-05: LOG_LEVEL — pino log level, default info [priority: must]
- REQ-CF-06: Validate required env vars on startup, fail fast with clear error if missing [priority: must]

### Extended
- REQ-CF-10: NODE_ENV for production/development mode [priority: should]

## Acceptance Criteria
- Server starts with all required env vars set
- Server fails with clear error if DATABASE_URL is missing
- Default values work for optional vars (PORT, UPLOAD_DIR, LOG_LEVEL)

## Dependencies
- None (foundational)
