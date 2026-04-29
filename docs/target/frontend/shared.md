---
component: shared
area: frontend
priority: P2
status: planned
created: 2026-04-29
---

# Shared Frontend Components

> Common UI elements: status badges, layout, responsive CSS, data-testid conventions.

## Purpose

Reusable UI building blocks shared across dashboard, form, and detail views.

## Requirements

### Core
- REQ-SH-01: Color-coded status badges: draft=gray, submitted=blue, approved=green, rejected=red, paid=purple [priority: must]
- REQ-SH-02: Mobile-responsive layout that works on tablet and phone screens [priority: must]
- REQ-SH-03: data-testid prefix: travelclaims- on all interactive elements [priority: must]
- REQ-SH-04: Navigation between views (dashboard, form, detail) [priority: must]

### Extended
- REQ-SH-10: Loading spinners/skeleton states during API calls [priority: should]
- REQ-SH-11: Error message display component [priority: should]
- REQ-SH-12: Toast notifications for successful actions [priority: could]

## Acceptance Criteria
- Status badges render with correct colors for all 5 statuses
- Layout is usable on a 375px-wide mobile screen
- All buttons, inputs, links have data-testid attributes

## Dependencies
- None (foundational)
