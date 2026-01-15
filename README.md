# PIAR Monorepo

Monorepo for PIAR project containing multiple applications and shared packages.

## 📁 Project Structure

```
piar-repo/
├── eslint.config.mjs          # Root ESLint configuration
├── vitest.config.ts           # Workspace test configuration
├── coverage/                  # Test coverage reports (gitignored)
├── apps/
│   ├── api/                    # Backend API
│   ├── client/
│   │   ├── backoffice/        # Admin application (Next.js)
│   │   └── web/               # Public website (Next.js)
│   └── lambda/                # Serverless functions
├── packages/
│   └── domain/
│       └── models/            # @piar/domain-models - Shared entities
├── docs/                      # 📚 Documentation (AI Context)
│   ├── AI-context.md         # Main index and guidelines
│   └── features/             # Feature-specific documentation
└── turbo.json                # Turbo build configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- pnpm 10.28.0

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm turbo build

# Run all tests
pnpm test

# Verify everything works (install, build, typecheck, test)
pnpm verify

# Start development
pnpm turbo dev
```

## 📦 Packages

### @piar/domain-models
Shared domain entities and models used across all applications.

```bash
# Build
pnpm turbo build --filter=@piar/domain-models

# Watch mode
pnpm --filter @piar/domain-models dev
```

[→ Documentation](./packages/domain/models/README.md)

## 🏗️ Development

### Build Commands

```bash
# Build all packages and apps
pnpm turbo build

# Build specific package/app
pnpm turbo build --filter=@piar/backoffice

# Type check all

# Lint all code
pnpm turbo lint
```

### Test Commands

```bash
# Run all tests in the workspace
pnpm test

# Run all tests with coverage reports
pnpm test:coverage -- --run

# Run tests for specific package
pnpm --filter @piar/domain-models test
```

### Complete Verification

```bash
# Run all checks: install, build, typecheck, lint, test with coverage
# Run all checks: install, build, typecheck, test
pnpm verify
```

This runs:
1. `pnpm install` - Installs all dependencies
2. `pnpm turbo build` - Builds all packages
3. `pnpm typecheck` - Checks TypeScript types
4. `pnpm test:coverage -- --run` - Runs all tests with coverage
5. `pnpm lint` - Lints all code

Perfect for CI/CD or before committing.

### Running Apps

```bash
# Run backoffice in dev mode
pnpm --filter @piar/backoffice dev

# Run web in dev mode
pnpm --filter @piar/web dev
```

## 📚 Documentation

All documentation is in the `docs/` folder:

- **[AI-context.md](./docs/AI-context.md)** - Main index and guidelines (START HERE)
- **[Repository Configuration](./docs/features/repository-configuration.md)** - Critical setup rules
- **[Creating Packages](./docs/features/creating-packages.md)** - Guide for new packages
- **[Testing Guide](./docs/features/testing-guide.md)** - Testing standards and examples
- **[Domain Models](./docs/features/domain-models.md)** - Entity p14-step guide for new packages
- **[Testing Guide](./docs/features/testing-guide.md)** - Testing standards and examples
- **[ESLint Configuration](./docs/features/eslint-configuration.md)** - Linting setup and ru
### For AI Agents
Start with [docs/AI-context.md](./docs/AI-context.md) - it contains all critical guidelines and indexes all documentation.

## 🔧 Tech Stack
10.28.0 with workspaces
- **Build System**: Turbo 2.7.4 for caching and orchestration
- **Frontend**: Next.js 16.1.2, React 19.2.3
- **Language**: TypeScript 5.9.3 (strict mode)
- **Testing**: Vitest 2.1.8 with @vitest/coverage-v8
- **Linting**: ESLint 9.x with TypeScript supportact 19
- **Language**: TypeScript 5.9
- **Node**: 20.x

## 📋 Package Naming Convention

All packages use the `@piar/` scope:
- `@piar/domain-models` - Domain entities
- `@piar/backoffice` - Admin app
- `@piar/web` - Public website

## 🤝 Contributing

Before making changes:
1. Read [docs/AI-context.md](./docs/AI-context.md)
2. Follow [Repository Configuration](./docs/features/repository-configuration.md)
3. Document changes in `docs/features/`

## 📝 License

ISC
