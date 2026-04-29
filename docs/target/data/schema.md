---
component: schema
area: data
priority: P0
status: planned
created: 2026-04-29
---

# Database Schema

> PostgreSQL tables, constraints, indexes, and enums for the travel-claims service.

## Purpose

Define the relational schema for claims, line items, receipts, users, and audit history. All tables live in the `travel_claims` database on the shared platform PostgreSQL instance.

## Requirements

### Core
- REQ-DB-01: Create `users` table with id (UUID PK), name, role (enum: employee/manager/finance), department, manager_id (self-referencing FK) [priority: must]
- REQ-DB-02: Create `claims` table with id (UUID PK), submitter_id (FK users), trip_dates (text), destination, purpose, status (enum: draft/submitted/approved/rejected/paid), created_at, updated_at [priority: must]
- REQ-DB-03: Create `line_items` table with id (UUID PK), claim_id (FK claims ON DELETE CASCADE), description, amount (NUMERIC 12,2), currency [priority: must]
- REQ-DB-04: Create `receipts` table with id (UUID PK), line_item_id (FK line_items ON DELETE CASCADE), filename, content_type, size (integer), path [priority: must]
- REQ-DB-05: Create `claim_history` table with id (UUID PK), claim_id (FK claims ON DELETE CASCADE), from_status, to_status, actor_id (FK users), comment (text), created_at [priority: must]
- REQ-DB-06: Add indexes on claims.submitter_id, claims.status, line_items.claim_id, receipts.line_item_id, claim_history.claim_id [priority: must]
- REQ-DB-07: Use gen_random_uuid() for all UUID defaults [priority: must]
- REQ-DB-08: All timestamps default to NOW() and use TIMESTAMPTZ [priority: must]

### Extended
- REQ-DB-10: Add CHECK constraint on line_items.amount >= 0 [priority: should]
- REQ-DB-11: Add CHECK constraint on receipts.size > 0 [priority: should]

## Acceptance Criteria
- All five tables created with correct columns, types, and constraints
- Foreign keys enforce referential integrity
- Indexes exist on all FK columns and status
- UUID generation works without external extension (PG 13+)

## Dependencies
- PostgreSQL instance at postgres.tmpclaw.svc.cluster.local
- Database `travel_claims` must be created (migration handles tables)
