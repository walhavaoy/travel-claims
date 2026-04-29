---
component: components
area: frontend
priority: P1
status: planned
created: 2026-04-29
---

# Shared UI Components

> Reusable styles, badges, buttons, layout, and navigation for the vanilla JS frontend.

## Purpose

Provide the foundational CSS styles, HTML structure (index.html shell), and shared JS utilities used by all pages. Establish the visual identity and ensure mobile-responsive design.

## Requirements

### Core
- REQ-UI-01: index.html shell with navigation, viewport meta, CSS variables [priority: must]
- REQ-UI-02: Color-coded status badges: draft=gray, submitted=yellow, approved=green, rejected=red, paid=blue [priority: must]
- REQ-UI-03: Consistent button styles (primary, secondary, danger variants) [priority: must]
- REQ-UI-04: Mobile-responsive layout (works on 320px+ screens) [priority: must]
- REQ-UI-05: Client-side router to handle /, /claims/new, /claims/:id without page reloads [priority: must]
- REQ-UI-06: data-testid prefix: travelclaims- on all interactive elements [priority: must]
- REQ-UI-07: Fetch wrapper that includes X-Forwarded-User header or reads /api/me for current user context [priority: must]

### Extended
- REQ-UI-10: Dark/light theme support via CSS custom properties [priority: could]

## Acceptance Criteria

- index.html loads and renders navigation
- Status badges render with correct colors for each status
- Layout adapts to mobile viewport (no horizontal scroll at 375px)
- Navigation between pages works without full page reload

## Dependencies

- None (foundation component)
