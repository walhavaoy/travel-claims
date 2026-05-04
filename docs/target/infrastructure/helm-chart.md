---
component: helm-chart
area: infrastructure
priority: P1
status: planned
created: 2026-05-04
---

# Helm Chart

> Kubernetes Deployment + Service for the travel-claims application.

## Purpose

Deploy the travel-claims container into the realm namespace with proper resource configuration, secrets injection, and PVC mount.

## Requirements

### Core
- REQ-HC-01: Deployment named "product" with single replica [priority: must]
- REQ-HC-02: Service named "product" on port 3000 [priority: must]
- REQ-HC-03: envFrom referencing platform database secret (DATABASE_URL) [priority: must]
- REQ-HC-04: PVC for /data/receipts (256Mi default) [priority: must]
- REQ-HC-05: Health check: livenessProbe and readinessProbe on /healthz [priority: must]
- REQ-HC-06: Resource limits (256Mi memory, 250m CPU) [priority: must]
- REQ-HC-07: SecurityContext: runAsUser 1001, runAsNonRoot true [priority: must]

### Extended
- REQ-HC-10: Configurable replica count via values.yaml [priority: should]
- REQ-HC-11: PVC size configurable [priority: should]

## Acceptance Criteria

- helm template renders valid K8s manifests
- Deployment references correct image and port
- Secret envFrom injects DATABASE_URL
- PVC mounted at /data/receipts

## Dependencies

- REQ-IN-01 (container image exists)
- Platform provisions database secret
