---
component: migrations
area: data
priority: P0
status: planned
created: 2026-05-04
---

# Migrations

> Idempotent schema migration runner executed on app startup.

## Purpose

Ensure database schema is current each time the app starts, without external tooling.

## Requirements

### Core
- REQ-DM-01: Run migrations on startup before accepting HTTP requests [priority: must]
- REQ-DM-02: Use CREATE TABLE IF NOT EXISTS for idempotency [priority: must]
- REQ-DM-03: Execute migrations within a transaction [priority: must]
- REQ-DM-04: Log migration progress via pino [priority: must]
- REQ-DM-05: Abort startup (exit 1) if migration fails [priority: must]

### Extended
- REQ-DM-10: Track applied migrations in a schema_migrations table [priority: should]

## Acceptance Criteria

- App starts cleanly against an empty database
- App starts cleanly against an already-migrated database (idempotent)
- Migration failure prevents the HTTP server from starting

## Dependencies

- REQ-DA-01 through REQ-DA-06 (schema definitions)
- DATABASE_URL environment variable
