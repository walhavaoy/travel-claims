---
component: seed
area: data
priority: P0
status: planned
created: 2026-04-29
---

# Seed Data

> Hardcoded stub users for forward-auth identity mapping.

## Purpose

Insert three stub users that map to X-Forwarded-User header values. These represent the three roles in the system.

## Requirements

### Core
- REQ-SD-01: Seed user Alice with role=employee, department=Engineering, manager_id pointing to Bob [priority: must]
- REQ-SD-02: Seed user Bob with role=manager, department=Engineering, manager_id=NULL [priority: must]
- REQ-SD-03: Seed user Carol with role=finance, department=Finance, manager_id=NULL [priority: must]
- REQ-SD-04: Use deterministic UUIDs for reproducibility in tests [priority: must]
- REQ-SD-05: Seed is idempotent (INSERT ... ON CONFLICT DO NOTHING) [priority: must]

### Extended
- REQ-SD-10: Map X-Forwarded-User header values (alice, bob, carol) case-insensitively to users [priority: should]

## Acceptance Criteria
- After startup, `SELECT * FROM users` returns exactly three rows
- Alice's manager_id references Bob's id
- Re-running seed does not create duplicates

## Dependencies
- data/schema (users table must exist)
