---
component: claim-form
area: frontend
priority: P1
status: planned
created: 2026-04-30
---

# Claim Form

> Create and edit claims with trip details and dynamic line items.

## Purpose

Form UI for employees to create new travel claims with trip dates, destination, purpose, and one or more line items with amounts.

## Requirements

### Core
- REQ-CF-01: Form fields: trip_start_date, trip_end_date, destination, purpose [priority: must]
- REQ-CF-02: Dynamic line items: add/remove rows with description, amount, currency [priority: must]
- REQ-CF-03: Validate trip_end_date >= trip_start_date before submit [priority: must]
- REQ-CF-04: At least one line item required [priority: must]
- REQ-CF-05: Submit creates draft via POST /api/claims [priority: must]
- REQ-CF-06: Navigate to claim detail on successful creation [priority: must]
- REQ-CF-07: Display validation errors inline [priority: must]
- REQ-CF-08: data-testid attributes on all form elements with travelclaims- prefix [priority: must]

### Extended
- REQ-CF-10: Pre-populate currency from user preference or default USD [priority: should]

## Acceptance Criteria

- User can add 2 line items and submit, sees new claim in detail view
- Validation error shown if end date before start date
- Validation error shown if no line items

## Dependencies

- backend/claims-api (POST /api/claims)
- frontend/shell (router, navigation)
