---
component: claim-form
area: frontend
priority: P1
status: planned
created: 2026-04-29
---

# Claim Form

> Create and edit claim form with dynamic line items.

## Purpose

Form at /claims/new allowing employees to create new expense claims with trip details and multiple line items. Also supports editing draft claims.

## Requirements

### Core
- REQ-CF-01: Form fields: trip dates (start/end), destination, purpose [priority: must]
- REQ-CF-02: Dynamic line items section: add/remove line items with description, amount, currency fields [priority: must]
- REQ-CF-03: Client-side validation: required fields, positive amounts [priority: must]
- REQ-CF-04: Submit creates draft claim via POST /api/claims [priority: must]
- REQ-CF-05: After creation, navigate to claim detail view [priority: must]
- REQ-CF-06: All interactive elements have data-testid="travelclaims-..." attributes [priority: must]

### Extended
- REQ-CF-10: Edit mode for draft claims (pre-populate form, PATCH on save) [priority: should]

## Acceptance Criteria

- Employee can fill form, add 2 line items, submit to create draft
- Validation prevents empty required fields
- After submit, user sees the new claim detail

## Dependencies

- frontend/components (form inputs, buttons)
- backend/claims-api (POST /api/claims)
