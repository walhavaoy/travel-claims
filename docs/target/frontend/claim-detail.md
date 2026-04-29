---
component: claim-detail
area: frontend
priority: P1
status: planned
created: 2026-04-29
---

# Claim Detail

> View claim details with receipts, history, and role-appropriate actions.

## Purpose

Detail page at /claims/:id showing full claim information, line items with receipt management, transition history timeline, and action buttons appropriate to the user's role and the claim's current status.

## Requirements

### Core
- REQ-CD-01: Display claim header: destination, purpose, trip dates, status badge, total amount [priority: must]
- REQ-CD-02: Line items table with receipt upload buttons per line item [priority: must]
- REQ-CD-03: Receipt upload via file picker (multipart POST to /api/claims/:id/receipts) [priority: must]
- REQ-CD-04: History timeline showing all status transitions with actor, comment, timestamp [priority: must]
- REQ-CD-05: Employee actions: edit (draft), submit (draft->submitted), delete (draft) [priority: must]
- REQ-CD-06: Manager actions: approve/reject (submitted) with comment input [priority: must]
- REQ-CD-07: Finance actions: mark-paid (approved) [priority: must]
- REQ-CD-08: All interactive elements have data-testid="travelclaims-..." attributes [priority: must]

### Extended
- REQ-CD-10: Receipt preview/thumbnail for images [priority: could]
- REQ-CD-11: Download receipt link with correct filename [priority: should]

## Acceptance Criteria

- Clicking a claim from dashboard shows full detail with line items
- Receipt upload works and shows attachment indicator
- History section shows all transitions with comments
- Actions only appear for the appropriate role and status

## Dependencies

- frontend/components (badges, buttons, modals)
- backend/claims-api (GET /api/claims/:id)
- backend/receipts-api (POST/GET receipts)
