---
area: data
status: planned
created: 2026-05-04
---

# Data Area

> PostgreSQL schema, migrations, and seed data for travel-claims.

## Components

| Component | Priority | Description |
|-----------|----------|-------------|
| schema | P0 | Table definitions for users, claims, line_items, receipts, claim_history |
| migrations | P0 | Startup migration runner (CREATE TABLE IF NOT EXISTS) |
| seed | P0 | Stub users: Alice (employee), Bob (manager), Carol (finance) |

## Key Decisions

- PostgreSQL accessed via `pg` Pool with DATABASE_URL from platform secret
- No ORM — raw SQL with parameterized queries
- Migrations run on app startup (idempotent CREATE TABLE IF NOT EXISTS)
- App does NOT create the database itself (platform-provisioned)
- FOR UPDATE row locks on status transition queries
