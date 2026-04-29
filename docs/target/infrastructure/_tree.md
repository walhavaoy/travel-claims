---
area: infrastructure
status: planned
created: 2026-04-29
---

# Infrastructure

> Docker build, Helm chart, and deployment configuration.

## Components

| Component | Priority | Description |
|-----------|----------|-------------|
| dockerfile | P0 | Multi-stage build, non-root UID 1001 |
| helm-chart | P0 | Deployment + Service + PVC in realm namespace |
| config | P0 | Environment variables and runtime configuration |

## Deployment Target
- Namespace: project-travel-claims-e4e54fca
- Service name: product
- Port: 3000
- Domain: claims.tmpclaw.io
- Database: travel_claims on postgres.tmpclaw.svc.cluster.local
- Receipt storage: PVC mounted at /data/receipts
