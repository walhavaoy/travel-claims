---
component: status-machine
area: backend
priority: P0
status: planned
created: 2026-04-30
---

# Status Machine

> Claim status transition logic with authorization and locking.

## Purpose

Encapsulate the claim lifecycle state machine: which transitions are valid, who can perform them, and enforce these rules within a PostgreSQL transaction using FOR UPDATE row locks.

## Requirements

### Core
- REQ-SM-01: Define valid transitions: draft→submitted, submitted→approved, submitted→rejected, approved→paid [priority: must]
- REQ-SM-02: draft→submitted: only the claim submitter can submit [priority: must]
- REQ-SM-03: submitted→approved/rejected: only a manager where submitter.manager_id == manager.id [priority: must]
- REQ-SM-04: approved→paid: only a finance-role user [priority: must]
- REQ-SM-05: Use SELECT ... FOR UPDATE within a transaction before checking/updating status [priority: must]
- REQ-SM-06: Return clear error messages for invalid transitions (wrong role, wrong status, not authorized) [priority: must]
- REQ-SM-07: Record transition in claim_history with actor_id, from_status, to_status, comment [priority: must]

## Acceptance Criteria

- Attempting submitted→paid returns error (invalid transition)
- Non-manager attempting approval returns 403
- Two concurrent approve requests: one succeeds, one gets conflict or stale-state error
- All transitions recorded in claim_history

## Dependencies

- data/schema (claims and claim_history tables)
