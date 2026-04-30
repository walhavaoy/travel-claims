---
component: auth
area: backend
priority: P0
status: planned
created: 2026-04-30
---

# Authentication Middleware

> Keycloak forward-auth via X-Forwarded-User header.

## Purpose

Extract the authenticated user identity from the X-Forwarded-User header (set by the Keycloak forward-auth proxy), look up the user in the database, and attach the user object to the request context. All /api/* routes require authentication.

## Requirements

### Core
- REQ-AU-01: Read X-Forwarded-User header value (case-insensitive username) [priority: must]
- REQ-AU-02: Look up user by name in the users table [priority: must]
- REQ-AU-03: Return 401 if header missing or user not found [priority: must]
- REQ-AU-04: Attach full user object (id, name, role, department, manager_id) to request [priority: must]
- REQ-AU-05: Only apply to /api/* routes (not healthz, not static files) [priority: must]
- REQ-AU-06: When TRUST_FORWARD_AUTH=true, trust the header without further validation [priority: must]

### Extended
- REQ-AU-10: Cache user lookup to avoid per-request DB query (in-memory, short TTL) [priority: could]

## Acceptance Criteria

- Request with X-Forwarded-User: alice resolves to Alice's user record
- Request without header gets 401
- Request with unknown user gets 401
- User object available in route handlers

## Dependencies

- data/schema (users table must exist)
