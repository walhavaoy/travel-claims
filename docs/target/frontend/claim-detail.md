---
component: claim-detail
area: frontend
priority: P1
status: planned
created: 2026-05-04
---

# Claim Detail

> Claim detail view at /claims/:id with receipts, history, and actions.

## Purpose

Display full claim information and provide role-appropriate action buttons.

## Requirements

### Core
- REQ-FD-01: Show claim fields: dates, destination, purpose, status, line items [priority: must]
- REQ-FD-02: Show receipt list with download links [priority: must]
- REQ-FD-03: Show claim history (status transitions with actor, comment, timestamp) [priority: must]
- REQ-FD-04: Employee actions: Edit (draft), Submit (draft), Upload Receipt (draft) [priority: must]
- REQ-FD-05: Manager actions: Approve (submitted), Reject with comment (submitted) [priority: must]
- REQ-FD-06: Finance actions: Mark Paid (approved) [priority: must]
- REQ-FD-07: data-testid attributes on all action buttons [priority: must]

### Extended
- REQ-FD-10: Inline comment field for reject/approve actions [priority: should]

## Acceptance Criteria

- All claim data displayed correctly
- Action buttons only visible for appropriate role and status
- History shows chronological transitions
- Receipt download works with correct content type

## Dependencies

- REQ-CL-02 (GET /api/claims/:id)
- REQ-RC-05, REQ-RC-06 (receipts list/download)
- REQ-CL-05 (status transitions)
