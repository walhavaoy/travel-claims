---
component: claim-detail
area: frontend
priority: P1
status: planned
created: 2026-04-29
---

# Claim Detail

> View claim details, upload receipts, and perform role-appropriate actions at /claims/:id.

## Purpose

Detailed view of a single claim showing line items, uploaded receipts, full status history, and action buttons appropriate to the user's role and the claim's current status.

## Requirements

### Core
- REQ-CD-01: Display claim header: destination, purpose, trip_dates, status badge, total amount [priority: must]
- REQ-CD-02: Display line items table with description, amount, currency [priority: must]
- REQ-CD-03: Display receipts per line item with download links [priority: must]
- REQ-CD-04: Upload receipt button (per line item) — multipart upload via POST /api/claims/:id/receipts [priority: must]
- REQ-CD-05: Display claim_history as timeline with status transitions, actor, comment, timestamp [priority: must]
- REQ-CD-06: Employee actions: Submit (draft), Edit (draft), Delete (draft) [priority: must]
- REQ-CD-07: Manager actions: Approve (submitted), Reject with comment (submitted) [priority: must]
- REQ-CD-08: Finance actions: Mark as Paid (approved) [priority: must]
- REQ-CD-09: All interactive elements have data-testid with travelclaims- prefix [priority: must]

### Extended
- REQ-CD-10: Approve/reject shows confirmation dialog with optional comment [priority: should]
- REQ-CD-11: Receipt thumbnails for images [priority: could]

## Acceptance Criteria
- Claim detail shows all fields, line items, receipts, and history
- Receipts download with correct content type
- Status transitions work from the UI (submit, approve, reject, mark-paid)
- History updates after each action

## Dependencies
- backend/claims-api (GET/PATCH /api/claims/:id)
- backend/receipts-api (POST/GET receipts)
- frontend/shared (status badges, layout)
