# PIAR Monorepo Template

Production-ready monorepo template for building modern web applications with Next.js, NestJS, and shared TypeScript packages.

## Used in Production

This fast-start template powers our own production platforms:

- piarconcept.com
- outsidecanvas.com
- Catalonia HC and its complete digital operating system

We also use this template as the foundation for client projects delivered through
[piarconcept.com](https://www.piarconcept.com). It remains the base for our MVPs and for projects
that we expect to scale hard. We keep feeding lessons learned from those repositories back into
the template and improving it with what we learn across our production codebases.

## Quick Start

Prerequisites:

- Node.js 24.20.0 (required via `nvm` — see `.nvmrc`)
- pnpm 10.28.0

Database requirements:

- This template is designed to run with **PostgreSQL** (`DATABASE_URL`).
- You can migrate to **MongoDB** (or another database), but you must adapt the data layer first:
  - Replace TypeORM setup and repository implementations.
  - Update feature modules, ports/adapters, and queries where needed.
- For a fast, production-ready setup, we recommend **[Neon](https://neon.tech)** as managed PostgreSQL (quick start, serverless, scalable).

```bash
# Optional but recommended
nvm use

pnpm runtime:check
pnpm install
pnpm dependencies:check
cp .env.example .env

pnpm verify
```

Run apps in dev mode:

```bash
pnpm --filter @piar/web dev
pnpm --filter @piar/backoffice dev
pnpm --filter @piar/web-bff dev
pnpm --filter @piar/backoffice-bff dev
```

## Repository Structure

```
piar-repo/
├── apps/
│   ├── api/                 # NestJS BFFs
│   ├── client/              # Next.js apps
│   └── sqs/                 # Queue handlers
├── packages/                # Shared packages
├── docs/                    # Documentation and architecture
├── scripts/                 # Tooling scripts
├── turbo.json               # Turbo config
└── tsconfig.base.json       # Base TS config
```

## Applications

- `@piar/web` - Public website (Next.js)
- `@piar/backoffice` - Admin app (Next.js)
- `@piar/web-bff` - Web BFF API (NestJS)
- `@piar/backoffice-bff` - Backoffice BFF API (NestJS)

## Current Template Baseline

Integrated and validated in this template:

- Node.js 24.20.0 with `.nvmrc`-driven local and CI runtime checks
- Next.js 15.5.25, React 19.1.0, NestJS 11, TypeScript 5.9, and pnpm 10.28.0
- Auth with access + refresh session flow
- Accounts admin module (CRUD + admin safety rules)
- Backoffice search (accounts collection)
- Contact submissions (public web + backoffice admin)
- Dynamic pages (public web + backoffice admin)
- Backoffice profile page with logout
- TypeORM repositories for account/contact-submission/dynamic-page

Implementation and migration guide:

- `docs/features/template-baseline-and-feature-migration.md`

## Shared Packages (highlights)

- `@piar/domain-models` - Domain entities
- `@piar/domain-fields` - Field configuration system
- `@piar/messages` - i18n messages
- `@piar/ui-config` - Tailwind CSS v4 shared config and design tokens
- `@piar/ui-components` - Shared UI components
- `@piar/layout` - Shared layout components
- `@piar/infra-client-seo` - SEO infrastructure (sitemap, robots, validators)
- `@piar/infra-backend-security` - Shared JWT security

## Common Commands

```bash
pnpm turbo build        # Build all packages/apps
pnpm typecheck          # Type check all packages/apps
pnpm lint               # Lint all packages/apps
pnpm test               # Run all tests without coverage
pnpm test:coverage      # Run all tests with coverage
pnpm runtime:check      # Reject local, engine, or CI Node.js drift
pnpm dependencies:check # Reject incompatible framework/package drift
pnpm test:scripts       # Run repository tooling regression tests
pnpm verify             # Full verification in an isolated copy with artifact hygiene
pnpm clean              # Format, clean generated artifacts, and finish with verify
```

## Ports (defaults)

- Web: Next.js default 3000
- Backoffice: Next.js default 3000 (set `PORT=3001` if running both)
- Web BFF: 5010
- Backoffice BFF: 5050

## Documentation

Start here: `docs/AI-context.md`

Before personalizing this template into a product, answer the required questions in
`docs/concept/initial-questions/README.md`, including whether to retain the optional
AWS/Terraform profile when that profile is installed.

Key docs:

- `docs/features/repository-configuration.md`
- `docs/features/creating-packages.md`
- `docs/features/creating-features-guide.md`
- `docs/features/waves-workflow.md`
- `docs/waves/README.md`
- `docs/features/testing-guide.md`
- `docs/features/tailwind-v4-implementation.md`

## Contributing

See `CONTRIBUTING.md` for workflow and commit rules.

## Security

See `SECURITY.md` for reporting vulnerabilities.

## Code of Conduct

See `CODE_OF_CONDUCT.md` for community guidelines.

## Commit Convention

This repo uses **Conventional Commits** enforced by commitlint.

Format:

```
type(scope): short description
```

Common types:

- `feat`: new feature
- `fix`: bug fix
- `chore`: tooling or maintenance
- `docs`: documentation only
- `refactor`: code change without behavior change
- `test`: add or update tests

Examples:

```
feat(ui): add button variants
fix(api): handle missing auth token
docs(readme): document commit convention
```

## License

MIT License. See `LICENSE`.

## About Piar Concept

This template is created and maintained by Piar Concept.

- Template page: [piar-turbo-template](https://www.piarconcept.com/resources/piar-turbo-template)
- Website: [piarconcept.com](https://www.piarconcept.com)
- Support: [support@piarconcept.com](mailto:support@piarconcept.com)

If you want to help us keep building and sharing ambitious open-source tooling:

- Contribute here: [Donations](https://www.piarconcept.com/donations)
