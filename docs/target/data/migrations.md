---
component: migrations
area: data
priority: P0
status: planned
created: 2026-04-29
---

# Database Migrations

> Idempotent schema migration runner that executes on server startup.

## Purpose

Apply database schema changes automatically when the server starts. Uses a simple version-tracking approach — no heavy migration framework needed for a greenfield project.

## Requirements

### Core
- REQ-MG-01: Run migrations automatically on server startup before accepting requests [priority: must]
- REQ-MG-02: Track applied migrations in a `schema_migrations` table (version integer, applied_at timestamp) [priority: must]
- REQ-MG-03: Migrations are idempotent — safe to run multiple times [priority: must]
- REQ-MG-04: Migration 001 creates all five domain tables (users, claims, line_items, receipts, claim_history) [priority: must]
- REQ-MG-05: Migration 002 seeds stub users [priority: must]
- REQ-MG-06: Each migration runs inside a transaction [priority: must]

### Extended
- REQ-MG-10: Log migration status via pino (applied, skipped, failed) [priority: should]

## Acceptance Criteria
- Fresh database gets all tables and seed data on first startup
- Restarting the server does not re-apply already-applied migrations
- Failed migration rolls back its transaction and prevents server startup

## Dependencies
- data/schema (migration 001 content)
- data/seed (migration 002 content)
