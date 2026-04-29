---
component: auth
area: backend
priority: P0
status: planned
created: 2026-04-29
---

# Authentication Middleware

> Keycloak forward-auth via X-Forwarded-User header with role resolution.

## Purpose

Extract the authenticated user identity from the X-Forwarded-User request header (set by the platform's Keycloak forward-auth proxy), look up the user in the database, and attach the user object (including role) to the request for downstream handlers.

## Requirements

### Core
- REQ-AU-01: Read X-Forwarded-User header when TRUST_FORWARD_AUTH=true [priority: must]
- REQ-AU-02: Look up user by name (case-insensitive) in users table [priority: must]
- REQ-AU-03: Attach user object to request (req.user with id, name, role, department, manager_id) [priority: must]
- REQ-AU-04: Return 401 if header is missing or user not found [priority: must]
- REQ-AU-05: Skip auth for /healthz endpoint [priority: must]
- REQ-AU-06: Skip auth for static file requests (paths not starting with /api/) [priority: must]

### Extended
- REQ-AU-10: Role-based middleware helpers: requireRole('manager'), requireRole('finance') [priority: should]

## Acceptance Criteria

- Request with `X-Forwarded-User: alice` resolves to Alice's user record with role=employee
- Request without header returns 401
- Request with unknown user returns 401

## Dependencies

- data/seeds (users must be seeded)
- backend/server (middleware registered on Express app)
