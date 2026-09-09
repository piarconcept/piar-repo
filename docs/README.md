# Documentation Index

Start with `AI-context.md`.

## Entry Points

- `../README.md` - Project overview and quick start
- `AI-context.md` - Documentation index and rules

## Core Documents

### Product Concept

- `concept/Readme.md`
- `concept/initial-questions/README.md`
- `concept/apps/README.md`
- `concept/apps/example-app/README.md`

### Setup & Configuration

- `features/setup-project.md`
- `features/repository-configuration.md`
- `features/github-workflows.md`
- `features/bff-architecture.md`

### Development Guides

- `features/creating-packages.md`
- `features/creating-features-guide.md`
- `features/template-baseline-and-feature-migration.md`
- `features/component-library-development-guide.md`
- `features/testing-guide.md`
- `features/eslint-configuration.md`
- `features/quality-gates.md`
- `features/styling-configuration.md`
- `features/tailwind-v4-implementation.md`
- `features/context-engineering-protocol.md`
- `features/waves-workflow.md`

### Package Docs

- `features/domain-models.md`
- `features/domain-fields.md`
- `features/domain-dynamic-form.md`
- `features/infra-client-dynamic-table.md`
- `features/typeorm-migrations.md`
- `features/ui-components-atomic-design.md`
- `features/auth-card-refactoring.md`
- `features/health-feature.md`
- `features/auth-feature.md`
- `features/infra-backend-security.md`
- `features/infra-client-seo.md`
- `features/error-handling-system.md`
- `features/nextauth-authentication.md`

### Applications

- `features/web-bff-application.md`
- `features/backoffice-bff-application.md`

### Templates

- `features/TEMPLATE.md`

### Template Evolution Audits

- `features/catalonia-os-template-backport-audit.md`

### Execution Waves

- `waves/README.md`
- `waves/2026-06-07/README.md`
- `waves/2026-06-07/2026-06-07_wave_1/README.md`
- `waves/2026-06-07/2026-06-07_wave_1/2026-06-07_wave_1_prompt_AA.md`
- `waves/2026-09-09/README.md`
- `waves/2026-09-09/2026-09-09_wave_1/README.md`
- `waves/2026-09-09/2026-09-09_wave_1/2026-09-09_wave_1_prompt_AA.md`
- `waves/2026-09-09/2026-09-09_wave_1/2026-09-09_wave_1_prompt_QA.md`
- `waves/2026-09-09/2026-09-09_wave_1/implementation-report.md`
- `waves/template-day.md`
- `waves/template-wave.md`
- `waves/template-prompt.md`

### Architecture Fix Memory

- `architecture/fixes/README.md`
- `architecture/fixes/TEMPLATE.md`
- `architecture/fixes/2026-09-09-ci-process-preflight-self-match.md`
- `architecture/fixes/2026-09-09-framework-dependency-alignment.md`
- `architecture/fixes/2026-09-09-single-owner-dependency-builds.md`
- `architecture/fixes/2026-06-07-backoffice-feature-boundaries.md`
- `architecture/fixes/2026-05-08-bounded-list-contract.md`
- `architecture/fixes/2026-05-07-template-wave-clean-baseline.md`

### Operational Learning

- `learning-log/README.md`
- `learning-log/2026-09-09-node24-runtime-compatibility.md`
- `learning-log/2026-06-05-format-check-deleted-files.md`
- `learning-log/TEMPLATE.md`

## Maintenance Rules

1. Keep docs in English.
2. Update `AI-context.md` when adding/removing docs.
3. Add a Last Updated line to new docs.
4. Keep `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md` updated when relevant.
5. Document resolved architecture bugs in `docs/architecture/fixes/`.
6. Log non-trivial operational fixes and reusable debugging learnings in `docs/learning-log/`.
7. Use `docs/concept/` to define product intent before implementation waves.
8. New feature work and multi-agent execution plans should use `docs/waves/`.

## Last Updated

9 September 2026 - Indexed the Node.js 24 migration and its architecture/learning records
