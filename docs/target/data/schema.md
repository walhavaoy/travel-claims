---
component: schema
area: data
priority: P0
status: planned
created: 2026-05-04
---

# Database Schema

> PostgreSQL table definitions for the travel-claims domain.

## Purpose

Define the relational data model for users, claims, line items, receipts, and audit history.

## Requirements

### Core
- REQ-DA-01: users table with id (UUID PK), name, role (enum: employee/manager/finance), department, manager_id (self-FK) [priority: must]
- REQ-DA-02: claims table with id (UUID PK), submitter_id (FK users), trip_start_date (DATE NOT NULL), trip_end_date (DATE NOT NULL), destination, purpose, status (enum: draft/submitted/approved/rejected/paid), created_at, updated_at [priority: must]
- REQ-DA-03: line_items table with id (UUID PK), claim_id (FK claims), description, amount (NUMERIC(12,2)), currency (VARCHAR default 'USD') [priority: must]
- REQ-DA-04: receipts table with id (UUID PK), line_item_id (FK line_items), filename, content_type, size (INTEGER), path (TEXT) [priority: must]
- REQ-DA-05: claim_history table with id (UUID PK), claim_id (FK claims), from_status, to_status, actor_id (FK users), comment (TEXT), created_at [priority: must]
- REQ-DA-06: Indexes on all foreign keys and status columns [priority: must]

### Extended
- REQ-DA-10: CHECK constraint trip_end_date >= trip_start_date [priority: should]

## Acceptance Criteria

- All five tables exist after migration
- Foreign key constraints enforced
- Status column uses CHECK constraint for valid values
- UUID generation via gen_random_uuid()

## Dependencies

- Platform-provisioned PostgreSQL database (DATABASE_URL env var)
