---
area: data
status: planned
created: 2026-04-29
---

# Data Area

> PostgreSQL schema, migrations, and seed data for the travel-claims application.

## Components

| Component | Description | Priority |
|-----------|-------------|----------|
| schema | DDL for all tables (users, claims, line_items, receipts, claim_history) with indexes and constraints | P0 |
| seeds | Stub users (Alice, Bob, Carol) with hardcoded UUIDs, roles, and department assignments | P0 |

## Key Decisions

- Use `DATABASE_URL` env var pointing to `postgres.tmpclaw.svc.cluster.local/travel_claims`
- UUIDs for all primary keys (gen_random_uuid())
- NUMERIC(12,2) for monetary amounts
- `FOR UPDATE` row locks on status transitions to prevent TOCTOU races
- Timestamps with time zone (timestamptz)
