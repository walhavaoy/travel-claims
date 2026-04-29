---
component: export-api
area: backend
priority: P1
status: planned
created: 2026-04-29
---

# CSV Export API

> Finance-only CSV export of approved and paid claims.

## Purpose

Allow finance users to export claim data as CSV for downstream processing and reporting.

## Requirements

### Core
- REQ-EX-01: GET /api/claims/export/csv returns CSV with Content-Type: text/csv and Content-Disposition: attachment header [priority: must]
- REQ-EX-02: Only accessible by finance role (return 403 for others) [priority: must]
- REQ-EX-03: Include columns: claim_id, submitter, destination, purpose, trip_dates, status, total_amount, currency, submitted_at, approved_at, paid_at [priority: must]
- REQ-EX-04: Include line item detail rows or flatten into claim-level totals [priority: must]

### Extended
- REQ-EX-10: Support date range query params (?from=&to=) [priority: could]

## Acceptance Criteria
- Carol (finance) hits /api/claims/export/csv and receives a valid CSV file
- CSV contains approved and paid claims with correct data
- Non-finance users get 403

## Dependencies
- backend/auth (finance role guard)
- backend/claims-api (claim data queries)
