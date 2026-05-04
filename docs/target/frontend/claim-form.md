---
component: claim-form
area: frontend
priority: P1
status: planned
created: 2026-05-04
---

# Claim Form

> Create and edit claims at /claims/new and /claims/:id/edit.

## Purpose

Form for employees to create new claims with trip details and dynamic line items.

## Requirements

### Core
- REQ-FF-01: Trip start date and end date (DATE inputs) [priority: must]
- REQ-FF-02: Destination and purpose text fields [priority: must]
- REQ-FF-03: Dynamic line items: add/remove rows with description and amount [priority: must]
- REQ-FF-04: Client-side validation: end_date >= start_date, at least one line item, amount > 0 [priority: must]
- REQ-FF-05: Submit creates draft via POST /api/claims [priority: must]
- REQ-FF-06: data-testid="travelclaims-button-submit" on submit button [priority: must]

### Extended
- REQ-FF-10: Auto-save draft on field change (debounced) [priority: could]

## Acceptance Criteria

- Create claim with 2 line items, verify in dashboard
- Validation prevents submit with end_date < start_date
- Form clears after successful creation

## Dependencies

- REQ-CL-03 (POST /api/claims)
- REQ-CL-04 (PATCH /api/claims/:id for edits)
