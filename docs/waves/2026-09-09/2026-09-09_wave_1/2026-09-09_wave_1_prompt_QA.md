# 2026-09-09 Wave 1 Prompt QA - Verify Node.js 24 Migration

## Prompt For Codex

Review and verify the integrated Node.js `24.20.0` migration without widening its dependency or
product scope.

Set the chat title to: `Prompt QA - Wave 1 - 2026-09-09`.

## Mandatory Start Context

- Work in turbo-template and inspect the complete current diff.
- Use Node.js `24.20.0` and pnpm `10.28.0` for every executable check.
- Treat warnings, skipped checks, and unsupported external environments as residual evidence, not
  silent successes.

## Read First

- `docs/AI-context.md`
- `README.md`
- `docs/features/repository-configuration.md`
- `docs/features/quality-gates.md`
- `docs/learning-log/2026-09-09-node24-runtime-compatibility.md`
- `docs/architecture/fixes/2026-09-09-single-owner-dependency-builds.md`
- `docs/waves/2026-09-09/README.md`
- `docs/waves/2026-09-09/2026-09-09_wave_1/README.md`

## Ownership

You may edit only tightly scoped runtime migration corrections and the final implementation report.

Do not edit application feature behavior, product content, persistence, or infrastructure.

## Task

- Review all changed runtime, dependency, workflow, hook, script, test, lockfile, and documentation
  files.
- Confirm the Catalonia OS source material was generalized to `@piar` and contains no product or
  production identifiers.
- Run targeted checks and then one complete clean verification.
- Record exact results and residual risks in the implementation report.

## Acceptance Criteria

- Runtime and package-manager ownership are single-source and fail closed on drift.
- The compatible package alignment is visible in manifests and the frozen lockfile.
- Script regression tests cover runtime, build ownership, Tailwind, and jsdom behavior.
- `pnpm clean` passes without visible worktree drift.

## QA Tester Definition Of Done

- Inspect `git diff --check` and the complete status.
- Run the exact-runtime guard and all tooling tests.
- Run both client builds and repository-wide build/typecheck/test/lint through the full gate.
- Confirm generated artifacts are removed after verification.
- List any hosted Linux or deployment check that remains outside this local migration.

## Suggested Verification

```bash
pnpm runtime:check
pnpm test:scripts
pnpm clean
git diff --check
git status --short
```

## Expected Output

Report exactly:

1. Findings ordered by severity
2. Files reviewed
3. Commands executed
4. Passing evidence
5. Failures and corrections
6. Checks not performed
7. Residual risks

## Last Updated

9 September 2026 - Created the Node.js 24 QA prompt.
