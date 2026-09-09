# 2026-09-09 Wave 1 Prompt AA - Implement Node.js 24 Runtime Migration

## Prompt For Codex

Migrate the turbo template to the exact Node.js `24.20.0` LTS runtime using Catalonia OS as
evidence, while retaining template-specific product and framework boundaries.

Set the chat title to: `Prompt AA - Wave 1 - 2026-09-09`.

## Mandatory Start Context

- Work in turbo-template, not Catalonia OS.
- Run `git status --short` before editing and preserve existing audit-document changes.
- Read the repository rules and the source Node.js 24 learning/fix documents in full.
- Treat `.nvmrc` as the only Node.js version source.

## Read First

- `docs/AI-context.md`
- `README.md`
- `docs/features/repository-configuration.md`
- `docs/features/quality-gates.md`
- `docs/features/github-workflows.md`
- `docs/features/catalonia-os-template-backport-audit.md`
- `docs/waves/2026-09-09/README.md`
- Catalonia OS `docs/learning-log/2026-09-08-node24-tailwind-compatibility.md`
- Catalonia OS `docs/architecture/fixes/2026-09-08-single-owner-dependency-builds.md`

## Ownership

You may edit:

- runtime, package-manager, Turbo, ESLint, Vitest, and package manifest configuration;
- `.github/workflows/ci.yml` and `.github/workflows/security.yml`;
- `.husky/`, `scripts/`, and `pnpm-lock.yaml`;
- runtime-, setup-, workflow-, quality-, Tailwind-, architecture-, learning-, wave-, and index docs.

Do not edit:

- application feature behavior or product copy;
- database configuration or migrations;
- production infrastructure or deployment state;
- Catalonia OS files.

If the task requires crossing ownership, stop and report before editing.

## Task

- Pin Node.js `24.20.0` and align every existing engine declaration.
- Make workflows and hooks derive and validate the canonical runtime.
- Add a tested runtime-alignment command and include tooling tests in `pnpm verify`.
- Move pnpm overrides to their pnpm 10 owner.
- Align the supported Next.js 15 patch, ESLint preset, shared peers, and root React ownership.
- Align Nest config/Swagger integrations with NestJS 11 and remove obsolete React testing peers.
- Align development Node typings with the selected runtime major.
- Replace nested application dependency builds with one Turbo-aware preparation coordinator.
- Add focused Tailwind and Vitest/jsdom Node.js 24 compatibility tests.
- Regenerate the frozen lockfile and update all determinant documentation.

## Acceptance Criteria

- The runtime guard rejects an incorrect process, engine, or Actions version source.
- The package graph has no unintended Next.js 16 or mixed React runtime.
- Turbo owns shared dependency output during scheduled tasks; direct app commands still prepare
  dependencies exactly once.
- Tailwind's existing PostCSS pipeline compiles and optimizes representative shared utilities.
- jsdom tests use cancellation constructors compatible with Node.js 24 native `Request`.
- No unrelated major dependency is upgraded.

## QA Tester Definition Of Done

- Run root tooling tests under Node.js `24.20.0`.
- Run targeted client and BFF typecheck, lint, test, and production build checks.
- Inspect the lockfile for runtime/framework duplication.
- Confirm documentation and examples no longer prescribe Node.js 20.
- Record any warning or unverified environment separately from passing evidence.

## Suggested Verification

```bash
pnpm runtime:check
pnpm dependencies:check
pnpm test:scripts
pnpm --filter @piar/web build
pnpm --filter @piar/backoffice build
pnpm --filter @piar/web-bff test
pnpm --filter @piar/backoffice-bff test
pnpm clean
```

## Expected Output

Report exactly:

1. Files changed
2. Runtime and dependency decisions
3. Commands executed
4. What passed
5. What failed
6. What could not be tested
7. Residual risks or follow-up

## Last Updated

9 September 2026 - Created the Node.js 24 implementation prompt.
