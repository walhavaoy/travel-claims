---
component: auth
area: backend
priority: P0
status: planned
created: 2026-05-04
---

# Authentication & Authorization

> Forward-auth via X-Forwarded-User header with role-based access control.

## Purpose

Identify the current user from the platform's Keycloak forward-auth proxy and enforce role-based permissions on API routes.

## Requirements

### Core
- REQ-AU-01: Extract username from X-Forwarded-User header [priority: must]
- REQ-AU-02: Look up user record in DB by name (case-insensitive) [priority: must]
- REQ-AU-03: Return 401 if header missing or user not found [priority: must]
- REQ-AU-04: Attach user object to request for downstream handlers [priority: must]
- REQ-AU-05: TRUST_FORWARD_AUTH=true enables header trust (default true) [priority: must]
- REQ-AU-06: Role guard middleware: requireRole('manager'), requireRole('finance') [priority: must]

### Extended
- REQ-AU-10: Cache user lookups in memory (TTL 60s) to reduce DB queries [priority: could]

## Acceptance Criteria

- Request without X-Forwarded-User returns 401
- Request with unknown user returns 401
- Alice can access employee routes, cannot access finance routes
- Bob can access manager routes
- Carol can access finance routes

## Dependencies

- REQ-DS-01 through REQ-DS-03 (seed users exist)
