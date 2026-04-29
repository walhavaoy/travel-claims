---
component: helm-chart
area: infrastructure
priority: P1
status: planned
created: 2026-04-29
---

# Helm Chart

> Kubernetes deployment manifests for the travel-claims application.

## Purpose

Deploy the travel-claims container as a Kubernetes Deployment + Service in the realm namespace, with proper configuration for the platform PostgreSQL, receipt PVC, and ingress.

## Requirements

### Core
- REQ-HM-01: Deployment named `product` with container port 3000 [priority: must]
- REQ-HM-02: Service named `product` exposing port 3000 [priority: must]
- REQ-HM-03: Deploy to namespace `project-travel-claims-e4e54fca` [priority: must]
- REQ-HM-04: DATABASE_URL env var pointing to postgres.tmpclaw.svc.cluster.local/travel_claims [priority: must]
- REQ-HM-05: TRUST_FORWARD_AUTH=true env var [priority: must]
- REQ-HM-06: PVC for /data/receipts mount [priority: must]
- REQ-HM-07: Readiness probe on /healthz [priority: must]
- REQ-HM-08: Security context: runAsUser 1001, runAsNonRoot true [priority: must]

### Extended
- REQ-HM-10: Resource requests/limits (CPU: 100m/500m, Memory: 128Mi/512Mi) [priority: should]
- REQ-HM-11: Pod disruption budget [priority: could]

## Acceptance Criteria

- `helm template` renders valid YAML
- Deployment has correct env vars, probes, and security context
- Service targets port 3000

## Dependencies

- infrastructure/dockerfile (container image must be built)
