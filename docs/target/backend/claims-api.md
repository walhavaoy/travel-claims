---
component: claims-api
area: backend
priority: P0
status: planned
created: 2026-04-29
---

# Claims API

> CRUD operations and status transitions for travel expense claims.

## Purpose

Implement the core claims REST API with role-filtered listing, creation with line items, and status transitions with audit history. All status transitions use FOR UPDATE row locks to prevent TOCTOU races.

## Requirements

### Core
- REQ-CL-01: GET /api/claims returns role-filtered list: employee=own claims, manager=team claims (where submitter.manager_id = current user), finance=all claims with status approved or paid [priority: must]
- REQ-CL-02: GET /api/claims/:id returns claim with line_items and claim_history, subject to role-based visibility [priority: must]
- REQ-CL-03: POST /api/claims creates a draft claim with trip_dates, destination, purpose, and nested line_items array [priority: must]
- REQ-CL-04: PATCH /api/claims/:id with action=submit transitions draft -> submitted (employee only, own claim) [priority: must]
- REQ-CL-05: PATCH /api/claims/:id with action=approve transitions submitted -> approved (manager only, team claim) [priority: must]
- REQ-CL-06: PATCH /api/claims/:id with action=reject transitions submitted -> rejected (manager only, team claim) with required comment [priority: must]
- REQ-CL-07: PATCH /api/claims/:id with action=mark-paid transitions approved -> paid (finance only) [priority: must]
- REQ-CL-08: PATCH /api/claims/:id with action=edit allows updating draft claim fields (employee only, own claim) [priority: must]
- REQ-CL-09: DELETE /api/claims/:id deletes draft claims only (employee only, own claim) [priority: must]
- REQ-CL-10: All status transitions use SELECT ... FOR UPDATE to lock the row before checking current status [priority: must]
- REQ-CL-11: Every status transition inserts a row into claim_history with from_status, to_status, actor_id, optional comment [priority: must]
- REQ-CL-12: Status transitions and history insert happen in a single database transaction [priority: must]

### Extended
- REQ-CL-20: Return 409 Conflict if status transition is invalid (e.g., approve a draft) [priority: should]
- REQ-CL-21: Return 403 Forbidden if user lacks role for the action [priority: should]
- REQ-CL-22: Include submitter name and line item count in list response [priority: should]

## Status Flow

```
draft --> submitted --> approved --> paid
                   \-> rejected
```

Valid transitions:
- draft -> submitted (employee submits own claim)
- submitted -> approved (manager approves team claim)
- submitted -> rejected (manager rejects team claim with comment)
- approved -> paid (finance marks as paid)

## Acceptance Criteria
- Alice can create a draft, add line items, and submit
- Bob can list Alice's claims (as her manager), approve one, reject another with comment
- Carol can list approved claims and mark as paid
- Claim history shows all transitions with actor and timestamps
- Concurrent status transition attempts are serialized (no double-approve)

## Dependencies
- data/schema (claims, line_items, claim_history tables)
- backend/auth (user context and role guards)
