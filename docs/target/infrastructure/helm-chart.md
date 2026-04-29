---
component: helm-chart
area: infrastructure
priority: P0
status: planned
created: 2026-04-29
---

# Helm Chart

> Kubernetes Deployment, Service, and PVC for the travel-claims application.

## Purpose

Deploy the travel-claims container to the project namespace with proper networking, storage, and configuration.

## Requirements

### Core
- REQ-HC-01: Deployment named `product` in namespace project-travel-claims-e4e54fca [priority: must]
- REQ-HC-02: Service named `product` on port 3000 [priority: must]
- REQ-HC-03: PersistentVolumeClaim for receipt storage, mounted at /data/receipts [priority: must]
- REQ-HC-04: Environment variables from values.yaml: DATABASE_URL, PORT, TRUST_FORWARD_AUTH, UPLOAD_DIR [priority: must]
- REQ-HC-05: Readiness probe on /healthz [priority: must]
- REQ-HC-06: Liveness probe on /healthz [priority: must]
- REQ-HC-07: Security context: runAsUser 1001, runAsNonRoot true [priority: must]
- REQ-HC-08: Resource requests and limits (sensible defaults) [priority: must]

### Extended
- REQ-HC-10: ConfigMap or values for database connection string [priority: should]
- REQ-HC-11: Ingress or VirtualService for claims.tmpclaw.io (if not handled by platform) [priority: could]

## Acceptance Criteria
- `helm template` renders valid Kubernetes manifests
- Deployment runs with correct env vars and mounts
- Service routes traffic to pod on port 3000
- PVC is bound and writable from the container

## Dependencies
- infrastructure/dockerfile (container image)
- infrastructure/config (env var definitions)
