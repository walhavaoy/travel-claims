---
component: seed
area: data
priority: P0
status: planned
created: 2026-05-04
---

# Seed Data

> Hardcoded stub users for development and MVP.

## Purpose

Provide the three test users referenced in acceptance criteria so the system is immediately usable after deployment.

## Requirements

### Core
- REQ-DS-01: Seed Alice as employee, engineering department, manager_id = Bob's ID [priority: must]
- REQ-DS-02: Seed Bob as manager, engineering department, no manager_id [priority: must]
- REQ-DS-03: Seed Carol as finance role, finance department [priority: must]
- REQ-DS-04: Use INSERT ... ON CONFLICT DO NOTHING for idempotency [priority: must]
- REQ-DS-05: Use well-known UUIDs for deterministic test references [priority: must]

### Extended
- REQ-DS-10: Support SEED_ON_STARTUP=true env var to control seeding [priority: could]

## Acceptance Criteria

- After startup, SELECT from users returns all three stub users
- Re-running seed does not duplicate or error

## Dependencies

- REQ-DA-01 (users table schema)
- REQ-DM-01 (migrations run first)
