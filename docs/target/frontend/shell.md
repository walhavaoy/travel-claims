---
component: shell
area: frontend
priority: P1
status: planned
created: 2026-04-30
---

# Frontend Shell

> HTML shell, client-side router, and shared styles.

## Purpose

Provide the main HTML page, CSS styles, and a lightweight client-side router for the SPA. All frontend is vanilla JS with no build step.

## Requirements

### Core
- REQ-SH-01: index.html with base structure, nav, content area [priority: must]
- REQ-SH-02: Client-side router handling /, /claims/new, /claims/:id [priority: must]
- REQ-SH-03: History API navigation (pushState), server fallback serves index.html [priority: must]
- REQ-SH-04: Fetch current user identity from /api/me or similar endpoint [priority: must]
- REQ-SH-05: Color-coded status badges (draft=gray, submitted=yellow, approved=green, rejected=red, paid=blue) [priority: must]
- REQ-SH-06: Mobile-responsive layout [priority: must]
- REQ-SH-07: data-testid attributes on all interactive elements with travelclaims- prefix [priority: must]

### Extended
- REQ-SH-10: Navigation highlighting for current route [priority: should]

## Acceptance Criteria

- Page loads at / and shows appropriate dashboard
- Clicking a claim navigates to /claims/:id without full reload
- Back button works correctly
- Layout adapts to mobile viewport

## Dependencies

- backend/server (serves index.html for SPA routes)
- backend/auth (provides user identity)
