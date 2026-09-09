# Node.js 24 Runtime Migration Implementation Report

Status: Complete

Verification date: 9 September 2026

Reference: Catalonia OS commit `11e9fc8efbde5b21659df4b4763030e8c2a6d6f3`

## 1. Findings And Runtime/Dependency Decisions

No blocking migration defects remain in the implemented Node.js 24 scope.

- `.nvmrc` is the exact runtime owner and pins Node.js `24.20.0`. Existing engine declarations now
  accept `>=24.20.0 <25`, and CI reads the version from `.nvmrc`.
- pnpm remains pinned to `10.28.0`. Repository overrides moved to `pnpm-workspace.yaml`, their pnpm
  10 configuration owner.
- The existing application majors remain stable: Next.js stays on the supported Next 15 line and
  is aligned at `15.5.25`; React and React DOM are aligned at `19.1.0`; TypeScript, Tailwind,
  Vitest, TypeORM, and NestJS core do not change major.
- `eslint-config-next` is aligned with Next.js `15.5.25`, shared package peer ranges reject Next.js
  16, and the root owns the React runtime used by hoisted workspace installs.
- NestJS 11 integration packages move to compatible branches: `@nestjs/config` `^4.0.4` and
  `@nestjs/swagger` `^11.4.7`. The unused React 16/17-only `@testing-library/react-hooks` package is
  removed.
- All development Node declarations use `@types/node` `^24.13.3`.
- Scheduled Turbo tasks own dependency builds. Direct application commands call one
  Turbo-aware preparation coordinator, preventing nested builds from writing shared output
  concurrently.
- Runtime alignment, dependency alignment, preparation ownership, Tailwind/PostCSS behavior, and
  Node.js 24 jsdom cancellation behavior are protected by root tooling tests.
- Catalonia OS product identity, application behavior, database decisions, AWS accounts, and
  infrastructure state were not copied into the template.

## 2. Files Reviewed And Changed

Runtime and automation:

- `.nvmrc`, `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, and `turbo.json`.
- `.github/workflows/ci.yml`, `.github/workflows/security.yml`, `.husky/pre-commit`, and
  `.husky/commit-msg`.
- Both BFF manifests, both client manifests/configurations, and the affected workspace package
  manifests under `packages/`.

Guards and regression coverage:

- `scripts/check-node-runtime.mjs` and its test.
- `scripts/check-dependency-alignment.mjs` and its test.
- `scripts/prepare-workspace.mjs` and its test.
- `scripts/tailwind-runtime.test.mjs`.
- `scripts/vitest-jsdom-environment.mjs` and its test.
- `scripts/verify-all.sh` and the shared client error Vitest configuration.

Documentation:

- Root setup and changelog documents.
- Repository configuration, GitHub workflow, quality gate, BFF, ESLint, testing, and setup guides.
- The Catalonia OS selective-backport audit, architecture fixes, Node.js 24 learning note, wave
  plan, prompts, and documentation indexes.

## 3. Commands Executed

The executable checks used the Node.js `24.20.0` binary directory and pnpm `10.28.0`.

```bash
pnpm install --lockfile-only
pnpm install --frozen-lockfile
pnpm format
pnpm format:check
pnpm runtime:check
pnpm dependencies:check
pnpm test:scripts
pnpm build
pnpm typecheck
pnpm test
pnpm lint
pnpm artifacts:clean
pnpm artifacts:check
pnpm clean
git diff --check
git status --short
```

Targeted Web, Backoffice, BFF, tooling, lockfile, dependency graph, and documentation inspections
were also run before the complete gate.

## 4. Passing Evidence

- Exact runtime and dependency-alignment preflights passed.
- Frozen pnpm installation passed in an isolated scratch copy.
- Production build: 36 successful tasks out of 36.
- Repository typecheck: 67 successful tasks out of 67.
- Root tooling regression suite: 8 passing tests out of 8.
- Workspace tests: 64 successful tasks out of 64.
- Repository lint: 36 successful tasks out of 36, with two pre-existing warnings and no errors.
- Formatting, test-participation policy, generated-artifact checks, and diff whitespace checks
  passed.
- The complete 13-step `pnpm clean` gate passed, preserved the visible Git status, and left the
  working tree free of generated build artifacts.
- The resulting runtime graph contains Next.js `15.5.25`, React `19.1.0`, React DOM `19.1.0`,
  `@nestjs/config` 4, and `@nestjs/swagger` 11 without unintended Next.js 16 or mixed React runtime
  installations.

## 5. Failures And Corrections

- An initial production build could not resolve Google Fonts because the sandbox denied network
  access. The same build was rerun with network access and passed; this was an environment failure,
  not a source failure.
- Initial lockfile regeneration exposed peer mismatches in the Coming Soon package, React DOM,
  NestJS integrations, and the obsolete React Hooks testing library. The manifests were corrected,
  the lockfile was regenerated, and the frozen install then completed without peer warnings.
- One new dependency-guard fixture originally targeted a manifest outside its intended test
  boundary. The fixture was corrected and the full eight-test tooling suite passed.
- A post-report check launched Corepack with the Node.js 24 binary while the child script still
  inherited the host shell's Node.js 14 `PATH`. The runtime check correctly failed closed. It and
  the tooling suite were immediately rerun with the exact Node.js `24.20.0` executable and passed.
  A direct formatter-wrapper invocation also lacked pnpm's `node_modules/.bin` path; the normal
  exact-runtime pnpm command passed.

## 6. Checks Not Performed

- Hosted GitHub Actions on Linux were not executed locally.
- No deployment, AWS mutation, Terraform initialization, Terraform plan, or production smoke test
  was performed.
- No application feature behavior, database migration, production data, or Catalonia OS working
  tree was changed.

## 7. Residual Risks And Follow-Up

- The Backoffice build still warns that its authentication middleware reaches Axios utilities
  using Node-only APIs in the Next.js Edge runtime. This is an open P1 compatibility fix in the
  backport audit.
- Next.js reports that its ESLint plugin is not detected during production builds even though the
  aligned FlatCompat presets are loaded and the explicit repository lint passes.
- Browserslist reports stale `caniuse-lite` data. Updating the browser database should be a bounded
  maintenance change rather than part of the runtime migration.
- Vitest 2 reports the upstream Vite CommonJS Node API deprecation warning. The existing Vitest
  major was intentionally retained to avoid widening this migration.
- Two existing `@typescript-eslint/no-explicit-any` warnings remain in the backend common-error
  package; there are no lint errors.
- The source-backed public type-entrypoint correction and safe backend error response remain open
  items from the audit.
- Terraform remains Wave 2. The initialization contract now requires an explicit yes/no answer:
  keep a neutral Terraform profile when selected, or remove the complete profile when declined.
  The neutral boilerplate, ownership manifest, persisted selection, idempotent removal command,
  and Terraform documentation still need to be implemented and tested together.

## Last Updated

9 September 2026 - Recorded the completed Node.js 24 migration and integrated QA evidence.
