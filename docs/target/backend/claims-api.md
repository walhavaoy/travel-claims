---
component: claims-api
area: backend
priority: P0
status: planned
created: 2026-04-29
---

# Claims API

> REST endpoints for claims CRUD and status transitions.

## Purpose

Implement the core business logic for creating, listing, viewing, updating, and deleting travel expense claims. Enforce the status state machine (draft -> submitted -> approved -> paid, with rejected branch) and role-based access control.

## Requirements

### Core
- REQ-CL-01: GET /api/claims - role-filtered list: employee sees own, manager sees team (direct reports), finance sees all approved+paid [priority: must]
- REQ-CL-02: GET /api/claims/:id - single claim with line_items and history included [priority: must]
- REQ-CL-03: POST /api/claims - create claim in draft status with line items, return full claim object [priority: must]
- REQ-CL-04: PATCH /api/claims/:id - support actions: submit (draft->submitted), approve (submitted->approved), reject (submitted->rejected), mark-paid (approved->paid), and field edits on draft claims [priority: must]
- REQ-CL-05: DELETE /api/claims/:id - only allowed for draft claims by the submitter [priority: must]
- REQ-CL-06: Status transitions must use SELECT ... FOR UPDATE within a transaction to prevent TOCTOU races [priority: must]
- REQ-CL-07: Every status transition creates a claim_history record with actor_id, from_status, to_status, and optional comment [priority: must]
- REQ-CL-08: Recalculate total_amount from line items on create/update [priority: must]
- REQ-CL-09: Only the submitter can submit (draft->submitted), only a manager can approve/reject, only finance can mark-paid [priority: must]

### Extended
- REQ-CL-10: Pagination support (limit/offset query params) on GET /api/claims [priority: should]
- REQ-CL-11: Manager can only approve/reject claims from their direct reports [priority: should]

## Acceptance Criteria

- Employee Alice can create a draft claim with 2 line items
- Alice can submit the draft (status changes to submitted, history recorded)
- Manager Bob can list Alice's claims, approve one with comment, reject another
- Finance Carol can list approved claims and mark one as paid
- Attempting to approve a draft claim returns 400
- Concurrent PATCH requests on same claim don't cause inconsistent state

## Dependencies

- backend/auth (req.user must be populated)
- data/schema (all tables must exist)
