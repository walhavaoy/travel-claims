---
component: dashboard
area: frontend
priority: P1
status: planned
created: 2026-04-30
---

# Dashboard

> Role-based landing page showing claims relevant to the current user.

## Purpose

Display a filtered list of claims appropriate for the user's role. Employees see their own claims, managers see their team's submissions, and finance sees approved claims.

## Requirements

### Core
- REQ-DB-01: Employee dashboard: list own claims with status, amount, dates [priority: must]
- REQ-DB-02: Manager dashboard: list team (direct reports) claims pending review [priority: must]
- REQ-DB-03: Finance dashboard: list approved claims ready for payment [priority: must]
- REQ-DB-04: Summary statistics (total claims, by status, total amount) [priority: must]
- REQ-DB-05: Click-through to claim detail [priority: must]
- REQ-DB-06: Status filter tabs [priority: must]
- REQ-DB-07: "New Claim" button for employees [priority: must]

### Extended
- REQ-DB-10: Search/filter by text [priority: should]

## Acceptance Criteria

- Alice sees only her own claims
- Bob sees claims from his direct reports (Alice)
- Carol sees approved/paid claims from all users
- Clicking a claim row navigates to detail view

## Dependencies

- backend/claims-api (GET /api/claims with role filtering)
- frontend/shell (router, styles)
