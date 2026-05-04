---
component: dashboard
area: frontend
priority: P1
status: planned
created: 2026-05-04
---

# Dashboard

> Role-appropriate landing page at /.

## Purpose

Show the relevant claim list based on the logged-in user's role.

## Requirements

### Core
- REQ-FE-01: Employee sees own claims with status, dates, amounts [priority: must]
- REQ-FE-02: Manager sees team claims pending review [priority: must]
- REQ-FE-03: Finance sees approved claims ready for payment [priority: must]
- REQ-FE-04: Color-coded status badges (draft=gray, submitted=blue, approved=green, rejected=red, paid=purple) [priority: must]
- REQ-FE-05: "New Claim" button for employees [priority: must]
- REQ-FE-06: data-testid="travelclaims-claims-list" on the list container [priority: must]

### Extended
- REQ-FE-10: Sort by created_at descending [priority: should]
- REQ-FE-11: Mobile-responsive table/card layout [priority: should]

## Acceptance Criteria

- Dashboard loads and shows claims within 2s
- Correct claims visible per role
- Status badges have correct colors

## Dependencies

- REQ-CL-01 (GET /api/claims endpoint)
- REQ-AU-01 (user identity available)
