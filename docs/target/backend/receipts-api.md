---
component: receipts-api
area: backend
priority: P0
status: planned
created: 2026-04-29
---

# Receipts API

> Multipart file upload and download for claim receipts.

## Purpose

Handle receipt file uploads via Multer (attached to line items) and serve them back with correct content types. Files stored on a PVC at /data/receipts.

## Requirements

### Core
- REQ-RC-01: POST /api/claims/:id/receipts accepts multipart upload with line_item_id field [priority: must]
- REQ-RC-02: Multer file size limit: 5MB per file [priority: must]
- REQ-RC-03: Allowed MIME types: image/jpeg, image/png, application/pdf only [priority: must]
- REQ-RC-04: Store files at /data/receipts/{claim_id}/{receipt_id}.{ext} [priority: must]
- REQ-RC-05: Insert receipt record in database with filename, content_type, size, path [priority: must]
- REQ-RC-06: GET /api/claims/:id/receipts lists all receipts for the claim [priority: must]
- REQ-RC-07: GET /api/claims/:id/receipts/:receiptId serves the file with correct Content-Type header [priority: must]
- REQ-RC-08: Only claim owner can upload receipts (draft or submitted status only) [priority: must]

### Extended
- REQ-RC-10: Return 413 if file exceeds size limit [priority: should]
- REQ-RC-11: Return 415 if MIME type not allowed [priority: should]
- REQ-RC-12: Validate that line_item_id belongs to the claim [priority: should]

## Acceptance Criteria
- Upload a JPEG receipt to a line item — returns receipt metadata
- Upload a PDF receipt — works
- Upload a 6MB file — rejected with 413
- Upload a .txt file — rejected with 415
- Download receipt — correct Content-Type and file contents
- Receipt list includes filename, content_type, size

## Dependencies
- data/schema (receipts table)
- backend/auth (owner check)
- infrastructure/helm-chart (PVC mount at /data/receipts)
