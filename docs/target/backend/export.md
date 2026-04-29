---
component: export
area: backend
priority: P1
status: planned
created: 2026-04-29
---

# CSV Export

> Finance-only endpoint to export claims data as CSV.

## Purpose

Provide a downloadable CSV file of approved and paid claims for finance staff to import into accounting systems.

## Requirements

### Core
- REQ-EX-01: GET /api/claims/export/csv - returns CSV with Content-Type text/csv and Content-Disposition attachment header [priority: must]
- REQ-EX-02: Only accessible by users with role=finance [priority: must]
- REQ-EX-03: Include columns: claim_id, submitter_name, destination, purpose, trip_dates, status, total_amount, currency, approved_at, paid_at [priority: must]

### Extended
- REQ-EX-10: Filter by date range query params (from, to) [priority: should]
- REQ-EX-11: Include line item breakdown as nested rows [priority: could]

## Acceptance Criteria

- Finance Carol can download CSV of approved claims
- Non-finance users get 403
- CSV file opens correctly in Excel/Google Sheets

## Dependencies

- backend/auth (role check)
- backend/claims-api (claims data)
