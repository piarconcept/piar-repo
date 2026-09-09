# 2026-09-09 Wave 1 - Node.js 24 Runtime Contract

## Type

`sequential-prod-safe`

## Status

Complete. The integrated migration passed the full clean verification on 9 September 2026. See
`implementation-report.md` for the exact evidence and remaining follow-up.

## Objective

Move the complete template development and CI contract to Node.js `24.20.0`, preserve stable
application behavior, and add direct guardrails for runtime drift, hoisted framework alignment,
Tailwind compilation, jsdom cancellation, and shared dependency build ownership.

## Dependencies

- The current turbo-template `main` working tree.
- Catalonia OS commit `11e9fc8efbde5b21659df4b4763030e8c2a6d6f3` as production-derived evidence.
- npm compatibility metadata reviewed on 9 September 2026.

## Prompt Index

- `2026-09-09_wave_1_prompt_AA.md` - Runtime and dependency migration implementation.
- `2026-09-09_wave_1_prompt_QA.md` - Integrated verification and regression review.
- `implementation-report.md` - Final implementation and QA evidence.

## Execution Order

1. Run Prompt AA completely, including lockfile regeneration and targeted checks.
2. Review the resulting diff for product-specific Catalonia OS values or unrelated upgrades.
3. Run Prompt QA and record the final evidence in the wave implementation report.

## Integration Criteria

- `.nvmrc`, engine declarations, workflows, hooks, Turbo inputs, and documentation agree on the
  runtime contract.
- Next.js, `eslint-config-next`, shared Next peer contracts, and root React ownership are aligned.
- NestJS 11 integration packages and Node typings declare supported branches.
- `pnpm runtime:check`, `pnpm dependencies:check`, and root tooling tests reject contract drift.
- All application preparation uses a single Turbo-aware coordinator.
- The complete clean verification passes under the exact runtime and package manager.

## Non-Goals Or Safety Rules

- Do not upgrade React, Tailwind, TypeScript, Vitest, TypeORM, NestJS core, or other application
  framework majors. Compatibility-only Nest integration branches may move to the major that
  declares NestJS 11 peers.
- Do not copy Catalonia OS product code, infrastructure state, domains, accounts, or deployment
  guards.
- Do not change the template's PostgreSQL, NextAuth, Accounts, or Search product baseline.
- Do not overwrite the pending Catalonia OS audit documentation changes.

## Last Updated

9 September 2026 - Completed the sequential Node.js 24 migration and recorded the verification
evidence.
