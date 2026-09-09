# Framework Dependency Alignment Has One Repository Owner

## Summary

The template declared incompatible Next.js, ESLint, React, and Nest integration branches across
separate workspaces. The lockfile could therefore install a framework graph that differed from the
deployable applications. Root workspace overrides and a direct regression guard now define one
compatible contract.

## Date

2026-09-09

## Status

- [x] Resolved
- [ ] Follow-up needed

## Architecture Scope

- Apps or packages: both Next.js clients, shared client packages, both NestJS BFFs, feature APIs
- Layers or boundaries involved: workspace manifests, peer dependencies, pnpm resolution
- Contracts, schemas, persistence, or build concerns: deployable framework graph ownership

## Symptoms

- Next.js 15 applications declared an ESLint preset from Next.js 16.
- Shared peers requested both Next.js 15 and 16.
- auto-installed peers introduced a second Next.js and React DOM graph.
- NestJS 11 applications used `@nestjs/config` 3 and `@nestjs/swagger` 8, whose peers target older
  NestJS majors.
- `@testing-library/react-hooks` requested React 16/17 and was unused under React 19.

## Impact

Install success depended on pnpm's peer placement and hoisting choices. Production-style installs
could fail or silently use framework integrations outside their declared supported peers.

## Why This Was Architectural

Framework compatibility was declared independently in application and shared-package manifests,
while obsolete overrides lived in the wrong pnpm configuration surface. No repository-level owner
enforced the graph consumed by deployable apps.

## Root Cause

Dependency upgrades were applied piecemeal without synchronizing framework presets, peer ranges,
root runtime ownership, and Nest integration packages. pnpm 10 repository overrides were also kept
in `package.json` instead of `pnpm-workspace.yaml`.

## Resolution

- Fixed Next.js and `eslint-config-next` at `15.5.25` and constrained shared peers below 16.
- Fixed the React and React DOM runtime graph at `19.1.0`.
- Moved repository overrides to `pnpm-workspace.yaml`.
- Aligned NestJS 11 with `@nestjs/config` `^4.0.4` and `@nestjs/swagger` `^11.4.7`.
- Removed the unused React hooks testing package that does not support React 19.
- Aligned every Node type declaration with Node 24.
- Added `scripts/check-dependency-alignment.mjs` and direct drift tests.

## Verification

- Tests added or updated: `scripts/check-dependency-alignment.test.mjs`
- Commands run: frozen install, `pnpm dependencies:check`, full build, typecheck, tests, and lint
- Manual verification: the lockfile contains only Next.js 15.5.25, React 19.1.0, React DOM 19.1.0,
  Nest config 4.0.4, and Nest Swagger 11.4.7 runtime entries

## Guardrails

- Run `pnpm dependencies:check` after every framework or runtime dependency edit.
- Framework major upgrades require a dedicated migration; do not let a shared peer introduce one.
- Query package peer metadata before selecting Nest integration branches.
- Keep pnpm overrides in `pnpm-workspace.yaml`.

## Cross-References

- Related feature docs: `../../features/repository-configuration.md`,
  `../../features/eslint-configuration.md`
- Related wave docs: `../../waves/2026-09-09/2026-09-09_wave_1/README.md`
- Related learning-log entries: `../../learning-log/2026-09-09-node24-runtime-compatibility.md`
- Relevant files: `../../../pnpm-workspace.yaml`, `../../../pnpm-lock.yaml`,
  `../../../scripts/check-dependency-alignment.mjs`

## Last Updated

9 September 2026 - Recorded the repository-owned compatible framework graph
