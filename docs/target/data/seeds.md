---
component: seeds
area: data
priority: P0
status: planned
created: 2026-04-29
---

# Seed Data

> Hardcoded stub users for development and initial deployment.

## Purpose

Insert three stub users with known UUIDs so that the X-Forwarded-User header can be mapped to user records without requiring a full identity provider integration.

## Requirements

### Core
- REQ-SD-01: Insert Alice (role=employee, department=engineering, manager_id=Bob's UUID) [priority: must]
- REQ-SD-02: Insert Bob (role=manager, department=engineering, manager_id=null) [priority: must]
- REQ-SD-03: Insert Carol (role=finance, department=finance, manager_id=null) [priority: must]
- REQ-SD-04: Use deterministic UUIDs so forward-auth mapping is stable (Alice=a11c0000..., Bob=b0b00000..., Carol=ca201000...) [priority: must]
- REQ-SD-05: Seeds must be idempotent (ON CONFLICT DO NOTHING or upsert) [priority: must]

### Extended
- REQ-SD-10: Provide a mechanism to add additional users via environment variable or config [priority: could]

## Acceptance Criteria

- After running seeds, `SELECT * FROM users` returns exactly 3 rows
- Alice's manager_id points to Bob's id
- Bob and Carol have no manager_id

## Dependencies

- data/schema (tables must exist)
