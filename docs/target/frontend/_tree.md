---
area: frontend
status: planned
created: 2026-04-29
---

# Frontend Area

> Vanilla JS + HTML frontend served from /public. No build step, no framework.

## Components

| Component | Description | Priority |
|-----------|-------------|----------|
| dashboard | Role-appropriate landing page: employee sees own claims, manager sees team, finance sees approved | P1 |
| claim-form | Create/edit claim form with dynamic line items, trip dates, destination, purpose | P1 |
| claim-detail | Claim detail view with receipts, history timeline, role-appropriate action buttons | P1 |
| components | Shared UI: status badges, buttons, layout, navigation, mobile-responsive styles | P1 |

## Conventions

- All interactive elements use `data-testid="travelclaims-{element}-{name}"` attributes
- Color-coded status badges: draft=gray, submitted=yellow, approved=green, rejected=red, paid=blue
- Mobile-responsive layout
- Client-side routing via history API or hash-based navigation
