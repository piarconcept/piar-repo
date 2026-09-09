# Single Owner For Shared Dependency Builds

## Summary

Turbo and application preparation scripts both owned shared TypeScript builds. Under parallel
application builds, multiple compilers could rewrite the same `dist` output while another consumer
was reading it. Turbo now owns dependency builds for scheduled tasks, while direct app commands
retain one bounded preparation path.

## Date

2026-09-09

## Status

- [x] Resolved
- [ ] Follow-up needed

## Architecture Scope

- Apps or packages: all four Next.js and NestJS applications and their workspace dependencies
- Layers or boundaries involved: Turbo task graph, package scripts, shared compiled output
- Contracts, schemas, persistence, or build concerns: single-writer build ownership

## Symptoms

- Downstream production evidence showed intermittent missing exports during parallel client builds.
- Isolated client builds passed while coordinated builds could fail depending on timing.
- Every application ran its own recursive `pnpm --filter ...^... build` after Turbo had already run
  upstream builds.

## Impact

The template could generate timing-dependent builds. A successful retry or serial build could hide
the race without correcting shared-output ownership.

## Why This Was Architectural

The failure came from two independent orchestration layers scheduling the same write operation. It
was not a defect in the shared export, TypeScript, Tailwind, Next.js, or NestJS.

## Root Cause

Application `build:prepare` and `dev:prepare` commands launched recursive dependency builds even
when Turbo had already scheduled and completed `^build`. Sibling consumers therefore became
competing writers of the same generated package directories.

## Resolution

- Added `scripts/prepare-workspace.mjs` as the only application dependency coordinator.
- When Turbo supplies `TURBO_HASH`, preparation performs no nested build.
- A direct app command runs Turbo once for the exact application's dependencies and propagates
  failures.
- Added `^build` ordering to `dev` and `test:watch` as well as build/test/typecheck consumers.
- Added `.nvmrc` and the coordinator to Turbo global cache inputs.
- Routed all four template applications through the coordinator.

## Verification

- Tests added or updated: `scripts/prepare-workspace.test.mjs`
- Commands run: `pnpm test:scripts`, `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm lint`
- Manual verification: all four application manifests use the same coordinator and contain no
  nested dependency-build command

## Guardrails

- Root tooling tests reject a second scheduled builder, missing dependency ordering, app-local
  Turbo overrides, or coordinator drift.
- New applications must use the shared coordinator instead of embedding recursive package builds.
- Do not fix recurrence by globally serializing Turbo; preserve concurrency with single ownership.

## Cross-References

- Related feature docs: `../../features/repository-configuration.md`,
  `../../features/quality-gates.md`
- Related wave docs: `../../waves/2026-09-09/2026-09-09_wave_1/README.md`
- Related learning-log entries: `../../learning-log/2026-09-09-node24-runtime-compatibility.md`
- Relevant files: `../../../turbo.json`, `../../../scripts/prepare-workspace.mjs`

## Last Updated

9 September 2026 - Recorded graph-owned dependency preparation and direct-command fallback
