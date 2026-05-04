---
component: claims-api
area: backend
priority: P0
status: planned
created: 2026-05-04
---

# Claims API

> REST endpoints for claim CRUD and status transitions.

## Purpose

Core business logic: creating claims with line items, editing drafts, submitting for approval, and processing approvals/rejections/payments.

## Requirements

### Core
- REQ-CL-01: GET /api/claims — role-filtered list (employee=own, manager=direct reports, finance=all approved/paid) [priority: must]
- REQ-CL-02: GET /api/claims/:id — full claim detail with line items [priority: must]
- REQ-CL-03: POST /api/claims — create draft claim with line items in a transaction [priority: must]
- REQ-CL-04: PATCH /api/claims/:id — edit draft fields (destination, purpose, dates, line items) [priority: must]
- REQ-CL-05: PATCH /api/claims/:id with status transitions: draft->submitted, submitted->approved, submitted->rejected, approved->paid [priority: must]
- REQ-CL-06: DELETE /api/claims/:id — only drafts, only by submitter [priority: must]
- REQ-CL-07: Status transitions use SELECT ... FOR UPDATE to prevent TOCTOU races [priority: must]
- REQ-CL-08: Record every transition in claim_history with actor and comment [priority: must]
- REQ-CL-09: Manager can only approve/reject claims from direct reports (submitter.manager_id == actor.id) [priority: must]
- REQ-CL-10: Validate trip_end_date >= trip_start_date on create/edit [priority: must]

### Extended
- REQ-CL-20: Pagination on list endpoint (limit/offset) [priority: should]
- REQ-CL-21: Filter by status query parameter [priority: should]

## Acceptance Criteria

- Alice creates draft, edits it, submits it
- Bob sees Alice's claim (direct report), approves with comment
- Carol sees approved claim, marks as paid
- Concurrent approve attempts: one succeeds, other gets 409
- Invalid transition (e.g., draft->paid) returns 400

## Dependencies

- REQ-AU-01 through REQ-AU-06 (auth middleware)
- REQ-DA-02, REQ-DA-03, REQ-DA-05 (claims, line_items, claim_history tables)
