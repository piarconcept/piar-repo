# Repository Configuration

## Purpose

Document critical repository configuration decisions and conventions that must be followed to maintain consistency across the monorepo.

## Status

- [x] Completed - Initial configuration documented

## Key Decisions

### Monorepo Configuration

- **Single pnpm-workspace.yaml**: Only at the root. Sub-apps must not have their own workspace files.
- **Package naming**: All packages use the `@piar/` scope.

### Package Manager

- **pnpm 10.28.0**: Specified in root `package.json`.
- **Workspaces**: Root `pnpm-workspace.yaml` includes:
  - `apps/**`
  - `packages/**`
- **Override ownership**: Repository-wide pnpm overrides live only in root
  `pnpm-workspace.yaml`, not in `package.json`.
- **TypeScript base config**: All `tsconfig.json` extend `tsconfig.base.json`

### Build System

- **Turbo 2.7.4** for builds and caching
- **Tasks**:
  - `dev`: Development mode (no cache, persistent)
  - `build`: Production builds with dependency ordering
  - `typecheck`: TypeScript validation across workspace
  - `lint`: Linting across workspace
  - `test`: Tests without coverage
  - `test:coverage`: Tests with coverage
- `build`, `typecheck`, `test`, `test:coverage`, `dev`, and `test:watch` finish upstream builds
  before running consumers.

### Node Version

- **Node.js 24.20.0**: Exact local runtime in `.nvmrc`
- **Engine range**: `>=24.20.0 <25` in every manifest that owns a runtime
- **CI ownership**: GitHub Actions uses `node-version-file: '.nvmrc'`
- **Validation**: `pnpm runtime:check` rejects process, manifest, package-manager, and workflow
  drift before expensive verification starts

### Compatible Framework Contract

- Next.js and `eslint-config-next`: `15.5.25`
- React and React DOM runtime: `19.1.0`
- NestJS core: `11.x`
- `@nestjs/config`: `4.x`; `@nestjs/swagger`: `11.x`
- TypeScript: `5.9.x`; Node typings: `24.x`

Run `pnpm dependencies:check` after dependency edits. The guard rejects Next 16 leakage, mixed
React runtime ownership, old Nest integration branches, obsolete React hooks testing utilities,
and Node type drift.

## File Structure Conventions

```
piar-repo/
├── .gitignore
├── eslint.config.mjs
├── vitest.config.ts
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── apps/
    ├── api/
    ├── client/
    │   ├── backoffice/
    │   └── web/
    └── sqs/
```

## Critical Rules

🚫 **NEVER**:

1. Create `pnpm-workspace.yaml` in sub-folders
2. Use unscoped package names (must be `@piar/*`)
3. Commit `.env` files (use `.env.example`)
4. Bypass Turbo for workspace builds

✅ **ALWAYS**:

1. Add new apps under `apps/` and packages under `packages/`
2. Use scoped package names
3. Include `typecheck` in TypeScript packages
4. Update documentation when configuration changes
5. Use `next/link` instead of raw `<a>` for internal navigation in Next.js apps

## Configuration Files

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/**'
  - 'packages/**'
```

### turbo.json

Defines task dependencies and caching:

- `dev`: no cache, persistent
- `build`: cached, depends on upstream builds
- `typecheck`: depends on upstream builds and upstream typechecks
- `lint`: cached, depends on upstream linting
- `test:coverage`: no cache, outputs coverage

App `build` and `dev` scripts route dependency preparation through
`scripts/prepare-workspace.mjs`. Under Turbo, the coordinator does not launch a nested compiler
because the task graph already owns `^build`. A direct app command invokes Turbo exactly once for
that app's dependencies. This prevents sibling applications from concurrently rewriting shared
`dist` output.

## Usage

### Adding a New App

1. Create folder under `apps/`
2. Create `package.json` with name `@piar/app-name`
3. Add scripts: `dev`, `build`, `typecheck`
4. Document in `docs/features/`

### Adding a Shared Package

1. Create folder under `packages/`
2. Create `package.json` with name `@piar/package-name`
3. Document in `docs/features/`

### Running Commands

```bash
pnpm install
pnpm runtime:check
pnpm dependencies:check
pnpm test:scripts
pnpm turbo build
pnpm turbo typecheck
pnpm turbo lint
pnpm test
pnpm test:coverage -- --run
pnpm verify               # artifact hygiene, install, build, typecheck, format check, test policy, test, lint
pnpm clean                # format, clean artifacts, check artifacts, verify
```

## Related Documentation

- `docs/AI-context.md`
- `docs/features/setup-project.md`
- `docs/features/testing-guide.md`
- `docs/features/eslint-configuration.md`
- `docs/features/quality-gates.md`
- `docs/features/waves-workflow.md`

## Last Updated

9 September 2026 - Added Node.js 24, dependency alignment, and single-owner build contracts
