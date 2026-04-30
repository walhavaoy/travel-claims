---
component: claim-detail
area: frontend
priority: P1
status: planned
created: 2026-04-30
---

# Claim Detail

> Detail view showing claim info, receipts, history, and role-appropriate actions.

## Purpose

Display full claim details including line items, uploaded receipts, status history with comments, and action buttons appropriate to the current user's role and the claim's status.

## Requirements

### Core
- REQ-CD-01: Display claim header: destination, purpose, trip dates, status badge, total amount [priority: must]
- REQ-CD-02: Line items table with description, amount, currency [priority: must]
- REQ-CD-03: Receipt list per line item with download links [priority: must]
- REQ-CD-04: Receipt upload button per line item (on drafts) [priority: must]
- REQ-CD-05: Status history timeline with actor, transition, comment, timestamp [priority: must]
- REQ-CD-06: Employee actions: Edit (draft), Submit (draft), Delete (draft) [priority: must]
- REQ-CD-07: Manager actions: Approve/Reject (submitted) with comment textarea [priority: must]
- REQ-CD-08: Finance actions: Mark as Paid (approved) [priority: must]
- REQ-CD-09: Back button to return to dashboard [priority: must]
- REQ-CD-10: data-testid attributes on all interactive elements with travelclaims- prefix [priority: must]

### Extended
- REQ-CD-20: Inline edit of draft claim fields without navigating away [priority: should]

## Acceptance Criteria

- Viewing an approved claim shows full history of transitions
- Manager sees approve/reject buttons only on submitted claims from their reports
- Receipt download opens with correct MIME type
- After approving, page refreshes to show new status

## Dependencies

- backend/claims-api (GET /api/claims/:id, PATCH)
- backend/receipts (upload/download)
- frontend/shell (router, styles)
