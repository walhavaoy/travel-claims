---
area: frontend
status: planned
created: 2026-04-29
---

# Frontend

> Vanilla JS + HTML frontend served from /public. No build step required.

## Components

| Component | Priority | Description |
|-----------|----------|-------------|
| dashboard | P1 | Role-appropriate claim listing at / |
| claim-form | P1 | Create/edit claim at /claims/new |
| claim-detail | P1 | Claim detail at /claims/:id with actions |
| shared | P2 | Status badges, layout, responsive CSS |

## Design Decisions
- Single-page app with client-side routing (hash or pushState)
- No build step — plain JS files in /public
- All interactive elements have data-testid with `travelclaims-` prefix
- Mobile-responsive layout
- Color-coded status badges (draft=gray, submitted=blue, approved=green, rejected=red, paid=purple)
- Fetch API for all backend calls
