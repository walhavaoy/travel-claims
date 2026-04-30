---
component: claims-api
area: backend
priority: P0
status: planned
created: 2026-04-30
---

# Claims API

> REST endpoints for claim CRUD and role-filtered listing.

## Purpose

Implement the core claims REST API supporting create, read, update, delete, and status transitions with role-based access control.

## Requirements

### Core
- REQ-CL-01: GET /api/claims — role-filtered list: employee sees own claims, manager sees direct reports' claims, finance sees approved+paid claims [priority: must]
- REQ-CL-02: GET /api/claims/:id — single claim with line_items and history included [priority: must]
- REQ-CL-03: POST /api/claims — create draft claim with line items in a single transaction [priority: must]
- REQ-CL-04: PATCH /api/claims/:id — edit draft fields, or trigger status transitions (submit/approve/reject/mark-paid) [priority: must]
- REQ-CL-05: DELETE /api/claims/:id — delete drafts only, return 403 for non-draft claims [priority: must]
- REQ-CL-06: Status transitions use SELECT ... FOR UPDATE to prevent TOCTOU races [priority: must]
- REQ-CL-07: Valid transitions: draft→submitted (by submitter), submitted→approved (by manager), submitted→rejected (by manager), approved→paid (by finance) [priority: must]
- REQ-CL-08: Manager can only act on claims where submitter.manager_id == manager.id (direct reports only) [priority: must]
- REQ-CL-09: Each status transition creates a claim_history record with actor, from/to status, and optional comment [priority: must]
- REQ-CL-10: Validate trip_end_date >= trip_start_date on create/edit [priority: must]
- REQ-CL-11: total_amount computed as SUM of line_items.amount (not stored, or computed+stored) [priority: must]

### Extended
- REQ-CL-20: Pagination support for GET /api/claims [priority: could]

## Acceptance Criteria

- Alice can create a draft claim with 2 line items, then submit it
- Bob can list Alice's claims, approve one, reject another with comment
- Carol cannot see draft/submitted claims, only approved/paid
- Deleting a submitted claim returns 403
- Concurrent approval attempts do not create inconsistent state

## Dependencies

- backend/auth (user context on request)
- backend/status-machine (transition validation)
- data/schema (all tables)
