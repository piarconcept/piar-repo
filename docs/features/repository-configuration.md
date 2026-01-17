# Repository Configuration

## Purpose
Document critical repository configuration decisions and conventions that must be followed to maintain consistency across the monorepo.

## Status
- [x] Completed - Initial configuration documented

## Key Decisions

### Monorepo Configuration
- **Single pnpm-workspace.yaml**: Only at the root of the repository. Sub-apps should NOT have their own workspace files.
- **Package naming convention**: All packages use `@piar/` scope to avoid naming conflicts
  - Example: `@piar/backoffice`, `@piar/web`, `@piar/api`

### Package Manager
- **pnpm 10.28.0**: Specified in package.json `packageManager` field
- **Workspaces**: Configured in root `pnpm-workspace.yaml` to include:
  - `apps/**` - All applications
  - `packages/*` - Shared packages

### Build System
- **Turbo 2.7.4**: Used for coordinated builds and caching
- **Tasks configured**:
  - `dev`: Development mode (no cache, persistent)
  - `build`: Production builds with dependency ordering
  - `typecheck`: TypeScript validation across workspace

### Node Version
- **Node.js 20.x**: Required engine version specified in root package.json

## Technical Details

### File Structure Conventions
```
piar-repo/                    # Root only
├── .gitignore                # Root ignore file (comprehensive)
├── eslint.config.mjs         # Root ESLint configuration
├── vitest.config.ts          # Workspace test configuration
├── package.json              # Root package with workspace scripts
├── pnpm-workspace.yaml       # ONLY ONE - at root level
├── turbo.json                # Turbo configuration
└── apps/                     # Each app has its own package.json
    ├── api/
    ├── client/
    │   ├── backoffice/       # package.json: @piar/backoffice
    │   └── web/              # package.json: @piar/web
    └── sqs/                  # SQS queue handlers
```

### Critical Rules

🚫 **NEVER do these**:
1. Do NOT create `pnpm-workspace.yaml` in sub-folders
2. Do NOT use package names without the `@piar/` scope
3. Do NOT commit `.env` files (use `.env.example` instead)
4. Do NOT bypass turbo for builds (always use workspace scripts)

✅ **ALWAYS do these**:
1. Add new apps to the workspace structure defined in root `pnpm-workspace.yaml`
2. Use scoped package nand `lint` scripts in alle`)
3. Include `typecheck` script in all TypeScript packages
4. Update documentation when changing configuration

### Configuration Files

#### Root .gitignore
Ignores common build artifacts, dependencies, and environment files:
- `node_modules/`, `.turbo/`, `.next/`, `out/`, `.serverless/`
- `.env*` (except `.env.example`)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)

#### pnpm-workspace.yaml
```yaml
packages:
  - "apps/**"
  - "packages/*"
```

#### turbo.json
Defines task dependencies and caching strategy:
- `dev`: No cache, persistent
- `build`: Cached, depends on upstream builds
- `typecheck`: Depends on upstream typechecks
- `lint`: Cached, depends on upstream linting
- `test`: No cache, depends on builds, outputs coverage
- `test:coverage`: Same as test, explicit coverage output

## Usage

### Adding a New App
1. Create folder under `apps/` with appropriate structure
2. Create `package.json` with scoped name: `@piar/app-name`
3. Ensure workspace pattern in root `pnpm-workspace.yaml` matches
4. Add scripts: `dev`, `build`, `typecheck` (if applicable)
5. Document in `docs/features/`

### Adding a Shared Package
1. Create folder under `packages/` 
2. Create `package.json` with scoped name: `@piar/package-name`
3. Other apps can reference it as a dependency
4. Document in `docs/features/`

### Running Commands
```bash
# Install all dependencies
pnpm install

# Run command for specific package
pnpm --filter @piar/backoffice dev
pnpm --filter @piar/web build

# Run workspace commands via turbo
pnpm turbo build            # Build all packages
pnpm turbo typecheck        # Type check all packages
pnpm turbo lint             # Lint all packages
pnpm test                   # Run all tests
pnpm test:coverage -- --run # Run all tests with coverage

# Complete verification
pnpm verify                 # Runs all checks: install, build, typecheck, test, lint
```

## Related Documentation
- Main AI Context: `docs/AI-context.md`
- Project Setup: `docs/features/setup-proyecto.md`
- Testing Guide: `docs/features/testing-guide.md`
- ESLint Configuration: `docs/features/eslint-configuration.md`

## Notes
- This configuration supports efficient monorepo management with shared dependencies
- Turbo caching significantly speeds up repeated builds
- Scoped package names prevent naming conflicts in the pnpm workspace
- Root configurations (eslint.config.mjs, vitest.config.ts) are shared across packages

## Last Updated
15 January 2026 - Added ESLint and complete verification documentation
15 January 2026 - Fixed workspace configuration, removed duplicate pnpm-workspace.yaml files, added package scoping
