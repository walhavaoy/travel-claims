---
component: claim-form
area: frontend
priority: P1
status: planned
created: 2026-04-29
---

# Claim Form

> Create and edit travel expense claims at /claims/new.

## Purpose

Form for employees to create new draft claims with trip details and dynamic line items.

## Requirements

### Core
- REQ-CF-01: Form fields: trip_dates (date range), destination (text), purpose (text) [priority: must]
- REQ-CF-02: Dynamic line items section: add/remove rows with description, amount, currency fields [priority: must]
- REQ-CF-03: Submit creates a draft claim via POST /api/claims [priority: must]
- REQ-CF-04: Client-side validation: required fields, positive amounts [priority: must]
- REQ-CF-05: After successful creation, navigate to the claim detail page [priority: must]
- REQ-CF-06: All interactive elements have data-testid with travelclaims- prefix [priority: must]

### Extended
- REQ-CF-10: Pre-fill currency from previous claims or default USD [priority: could]

## Acceptance Criteria
- Employee can fill out form, add 2 line items, submit to create a draft
- Validation prevents submission without required fields
- After creation, user sees the new claim's detail page

## Dependencies
- backend/claims-api (POST /api/claims)
- frontend/shared (layout, form styles)
