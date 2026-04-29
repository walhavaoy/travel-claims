---
component: auth
area: backend
priority: P0
status: planned
created: 2026-04-29
---

# Authentication & Authorization

> Keycloak forward-auth via X-Forwarded-User header with role-based access control.

## Purpose

Extract user identity from the X-Forwarded-User header (set by Keycloak forward-auth proxy), look up the user in the database, and attach user context to the request. Enforce role-based access on API routes.

## Requirements

### Core
- REQ-AU-01: When TRUST_FORWARD_AUTH=true, read X-Forwarded-User header on all /api/* requests [priority: must]
- REQ-AU-02: Look up header value in users table (case-insensitive name match) [priority: must]
- REQ-AU-03: Return 401 if header is missing or user not found [priority: must]
- REQ-AU-04: Attach user object (id, name, role, department, manager_id) to request context [priority: must]
- REQ-AU-05: Role-based route guards: employee can only access own claims; manager can access team claims; finance can access all approved/paid claims [priority: must]
- REQ-AU-06: Do NOT implement login forms — identity comes from the platform [priority: must]

### Extended
- REQ-AU-10: Log authentication failures with user header value for debugging [priority: should]

## Acceptance Criteria
- Request with X-Forwarded-User: alice reaches API with Alice's user context
- Request without X-Forwarded-User returns 401
- Request with unknown user returns 401
- Employee cannot approve claims; manager cannot mark as paid; finance cannot create claims

## Dependencies
- data/seed (stub users must exist)
