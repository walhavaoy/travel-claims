---
area: infrastructure
status: planned
created: 2026-04-29
---

# Infrastructure Area

> Container build, Helm chart, and Kubernetes deployment configuration.

## Components

| Component | Description | Priority |
|-----------|-------------|----------|
| dockerfile | Multi-stage Node.js 22 build, runs as UID 1001 non-root, serves on PORT 3000 | P1 |
| helm-chart | Deployment + Service named `product` on port 3000 in realm namespace, PVC for receipts | P1 |

## Platform Integration

- Namespace: `project-travel-claims-e4e54fca`
- Domain: `claims.tmpclaw.io`
- PostgreSQL: `postgres.tmpclaw.svc.cluster.local` with database `travel_claims`
- Receipt storage: PVC mounted at `/data/receipts`
