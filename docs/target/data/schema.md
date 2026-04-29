---
component: schema
area: data
priority: P0
status: planned
created: 2026-04-29
---

# Database Schema

> PostgreSQL DDL defining all tables, constraints, indexes, and enums for travel-claims.

## Purpose

Define the complete data model for the travel claims system: users, claims, line items, receipts, and audit history. The schema enforces referential integrity, proper status transitions, and provides indexes for all query patterns.

## Requirements

### Core
- REQ-DB-01: Create `users` table with columns: id (UUID PK), name (VARCHAR), role (VARCHAR, one of employee/manager/finance), department (VARCHAR), manager_id (UUID FK self-ref, nullable) [priority: must]
- REQ-DB-02: Create `claims` table with columns: id (UUID PK), submitter_id (UUID FK users), trip_dates (VARCHAR), destination (VARCHAR), purpose (TEXT), status (VARCHAR default 'draft'), created_at (timestamptz), updated_at (timestamptz) [priority: must]
- REQ-DB-03: Create `line_items` table with columns: id (UUID PK), claim_id (UUID FK claims ON DELETE CASCADE), description (TEXT), amount (NUMERIC(12,2)), currency (VARCHAR default 'USD') [priority: must]
- REQ-DB-04: Create `receipts` table with columns: id (UUID PK), line_item_id (UUID FK line_items ON DELETE CASCADE), filename (VARCHAR), content_type (VARCHAR), size (INTEGER), path (VARCHAR) [priority: must]
- REQ-DB-05: Create `claim_history` table with columns: id (UUID PK), claim_id (UUID FK claims ON DELETE CASCADE), from_status (VARCHAR), to_status (VARCHAR), actor_id (UUID FK users), comment (TEXT), created_at (timestamptz) [priority: must]
- REQ-DB-06: Add indexes on all foreign key columns and claims.status [priority: must]
- REQ-DB-07: Use gen_random_uuid() as default for all UUID primary keys [priority: must]

### Extended
- REQ-DB-10: Add CHECK constraint on claims.status to enforce valid values (draft, submitted, approved, rejected, paid) [priority: should]

## Acceptance Criteria

- All five tables created successfully via migration script
- Foreign key constraints enforced (insert with invalid FK fails)
- Indexes exist on submitter_id, claim_id, line_item_id, actor_id, status

## Dependencies

- PostgreSQL 15+ with pgcrypto or gen_random_uuid() support
- DATABASE_URL environment variable
