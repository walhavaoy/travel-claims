---
component: migrations
area: data
priority: P0
status: planned
created: 2026-04-30
---

# Migrations

> Startup schema migration runner for the travel_claims database.

## Purpose

Run SQL migrations on application startup to ensure the database schema is current. Migrations are idempotent and tracked in a `schema_migrations` table to avoid re-running.

## Requirements

### Core
- REQ-MG-01: Migration runner executes on startup before Express starts listening [priority: must]
- REQ-MG-02: Track applied migrations in a `schema_migrations` table [priority: must]
- REQ-MG-03: Migrations are plain .sql files in src/migrations/ numbered sequentially (001_initial.sql, etc.) [priority: must]
- REQ-MG-04: Must NOT call CREATE DATABASE — assume database exists via platform provisioning [priority: must]
- REQ-MG-05: Run each migration in a transaction [priority: must]
- REQ-MG-06: Log migration status via pino (applied, skipped, error) [priority: must]

### Extended
- REQ-MG-10: Support both up migrations for MVP (down migrations not required) [priority: should]

## Acceptance Criteria

- Fresh database gets all tables created on first startup
- Second startup skips already-applied migrations
- Migration failure prevents server from starting (fail-fast)

## Dependencies

- data/schema (provides the SQL content)
- backend/server (calls migrate before listen)
