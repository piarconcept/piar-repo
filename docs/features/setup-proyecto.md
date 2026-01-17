# Project Setup

## Purpose
Document the initial project setup, structure, and baseline steps for new agents and developers working on this monorepo.

## Status
- [x] Completed - Initial setup documented

## Key Decisions
- **Monorepo structure**: Using a monorepo to share code between multiple apps
- **Package manager**: pnpm with workspaces for efficient dependency management
- **Build tool**: Turbo for faster builds and caching
- **Apps structure**: Separated into `api`, `client` (backoffice & web), and `sqs`

## Technical Details

### Architecture
This is a monorepo containing multiple applications and shared packages:
- **apps/api**: Backend API
- **apps/client/backoffice**: Admin/backoffice Next.js application
- **apps/client/web**: Public-facing Next.js application
- **apps/sqs**: SQS queue handlers for data synchronization, migrations, and async operations
- **packages/**: Shared packages used across apps
- **docs/**: Project documentation (MUST be kept updated)

### Dependencies
- **pnpm**: Fast, disk space efficient package manager
- **turbo**: High-performance build system for monorepos
- **Next.js**: React framework for client applications

### File Structure
```
piar-repo/
├── package.json           # Root package configuration
├── pnpm-lock.yaml        # Lock file for dependencies
├── pnpm-workspace.yaml   # Workspace configuration
├── turbo.json            # Turbo build configuration
├── apps/
│   ├── api/              # Backend API
│   ├── client/
│   │   ├── backoffice/   # Admin application
│   │   └── web/          # Public website
│   └── sqs/              # SQS queue handlers
├── docs/                 # Documentation (AI Context)
│   ├── AI-context.md     # Main index and guidelines
│   └── features/         # Feature-specific docs
└── packages/             # Shared packages
```

### Configuration
- **Language policy**: English only (except translations)
- **Documentation**: All determinant changes must be documented in `docs/`

## Usage

### Installation
```bash
# Install all dependencies
pnpm install
```

### Development
```bash
# Run specific app in development mode
pnpm --filter @app/backoffice dev
pnpm --filter @app/web dev
```

### Build
```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @app/backoffice build
```

### Test
```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run tests for specific package
pnpm --filter @piar/domain-models test
```

## CI/CD Integration

### Complete Verification Script

The repository includes a verification script that runs all checks:

```bash
# Run complete verification
pnpm verify
```

This executes:
1. ✅ Install dependencies
2. ✅ Build all packages
3. ✅ Type check
4. ✅ Run all tests with coverage
5. ✅ Lint all code

### Pre-commit Checklist
```bash
# 1. Type check
pnpm typecheck

# 2. Lint code
pnpm lint

# 3. Run tests
pnpm test

# 4. Build
pnpm build

# Or run all at once
pnpm verify
```

### CI Pipeline Example
```yaml
# Example GitHub Actions workflow
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 10.28.0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Type check
        run: pnpm typecheck
      
      - name: Lint code
        run: pnpm lint
      
      - name: Run tests with coverage
        run: pnpm test:coverage -- --run
      
      - name: Build
        run: pnpm build
```

All commands use Turbo for optimal caching and parallel execution.

## Related Documentation
- Main AI Context: `docs/AI-context.md`
- Template for new features: `docs/features/TEMPLATE.md`

## Notes
- Always check and update documentation when making structural changes
- Use the TEMPLATE.md when creating new feature documentation
- Keep the Features index in AI-context.md updated

## Last Updated
15 January 2026 - Added testing commands and CI/CD integration guidelines

