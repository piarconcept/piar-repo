# 2026-09-09 Node.js 24 Runtime Migration

## Purpose

Migrate the template from Node.js 20 to the exact Node.js `24.20.0` LTS runtime already validated
in Catalonia OS, while correcting framework ownership, workspace build scheduling, CI alignment,
and runtime compatibility guardrails.

The work is one sequential migration because runtime pins, package manifests, the lockfile, Turbo,
application preparation, tests, hooks, CI, and documentation form one reproducibility contract.

## Source Documents

- `docs/features/catalonia-os-template-backport-audit.md`
- `docs/features/repository-configuration.md`
- `docs/features/quality-gates.md`
- `docs/features/github-workflows.md`
- Catalonia OS `docs/learning-log/2026-09-08-node24-tailwind-compatibility.md`
- Catalonia OS `docs/architecture/fixes/2026-09-08-single-owner-dependency-builds.md`

## Wave Index

### Wave 1 - `sequential-prod-safe`

- `2026-09-09_wave_1`
- Prompt `AA` - Implement the runtime, dependency, build-coordination, CI, test, and documentation
  migration.
- Prompt `QA` - Review the integrated diff and run the complete Node.js 24.20.0 verification gate.

## Execution Order

1. Inventory the exact Catalonia OS migration and current npm compatibility data.
2. Implement Prompt AA as one coherent runtime contract.
3. Align only the package branches required by the existing Next.js 15, React 19, and NestJS 11
   graph, then regenerate the frozen lockfile with Node.js `24.20.0` and pnpm `10.28.0`.
4. Run targeted runtime, script, typecheck, lint, and build checks.
5. Run Prompt QA and the complete clean verification once from the integrated state.

## Cross-Wave Integration Rule

There is one implementation wave. Do not separate the runtime pin from engine declarations,
Actions, hooks, or the lockfile. If a framework major upgrade is required, stop and create a
separate migration rather than widening this runtime change.

## Day-Level Success Criteria

- Every runtime owner derives Node.js from `.nvmrc` and requires `24.20.0`.
- The dependency graph contains one compatible Next.js 15 line and one React runtime for both
  template clients.
- NestJS 11 uses compatible config and Swagger integration branches without changing its core
  major.
- Direct application commands and Turbo tasks cannot concurrently rewrite shared package output.
- Node.js 24 compatibility regressions have direct tooling tests.
- `pnpm clean` passes with Node.js `24.20.0` and pnpm `10.28.0` without worktree drift.

## Last Updated

9 September 2026 - Created the Node.js 24 runtime migration day plan.
