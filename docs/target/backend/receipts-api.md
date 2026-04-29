---
component: receipts-api
area: backend
priority: P0
status: planned
created: 2026-04-29
---

# Receipts API

> File upload and download endpoints for receipt attachments.

## Purpose

Handle multipart file uploads for receipts attached to line items, store files on the PVC at /data/receipts, and serve them back with correct content-type headers.

## Requirements

### Core
- REQ-RC-01: POST /api/claims/:id/receipts - multipart upload, requires line_item_id in body or query [priority: must]
- REQ-RC-02: GET /api/claims/:id/receipts - list receipts for a claim [priority: must]
- REQ-RC-03: GET /api/claims/:id/receipts/:receiptId - download receipt file with correct content-type [priority: must]
- REQ-RC-04: Multer file size limit: 5MB [priority: must]
- REQ-RC-05: Allowed MIME types: image/jpeg, image/png, application/pdf only [priority: must]
- REQ-RC-06: Store files on disk at /data/receipts/{claimId}/{lineItemId}/{uuid}.{ext} [priority: must]
- REQ-RC-07: Store metadata (filename, content_type, size, path) in receipts table [priority: must]

### Extended
- REQ-RC-10: DELETE receipt (only on draft claims by submitter) [priority: should]

## Acceptance Criteria

- Upload a JPEG receipt for a line item, verify it's stored and retrievable
- Upload a file >5MB, verify 413/400 rejection
- Upload a .exe file, verify MIME type rejection
- Download a receipt and verify Content-Type header matches stored content_type

## Dependencies

- backend/claims-api (claim and line_item must exist)
- multer npm package
- PVC mounted at /data/receipts
