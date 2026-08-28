# Domain and Data Contracts

This document prevents UI, data, and integration work from depending on unrecorded assumptions.

## Authority

- Product/domain source: `[location]`
- Persisted schema source: `[path or provider]`
- Migration authority: `[tool and path]`
- Generated-type source: `[path]`

Persisted models and generated types are authoritative for database rows. Create application contracts only for real inputs, projections, serialization boundaries, external payloads, or UI state.

## Domains

For each current domain, record:

```text
Domain:
Owner:
Purpose:
Persisted model(s):
Key fields:
Relations:
Statuses/enums:
Invariants:
Public projection(s):
Mutation input(s):
Deletion/retention behaviour:
```

Keep domain contracts bounded and explicit. Do not introduce generic configuration engines, dynamic schemas, category entities, roles, or other abstractions without a current product requirement.

## Cross-domain concepts

Record concepts genuinely shared by multiple domains, including their owner and representation. Do not move a concept globally merely because another feature might use it later.

## Infrastructure decisions

- Database provider and ownership: `[decision]`
- ORM/query layer and migration authority: `[decision]`
- Storage and stable asset-reference strategy: `[decision]`
- Authentication and session model: `[decision]`
- External integrations and handoff boundaries: `[decision]`

Separate provider responsibilities clearly so two tools do not compete for the same schema, migration, storage, or authentication authority.

## Trade-offs and unresolved decisions

Document only decisions that affect implementation. Mark unresolved material questions explicitly; do not let agents silently invent them.
