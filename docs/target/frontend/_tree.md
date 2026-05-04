---
area: frontend
status: planned
created: 2026-05-04
---

# Frontend Area

> Vanilla JS + HTML UI served from /public, no build step.

## Components

| Component | Priority | Description |
|-----------|----------|-------------|
| dashboard | P1 | Role-appropriate landing page showing claims list |
| claim-form | P1 | Create/edit claim form with dynamic line items |
| claim-detail | P1 | Claim view with receipts, history, and role actions |

## Key Decisions

- Vanilla JS with no framework, no build step
- Single index.html with client-side routing (hash or History API)
- data-testid attributes on all interactive elements (prefix: travelclaims-)
- Mobile-responsive with CSS Grid/Flexbox
- Color-coded status badges
- Fetch API for all backend calls
