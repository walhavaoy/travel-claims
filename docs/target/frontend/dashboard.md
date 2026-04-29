---
component: dashboard
area: frontend
priority: P1
status: planned
created: 2026-04-29
---

# Dashboard

> Role-appropriate claim listing served at /.

## Purpose

The main landing page showing claims relevant to the current user's role: employees see their own claims, managers see their team's submissions, finance sees all approved claims.

## Requirements

### Core
- REQ-FE-01: Employee dashboard shows own claims with status filters and "New Claim" button [priority: must]
- REQ-FE-02: Manager dashboard shows team submissions pending review [priority: must]
- REQ-FE-03: Finance dashboard shows approved claims with "Mark Paid" actions and CSV export button [priority: must]
- REQ-FE-04: Claims displayed as a table/list with status badge, destination, amount, date [priority: must]
- REQ-FE-05: Click a claim row to navigate to /claims/:id detail view [priority: must]

### Extended
- REQ-FE-10: Status filter tabs (all, draft, submitted, approved, rejected, paid) [priority: should]
- REQ-FE-11: Search/filter by destination or purpose [priority: could]

## Acceptance Criteria
- Alice sees only her own claims on the dashboard
- Bob sees Alice's claims (as her manager) on his dashboard
- Carol sees all approved/paid claims
- Clicking a claim navigates to detail view

## Dependencies
- backend/claims-api (GET /api/claims)
- backend/auth (role determines view)
- frontend/shared (status badges, layout)
