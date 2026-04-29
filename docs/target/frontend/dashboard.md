---
component: dashboard
area: frontend
priority: P1
status: planned
created: 2026-04-29
---

# Dashboard

> Role-appropriate landing page showing relevant claims list.

## Purpose

The root page (/) that displays different views based on the logged-in user's role: employees see their own claims, managers see their team's submitted claims, and finance staff see all approved claims ready for payment.

## Requirements

### Core
- REQ-FE-01: Employee dashboard shows own claims with status filter tabs [priority: must]
- REQ-FE-02: Manager dashboard shows team claims (direct reports) defaulting to submitted filter [priority: must]
- REQ-FE-03: Finance dashboard shows approved claims with mark-paid action available [priority: must]
- REQ-FE-04: Summary cards showing counts by status and total amounts [priority: must]
- REQ-FE-05: Claims table with columns: title/destination, status badge, amount, date [priority: must]
- REQ-FE-06: Click on a claim row navigates to claim detail view [priority: must]

### Extended
- REQ-FE-10: Search/filter by text across claim fields [priority: should]
- REQ-FE-11: Sortable table columns [priority: should]

## Acceptance Criteria

- Alice sees only her own claims on /
- Bob sees his direct reports' claims on /
- Carol sees all approved/paid claims on /
- Status filter tabs update the displayed list

## Dependencies

- frontend/components (badges, buttons, layout)
- backend/claims-api (GET /api/claims)
