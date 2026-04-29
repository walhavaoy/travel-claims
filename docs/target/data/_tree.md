---
area: data
status: planned
created: 2026-04-29
---

# Data Layer

> PostgreSQL schema, migrations, and seed data for the travel-claims service.

## Components

| Component | Priority | Description |
|-----------|----------|-------------|
| schema | P0 | Table definitions, indexes, constraints, enums |
| migrations | P0 | Schema migration runner (run on startup) |
| seed | P0 | Stub user data (Alice/Bob/Carol) |

## Design Decisions
- Use `pg` driver directly (no ORM) for simplicity and explicit SQL
- Migrations run automatically on server startup (idempotent via version table)
- FOR UPDATE row locks on status transitions to prevent TOCTOU races
- UUID primary keys (gen_random_uuid())
- All timestamps as TIMESTAMPTZ
- Amounts stored as NUMERIC(12,2)
