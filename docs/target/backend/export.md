---
component: export
area: backend
priority: P0
status: planned
created: 2026-04-30
---

# CSV Export

> Finance-only CSV export of approved and paid claims.

## Purpose

Provide a CSV download endpoint for finance users to export claim data for accounting systems.

## Requirements

### Core
- REQ-EX-01: GET /api/claims/export/csv — returns CSV file download [priority: must]
- REQ-EX-02: Finance role only — return 403 for non-finance users [priority: must]
- REQ-EX-03: Include approved and paid claims with all relevant fields [priority: must]
- REQ-EX-04: Set Content-Type: text/csv and Content-Disposition: attachment [priority: must]
- REQ-EX-05: Include claim fields: id, submitter name, destination, purpose, trip dates, status, total amount, currency [priority: must]

### Extended
- REQ-EX-10: Optional date range filter query params [priority: could]

## Acceptance Criteria

- Finance Carol can download CSV with approved/paid claims
- Employee Alice gets 403 on the export endpoint
- CSV has proper headers and escaped values

## Dependencies

- backend/auth (role check)
- data/schema (claims + users join)
