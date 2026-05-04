---
component: export
area: backend
priority: P1
status: planned
created: 2026-05-04
---

# CSV Export

> Finance-only CSV export of approved/paid claims.

## Purpose

Allow finance staff to export claim data for external accounting systems.

## Requirements

### Core
- REQ-EX-01: GET /api/claims/export/csv — returns CSV file [priority: must]
- REQ-EX-02: Only accessible by finance role [priority: must]
- REQ-EX-03: Include claim fields: id, submitter name, destination, purpose, dates, total amount, status, paid_at [priority: must]
- REQ-EX-04: Set Content-Type: text/csv and Content-Disposition: attachment header [priority: must]

### Extended
- REQ-EX-10: Date range filter query params (from, to) [priority: should]

## Acceptance Criteria

- Carol (finance) downloads CSV with correct headers
- Bob (manager) gets 403 on export endpoint
- CSV contains all approved and paid claims

## Dependencies

- REQ-AU-06 (role guard)
- REQ-CL-01 (claims query logic)
