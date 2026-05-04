---
area: infrastructure
status: planned
created: 2026-05-04
---

# Infrastructure Area

> Container image, Helm chart, and deployment configuration.

## Components

| Component | Priority | Description |
|-----------|----------|-------------|
| dockerfile | P1 | Multi-stage build, non-root UID 1001 |
| helm-chart | P1 | Deployment + Service named "product" on port 3000 |

## Key Decisions

- Multi-stage Dockerfile: build stage (tsc) -> production stage (node dist/)
- Run as UID 1001 (non-root)
- Helm chart creates Deployment + Service + PVC for receipts
- DATABASE_URL injected via envFrom (platform secret)
- PVC mounted at /data/receipts for receipt storage
- Port 3000 (matches PRD productPort)
