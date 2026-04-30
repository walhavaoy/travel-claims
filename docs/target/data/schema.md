---
component: schema
area: data
priority: P0
status: planned
created: 2026-04-30
---

# Database Schema

> PostgreSQL tables, constraints, and indexes for the travel-claims domain.

## Purpose

Define the complete relational schema for travel claims management including users, claims, line items, receipts, and audit history. The schema runs on a dedicated `travel_claims` database provisioned by the tmpclaw operator via `spec.database`.

## Requirements

### Core
- REQ-DA-01: users table with id (UUID PK), name, role (employee/manager/finance), department, manager_id (self-referencing FK) [priority: must]
- REQ-DA-02: claims table with id (UUID PK), submitter_id (FK users), trip_start_date (DATE NOT NULL), trip_end_date (DATE NOT NULL), destination (TEXT NOT NULL), purpose (TEXT NOT NULL), status (TEXT NOT NULL DEFAULT 'draft'), created_at, updated_at [priority: must]
- REQ-DA-03: line_items table with id (UUID PK), claim_id (FK claims ON DELETE CASCADE), description, amount (NUMERIC(12,2)), currency (TEXT DEFAULT 'USD') [priority: must]
- REQ-DA-04: receipts table with id (UUID PK), line_item_id (FK line_items ON DELETE CASCADE), filename, content_type, size (INTEGER), path (TEXT) [priority: must]
- REQ-DA-05: claim_history table with id (UUID PK), claim_id (FK claims ON DELETE CASCADE), from_status, to_status, actor_id (FK users), comment, created_at [priority: must]
- REQ-DA-06: CHECK constraint on claims.status IN ('draft','submitted','approved','rejected','paid') [priority: must]
- REQ-DA-07: CHECK constraint: trip_end_date >= trip_start_date [priority: must]
- REQ-DA-08: Indexes on all foreign keys (submitter_id, claim_id, line_item_id, actor_id) and claims.status [priority: must]
- REQ-DA-09: Seed three stub users: Alice (employee, engineering, manager=Bob), Bob (manager, engineering, no manager), Carol (finance, finance, no manager) [priority: must]

### Extended
- REQ-DA-10: Use gen_random_uuid() for default PK values [priority: should]
- REQ-DA-11: updated_at auto-updates via trigger or application logic [priority: should]

## Acceptance Criteria

- All five tables exist after migration with correct columns and types
- Foreign key constraints prevent orphaned records
- Status CHECK constraint rejects invalid values
- Stub users queryable after seed

## Dependencies

- PostgreSQL database provisioned via ClawRealm spec.database (name=travel_claims)
- migrations component runs this schema on startup
