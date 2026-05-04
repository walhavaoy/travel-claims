---
component: receipts-api
area: backend
priority: P0
status: planned
created: 2026-05-04
---

# Receipts API

> Multipart file upload and download for claim receipts.

## Purpose

Allow employees to attach receipt images/PDFs to line items and download them for review.

## Requirements

### Core
- REQ-RC-01: POST /api/claims/:id/receipts — multipart upload, requires line_item_id field [priority: must]
- REQ-RC-02: Maximum file size 5 MB [priority: must]
- REQ-RC-03: Allowed content types: image/jpeg, image/png, application/pdf [priority: must]
- REQ-RC-04: Store files on PVC at /data/receipts/{claim_id}/{receipt_id}.{ext} [priority: must]
- REQ-RC-05: GET /api/claims/:id/receipts — list receipts for a claim [priority: must]
- REQ-RC-06: GET /api/claims/:id/receipts/:receiptId — download file with correct Content-Type [priority: must]
- REQ-RC-07: Only claim submitter can upload receipts (and only while claim is draft) [priority: must]

### Extended
- REQ-RC-10: DELETE /api/claims/:id/receipts/:receiptId — remove receipt (draft claims only) [priority: should]

## Acceptance Criteria

- Upload JPEG receipt, download returns image/jpeg content type
- Upload > 5 MB file returns 413
- Upload .exe file returns 400 (unsupported content type)
- Receipt download works for all roles who can view the claim

## Dependencies

- REQ-CL-02 (claim exists and is accessible)
- Multer middleware
- /data/receipts PVC mount
