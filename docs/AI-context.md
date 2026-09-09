# AI Context - PIAR Monorepo

Start here. This file is the canonical index and rules for documentation and development decisions.

## Repository language policy

- The entire repository must be in English unless content is a translation for the website in other languages.

## Documentation Guidelines (CRITICAL)

1. **Single Source of Truth**: All determinant decisions, architectural choices, and project rules must live in `docs/`.
2. **Mandatory updates**: When you change structure, architecture, workflows, tooling, or conventions, update the relevant docs.
3. **Structure**:
   - `docs/AI-context.md` = master index and rules
   - `docs/concept/` = folder-based product concept, discovery questions, app ownership, product decisions, and build-plan inputs
   - `docs/features/` = detailed docs per topic
   - `docs/waves/` = multi-agent execution wave plans, templates, and dated prompt batches
   - `docs/architecture/fixes/` = resolved architecture bugs and structural lessons
   - `docs/learning-log/` = resolved incidents, regressions, and non-obvious fixes
4. **Naming**: Use kebab-case filenames (e.g., `authentication-flow.md`).
5. **Index maintenance**: Update this index whenever a doc is added/removed.
6. **Architecture learning capture**: Every resolved architecture bug must be documented in `docs/architecture/fixes/`.
7. **Operational learning capture**: Any non-trivial fix, incident, workaround, or reusable debugging lesson that is not primarily architectural must be logged in `docs/learning-log/`.

## Documentation Index

### Product Concept

1. `concept/Readme.md` - Product concept entrypoint, folder tree, app ownership contract, discovery questions, and build-plan workflow
2. `concept/initial-questions/README.md` - Required initial question gate, including the removable Terraform profile decision, before template personalization
3. `concept/apps/README.md` - Concept app discovery, app map template, and app ownership rules
4. `concept/apps/example-app/README.md` - Example app contract only, not a required product app

### Setup & Configuration

5. `features/setup-project.md` - Initial setup and project structure
6. `features/repository-configuration.md` - Monorepo rules and conventions
7. `features/github-workflows.md` - CI/CD workflows
8. `features/bff-architecture.md` - BFF architecture patterns

### Development Guides

9. `features/creating-packages.md` - 14-step guide for creating packages
10. `features/creating-features-guide.md` - Feature creation with Clean Architecture
11. `features/template-baseline-and-feature-migration.md` - Current baseline and migration workflow
12. `features/component-library-development-guide.md` - Component library workflow
13. `features/testing-guide.md` - Testing standards and examples
14. `features/eslint-configuration.md` - ESLint configuration and linting
15. `features/quality-gates.md` - Formatting, commit hooks, and commit rules
16. `features/styling-configuration.md` - Styling approach overview
17. `features/tailwind-v4-implementation.md` - Tailwind v4 implementation details
18. `features/context-engineering-protocol.md` - Rules for documenting important fixes and learnings
19. `features/waves-workflow.md` - Wave-first planning workflow for feature work and multi-agent execution

### Execution Waves

20. `waves/README.md` - Canonical execution waves contract
21. `waves/2026-06-07/README.md` - Backoffice accounts/search feature-boundary refactor day plan
22. `waves/2026-06-07/2026-06-07_wave_1/README.md` - Accounts/search API package migration wave
23. `waves/2026-06-07/2026-06-07_wave_1/2026-06-07_wave_1_prompt_AA.md` - Accounts/search feature-boundary implementation prompt
24. `waves/2026-09-09/README.md` - Node.js 24 runtime migration day plan
25. `waves/2026-09-09/2026-09-09_wave_1/README.md` - Exact runtime, dependency, and build-ownership migration wave
26. `waves/2026-09-09/2026-09-09_wave_1/2026-09-09_wave_1_prompt_AA.md` - Node.js 24 implementation prompt
27. `waves/2026-09-09/2026-09-09_wave_1/2026-09-09_wave_1_prompt_QA.md` - Node.js 24 integrated QA prompt
28. `waves/2026-09-09/2026-09-09_wave_1/implementation-report.md` - Node.js 24 implementation and verification evidence
29. `waves/template-day.md` - Template for day-level wave orchestration
30. `waves/template-wave.md` - Template for a single wave definition
31. `waves/template-prompt.md` - Template for a standalone wave prompt

### Package Documentation

32. `features/domain-models.md` - `@piar/domain-models`
33. `features/domain-fields.md` - `@piar/domain-fields`
34. `features/ui-components-atomic-design.md` - `@piar/ui-components`
35. `features/auth-card-refactoring.md` - AuthCard refactor notes
36. `features/health-feature.md` - Health feature architecture
37. `features/auth-feature.md` - Auth feature architecture
38. `features/infra-backend-security.md` - Backend security package
39. `features/infra-client-seo.md` - SEO infrastructure
40. `features/error-handling-system.md` - Error handling system
41. `features/nextauth-authentication.md` - NextAuth v5 in backoffice

### Applications

42. `features/web-bff-application.md` - Web BFF documentation
43. `features/backoffice-bff-application.md` - Backoffice BFF documentation

### Templates

44. `features/TEMPLATE.md` - Template for new docs

### Architecture Fix Memory

45. `architecture/fixes/README.md` - Index and rules for architecture fix notes
46. `architecture/fixes/TEMPLATE.md` - Template for architecture fix notes
47. `architecture/fixes/2026-09-09-ci-process-preflight-self-match.md` - Snapshot-based process classification that does not match its own Linux CI command line
48. `architecture/fixes/2026-09-09-framework-dependency-alignment.md` - Repository-owned Next, React, Nest integration, and pnpm compatibility contract
49. `architecture/fixes/2026-09-09-single-owner-dependency-builds.md` - Graph-owned shared dependency build coordination
50. `architecture/fixes/2026-06-07-backoffice-feature-boundaries.md` - Backoffice accounts/search feature package boundary fix
51. `architecture/fixes/2026-05-08-bounded-list-contract.md` - Bounded collection-query contract and removal of whole-table `getAll` reads
52. `architecture/fixes/2026-05-07-template-wave-clean-baseline.md` - Wave workflow, clean command, and verification hardening baseline

### Operational Learning

53. `learning-log/README.md` - Index of resolved incidents and important fixes
54. `learning-log/2026-09-09-node24-runtime-compatibility.md` - Exact Node.js 24 migration and native compatibility guardrails
55. `learning-log/2026-06-05-format-check-deleted-files.md` - Format check failed on tracked files deleted in the working tree
56. `learning-log/TEMPLATE.md` - Template for learning-log entries

### Template Evolution Audits

57. `features/catalonia-os-template-backport-audit.md` - Selective backport audit, fixed-bug inventory, and Terraform extraction roadmap from Catalonia OS

## Repository Governance

- `CONTRIBUTING.md` - Contribution workflow and commit rules
- `AGENTS.md` - Agent entrypoint that redirects to this file and the wave workflow
- `SECURITY.md` - Vulnerability reporting
- `CHANGELOG.md` - Template change history
- `CODE_OF_CONDUCT.md` - Community standards

## Quick Reference

### Defining a Product Concept

1. Read `concept/initial-questions/README.md`
2. Ask unanswered initial questions before changing template identity or product assumptions
3. Read `concept/Readme.md`
4. Fill the concept folders from product idea to build plan
5. Track unresolved product questions in `concept/questions/open-questions.md`
6. Create implementation waves only after the first build scope is clear
7. Keep concept docs aligned when product intent changes during implementation

### Creating a New Component

1. Read `features/component-library-development-guide.md`
2. Identify duplication (3+ uses)
3. Choose level: atom/molecule/organism
4. Create in `packages/ui/components/src/{level}/`
5. Export in index.ts
6. Build and document

### Creating a New Feature

1. Read `concept/Readme.md` when the feature depends on product assumptions
2. Read `features/creating-features-guide.md`
3. Read `features/template-baseline-and-feature-migration.md`
4. Read `features/waves-workflow.md`
5. Create or update `docs/waves/` when the feature is larger than a tiny linear fix
6. Create required layers (`domain`, `fields`, `repositories`, feature packages, BFF wiring)
7. Follow Clean Architecture
8. Document in `docs/features/`
9. Update this index

### Creating a New Package

1. Read `features/creating-packages.md`
2. Follow the 14 steps
3. Document in `docs/features/`
4. Update this index

### Documenting an Important Fix

1. Read `features/context-engineering-protocol.md`
2. If the root cause is architectural, create or update a note in `docs/architecture/fixes/`
3. If the fix is non-architectural but reusable, create or update a note in `docs/learning-log/`
4. Use the matching template in that directory
5. Update the relevant wave plan if the work was executed through multi-agent prompts
6. Update the relevant feature doc if the fix changes long-term behavior
7. Update this index only when docs are added or removed

## Before Making Changes

1. Check `features/repository-configuration.md`
2. Read `concept/initial-questions/README.md` and ask unanswered required questions before initializing a product, replacing template identity, choosing apps, changing database configuration, or starting product features
3. Review `docs/concept/` when changing product assumptions, app surfaces, domain language, or build scope
4. Review relevant docs in `docs/features/`
5. Review `docs/waves/` when planning or resuming feature work, multi-agent execution, or staged migrations
6. Review `docs/architecture/fixes/` when working on a repeated or structural failure
7. Review `docs/learning-log/` when working on a repeated or unclear operational failure
8. Update docs after changes

## Last Updated

9 September 2026 - Indexed the Node.js 24 migration wave, architecture fixes, and compatibility learning
