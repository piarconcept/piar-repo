# PIAR Monorepo

> **🚀 Production-Ready Monorepo Template by [Piar Concept](https://piarconcept.com)**
> 
> A complete, AI-friendly starter kit for building modern web applications with Next.js, TypeScript, and a scalable monorepo architecture. Perfect for startups and businesses that need to move fast without compromising on quality.

Monorepo for PIAR project containing multiple applications and shared packages.

## 📁 Project Structure

```
piar-repo/
├── eslint.config.mjs          # Root ESLint configuration
├── vitest.config.ts           # Workspace test configuration
├── coverage/                  # Test coverage reports (gitignored)
├── apps/
│   ├── api/                   # Backend APIs
│   │   ├── web-bff/          # @piar/web-bff - BFF for web client (NestJS)
│   │   └── backoffice-bff/   # @piar/backoffice-bff - BFF for backoffice (NestJS)
│   ├── client/
│   │   ├── backoffice/       # @piar/backoffice - Admin application (Next.js)
│   │   └── web/              # @piar/web - Public website (Next.js)
│   └── sqs/                  # SQS queue handlers (data sync, migrations, etc.)
├── packages/
│   └── domain/
│       ├── models/           # @piar/domain-models - Shared entities
│       └── fields/           # @piar/domain-fields - Field configuration system
├── docs/                     # 📚 Documentation (AI Context)
│   ├── AI-context.md        # Main index and guidelines
│   └── features/            # Feature-specific documentation
└── turbo.json               # Turbo build configuration
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
Applications

#### @piar/web-bff
Backend for Frontend API for the web application (NestJS).

```bash
# Start in dev mode
pnpm --filter @piar/web-bff dev

# Build
pnpm turbo build --filter=@piar/web-bff
```

Runs on: `http://localhost:5000`  
[→ Documentation](./apps/api/web-bff/README.md)

#### @piar/backoffice-bff
Backend for Frontend API for the backoffice application (NestJS).

```bash
# Start in dev mode
pnpm --filter @piar/backoffice-bff dev

# Build
pnpm turbo build --filter=@piar/backoffice-bff
```

Runs on: `http://localhost:5050`  
[→ Documentation](./apps/api/backoffice-bff/README.md)

#### @piar/web
Public website application (Next.js).

```bash
# Start in dev mode
pnpm --filter @piar/web dev
```

[→ Documentation](./apps/client/web/README.md)

#### @piar/backoffice
Admin backoffice application (Next.js).

```bash
# Start in dev mode
pnpm --filter @piar/backoffice dev
```

[→ Documentation](./apps/client/backoffice/README.md)

### Shared Packages

#### @piar/domain-models
Shared domain entities and models used across all applications.

```bash
# Build
pnpm turbo build --filter=@piar/domain-models

# Watch mode
pnpm --filter @piar/domain-models dev
```

[→ Documentation](./packages/domain/models/README.md)

#### @piar/domain-fields
Field all apps in development mode
pnpm turbo dev

# Run specific app
pnpm --filter @piar/web-bff dev
pnpm --filter @piar/backoffice-bff dev
pnpm --filter @piar/backoffice dev
pnpm --filter @piar/web dev
```

### Development Ports

- **Web Client**: `http://localhost:3000`
- **Backoffice Client**: `http://localhost:3030`
- **Web BFF**: `http://localhost:5000`
- **Backoffice BFF**: `http://localhost:5050`14-step guide for new packages
- **[Testing Guide](./docs/features/testing-guide.md)** - Testing standards and examples
- **[ESLint Configuration](./docs/features/eslint-configuration.md)** - Linting setup and rules
- **[Domain Models](./docs/features/domain-models.md)** - Entity package documentation
- **[Domain Fields](./docs/features/domain-fields.md)** - Field configuration system
- **[Web BFF](./docs/features/web-bff-application.md)** - Web BFF API documentation
- **[Backoffice BFF](./docs/features/backoffice-bff-application.md)** - Backoffice BFF API documentation
```


- **Package Manager**: pnpm 10.28.0 with workspaces
- **Build System**: Turbo 2.7.4 for caching and orchestration
- **Frontend**: Next.js 16.1.2, React 19.2.3
- **Backend**: NestJS 11.x
- **Language**: TypeScript 5.9.3 (strict mode)
- **Testing**: Vitest 2.1.8 with @vitest/coverage-v8
- **Linting**: ESLint 9.x with TypeScript support
### Build Commands

```bash
# Build all packages and apps
pnpm turbweb-bff` - Web BFF API
- `@piar/backoffice-bff` - Backoffice BFF API
- `@piar/web` - Public website
- `@piar/backoffice` - Admin app
- `@piar/domain-models` - Domain entities
- `@piar/domain-fields` - Field configuration
pnpm turbo build --filter=@piar/backoffice
ead [docs/AI-context.md](./docs/AI-context.md) - Main guidelines
2. Check [repository-configuration.md](./docs/features/repository-configuration.md) - Critical rules
3. Document changes in `docs/features/`
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
1. R� About Piar Concept

This template was created and is maintained by **Piar Concept** - a team specialized in building fast, scalable web applications for startups and businesses.

### Need Help?

- 🌐 **Website**: [piarconcept.com](https://piarconcept.com)
- 💬 **Contact**: Visit our website to get in touch
- 🚀 **Services**: Custom development, architecture consulting, team augmentation

We offer:
- ✅ Implementation support for this template
- ✅ Custom feature development
- ✅ Architecture and scaling consulting
- ✅ Startup acceleration services
- ✅ AI integration and automation

**Feel free to contact us - we're here to help make your project successful!**

## 📝 License

MIT License - Copyright (c) 2026 Piar Concept

This template is free to use for any purpose. See the [LICENSE](./LICENSE) file for details.

### Attribution

While not required, we appreciate:
- 💙 Giving credit to Piar Concept in your project
- 🔗 Linking to [piarconcept.com](https://piarconcept.com)
- ⭐ Starring this repository
- 📢 Sharing your success story with us!

**Source Code**: This template was created by Piar Concept. For support, visit [piarconcept.com](https://piarconcept.com)

---

**Built with ❤️ by [Piar Concept](https://piarconcept.com)**Document changes in `docs/features/`

## 📝 License

ISC
