# Node.js 24 Runtime Compatibility Without Framework Drift

## Summary

The template moved from a broad Node.js 20 contract to the exact Node.js `24.20.0` LTS runtime.
The migration kept stable application framework majors, corrected packages whose peer metadata did
not support the existing stack, and added executable tests for the non-obvious Node 24 boundaries.

## Date

2026-09-09

## Status

- [x] Resolved
- [ ] Follow-up needed

## Area

- Package or app: complete monorepo, both Next.js clients, both NestJS BFFs, shared test tooling
- Environment: macOS ARM64 local development and GitHub Actions runtime contract

## Symptoms

- `.nvmrc` selected only major `20`, while manifests and Actions repeated broad/hard-coded values.
- There was no executable check proving that the current process, engines, package manager, and CI
  used the same runtime.
- Node 24 exposed a Vitest 2/jsdom cancellation-constructor mismatch around native `Request`.
- Runtime migration also revealed stale framework peer relationships and duplicated shared builds.

## Impact

Developers and CI could run different Node patches, old processes could continue under Node 20,
and a dependency update could accidentally introduce a second framework runtime. Browser-like tests
could fail even though production request behavior was correct.

## Root Cause

Runtime ownership was duplicated rather than derived from one exact file. Engine ranges alone do
not validate the active process, and package `engines` metadata does not prove native Tailwind or
jsdom behavior on a new Node major.

## Resolution

- Pinned `.nvmrc` to `24.20.0` and aligned runtime engines to `>=24.20.0 <25`.
- Made Actions read `.nvmrc`; made both Git hooks and verification fail fast on runtime drift.
- Kept pnpm 10.28.0, Next.js 15, React 19.1, TypeScript 5.9, Tailwind 4.1, and Vitest 2.
- Updated Node typings to the compatible Node 24 line.
- Added compiler/scanner/optimizer tests for each Tailwind PostCSS client.
- Added a shared Vitest jsdom environment that preserves Node's native cancellation constructors
  during setup and restores the original globals during teardown.
- Corrected the dependency and build-ownership defects exposed by the migration in separate
  architecture notes.

## Verification

- Tests added or updated: runtime drift, dependency drift, Tailwind runtime, jsdom cancellation,
  and workspace preparation tooling tests
- Commands run: `pnpm runtime:check`, `pnpm dependencies:check`, `pnpm test:scripts`, frozen install,
  build, typecheck, workspace tests, and lint
- Manual verification: Node 24.20.0 was the active process and no Next.js 16 or second React runtime
  remained in the lockfile

## Prevention

- Change Node.js first in `.nvmrc`, then update engines, lockfile, tests, and documentation together.
- Restart existing dev/watch processes after selecting a new Node runtime.
- Test native compiler/scanner/optimizer loading; do not infer compatibility only from package
  engines.
- Keep runtime migrations separate from unrelated framework-major upgrades.

## Related Changes

- Files: `.nvmrc`, `package.json`, `.github/workflows/`, `.husky/`, `scripts/`, `turbo.json`
- Related docs: `../architecture/fixes/2026-09-09-single-owner-dependency-builds.md`,
  `../architecture/fixes/2026-09-09-framework-dependency-alignment.md`
- Source evidence: Catalonia OS Node.js 24 migration and the official npm package metadata reviewed
  on 9 September 2026

## Last Updated

9 September 2026 - Recorded the exact runtime migration and compatibility guardrails
