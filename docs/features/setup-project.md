# Project Setup

## Purpose

Document the initial project setup, structure, and baseline steps for new agents and developers working on this monorepo.

## Status

- [x] Completed - Initial setup documented

## Key Decisions

- **Monorepo structure**: Share code between multiple apps
- **Package manager**: pnpm with workspaces
- **Build tool**: Turbo for caching and orchestration
- **Runtime**: exact Node.js `24.20.0` from `.nvmrc`
- **Apps structure**: `api`, `client` (backoffice & web), and `sqs`

## Technical Details

### Architecture

This is a monorepo containing multiple applications and shared packages:

- **apps/api**: Backend APIs (NestJS)
- **apps/client/backoffice**: Admin Next.js application
- **apps/client/web**: Public Next.js application
- **apps/sqs**: SQS queue handlers
- **packages/**: Shared packages used across apps
- **docs/**: Project documentation (must be kept updated)

### File Structure

```
piar-repo/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
├── apps/
│   ├── api/
│   ├── client/
│   │   ├── backoffice/
│   │   └── web/
│   └── sqs/
├── docs/
│   ├── AI-context.md
│   └── features/
└── packages/
```

### Configuration

- **Language policy**: English only (except website translations)
- **Documentation**: Determinant changes must be documented in `docs/`

## Usage

### Installation

```bash
nvm use
pnpm runtime:check
pnpm install
pnpm dependencies:check
```

### Development

```bash
pnpm --filter @piar/backoffice dev
pnpm --filter @piar/web dev
```

### Build

```bash
pnpm build
pnpm --filter @piar/backoffice build
```

### Test

```bash
pnpm test
pnpm test:coverage
pnpm --filter @piar/domain-models test
```

## CI/CD Integration

### Complete Verification Script

```bash
pnpm verify
```

This executes:

1. Validate the exact Node.js, pnpm, workflow, and compatible dependency contract
2. Refuse to run while a repository-local dev/watch process can rewrite artifacts
3. Clean and check generated artifacts
4. Install dependencies from the frozen lockfile in an isolated scratch copy
5. Build all packages
6. Type check
7. Check formatting
8. Check test participation policy
9. Run repository tooling regression tests
10. Run all workspace tests without coverage
11. Lint all code
12. Clean and recheck generated artifacts
13. Verify local worktree status does not drift after artifact hygiene

### Pre-commit Checklist

```bash
pnpm typecheck
pnpm format:check
pnpm lint
pnpm test
pnpm build
pnpm clean
```

### CI Pipeline Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.28.0
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
      - name: Install dependencies
        run: pnpm install
      - name: Verify
        run: pnpm verify
      - name: Coverage
        run: pnpm test:coverage
```

## Related Documentation

- `docs/AI-context.md`
- `docs/features/TEMPLATE.md`

## Last Updated

9 September 2026 - Documented the exact Node.js 24 runtime and compatibility preflights
