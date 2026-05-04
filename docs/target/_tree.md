---
project: travel-claims
status: planned
created: 2026-05-04
---

# Travel Claims — Target Architecture Tree

> Standalone travel expense claim & receipt management system deployed at claims.tmpclaw.io.

## Areas

| Area | Description | Priority |
|------|-------------|----------|
| data | Database schema, migrations, seed data | P0 |
| backend | Express REST API, auth, file uploads | P0 |
| frontend | Vanilla JS UI served from /public | P1 |
| infrastructure | Dockerfile, Helm chart, CI | P1 |

## Priority Matrix

| Component | Area | Priority | Complexity |
|-----------|------|----------|------------|
| schema | data | P0 | standard |
| migrations | data | P0 | standard |
| seed | data | P0 | trivial |
| server | backend | P0 | standard |
| auth | backend | P0 | standard |
| claims-api | backend | P0 | complex |
| receipts-api | backend | P0 | standard |
| export | backend | P1 | standard |
| dashboard | frontend | P1 | standard |
| claim-form | frontend | P1 | standard |
| claim-detail | frontend | P1 | complex |
| dockerfile | infrastructure | P1 | trivial |
| helm-chart | infrastructure | P1 | standard |
