---
component: helm
area: infrastructure
priority: P0
status: planned
created: 2026-04-30
---

# Helm Chart

> Kubernetes deployment chart for travel-claims service.

## Purpose

Deploy the travel-claims container as a Deployment + Service named "product" in the realm namespace, with PVC for receipt storage and DATABASE_URL injected from the operator-managed secret.

## Requirements

### Core
- REQ-HM-01: Deployment named "product" with 1 replica [priority: must]
- REQ-HM-02: Service named "product" on port 3000 [priority: must]
- REQ-HM-03: Deploy in namespace from Release.Namespace (project-travel-claims-e4e54fca) [priority: must]
- REQ-HM-04: envFrom referencing the database secret for DATABASE_URL [priority: must]
- REQ-HM-05: PVC volume mount at /data/receipts for receipt storage [priority: must]
- REQ-HM-06: Readiness probe on /healthz [priority: must]
- REQ-HM-07: Security context: runAsUser 1001, runAsNonRoot true [priority: must]
- REQ-HM-08: Resource requests/limits configured via values.yaml [priority: must]
- REQ-HM-09: TRUST_FORWARD_AUTH=true and UPLOAD_DIR=/data/receipts env vars [priority: must]

### Extended
- REQ-HM-10: Configurable replica count [priority: should]

## Acceptance Criteria

- helm template renders valid YAML with Deployment + Service
- Deployment references correct image and port
- PVC mount present at /data/receipts
- DATABASE_URL injected from secret

## Dependencies

- infrastructure/docker (container image)
- Platform operator provisions database secret
