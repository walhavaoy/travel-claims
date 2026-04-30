---
component: receipts
area: backend
priority: P0
status: planned
created: 2026-04-30
---

# Receipts

> File upload and download for claim line item receipts.

## Purpose

Handle receipt file uploads via Multer, store files on disk at /data/receipts (PVC mount), and serve downloads with the correct content-type.

## Requirements

### Core
- REQ-RC-01: POST /api/claims/:id/receipts — multipart upload with line_item_id field [priority: must]
- REQ-RC-02: GET /api/claims/:id/receipts — list receipts for a claim [priority: must]
- REQ-RC-03: GET /api/receipts/:id/download — download receipt file with correct content-type [priority: must]
- REQ-RC-04: Multer file size limit: 5MB [priority: must]
- REQ-RC-05: Allowed content types: image/jpeg, image/png, application/pdf [priority: must]
- REQ-RC-06: Store files at UPLOAD_DIR (default /data/receipts) with unique filenames [priority: must]
- REQ-RC-07: Create receipts DB record with filename, content_type, size, path [priority: must]
- REQ-RC-08: Validate that the line_item belongs to the specified claim [priority: must]

### Extended
- REQ-RC-10: Only allow upload on draft claims (not submitted/approved/paid) [priority: should]

## Acceptance Criteria

- Upload a JPEG receipt for a line item, get 201 with receipt metadata
- Download the receipt, verify content-type matches original
- Upload a 6MB file, get 413 or 400
- Upload a .exe file, get 400

## Dependencies

- backend/claims-api (claim/line_item existence validation)
- data/schema (receipts table)
- infrastructure/helm (PVC mount at /data/receipts)
