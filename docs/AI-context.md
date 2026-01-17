# AI Context - PIAR Monorepo

**START HERE** - This file is the main index for AI agents and developers working on this project.

## Repository language policy
- The entire repository must be in English unless content is a translation for the website in other languages.

## Documentation Structure

```
docs/
├── AI-context.md          # 👈 You are here - Main index
└── features/              # Detailed documentation
    ├── TEMPLATE.md                    # Template for new docs
    ├── setup-proyecto.md              # Project setup
    ├── repository-configuration.md    # ⚠️ CRITICAL configuration
    ├── creating-packages.md           # 📦 Package creation guide
    └── domain-models.md               # Domain entities package
```

## Documentation Guidelines (CRITICAL)

**ALWAYS follow these rules to maintain coherence and avoid inconsistencies:**

1. **Single Source of Truth**: All determinant decisions, architectural choices, and project rules MUST be documented in `docs/` or `docs/features/`.

2. **Mandatory documentation updates**: When you make ANY of the following changes, you MUST update the relevant documentation:
   - Add or modify project structure
   - Make architectural decisions
   - Define coding standards or conventions
   - Configure build tools or dependencies
   - Establish workflows or processes
   - Create new features or major functionality

3. **Documentation structure**:
   - `docs/AI-context.md` (this file): Index and main guidelines for AI agents
   - `docs/features/`: Detailed documentation for specific features, decisions, or components
   - Each feature should have its own dedicated markdown file in `docs/features/`

4. **Before making changes**: ALWAYS check existing documentation first to ensure consistency.

5. **After making changes**: ALWAYS update or create documentation to reflect what was done.

6. **Naming convention**: Use descriptive, kebab-case filenames (e.g., `authentication-flow.md`, `database-schema.md`)

7. **Keep index updated**: When adding new documentation files, IMMEDIATELY update the Features section below.

## Documentation Index

### 🏗️ Setup & Configuration (Read First)
1. **[setup-proyecto.md](features/setup-proyecto.md)** - Initial project setup and structure
2. **[repository-configuration.md](features/repository-configuration.md)** ⚠️ **CRITICAL** - Monorepo rules and conventions
3. **[github-workflows.md](features/github-workflows.md)** - GitHub Actions CI/CD workflows
4. **[bff-architecture.md](features/bff-architecture.md)** - Backend for Frontend (BFF) pattern and implementation

### 📦 Development Guides
4. **[creating-packages.md](features/creating-packages.md)** - Complete guide for creating new packages (14 steps)
5. **[creating-features-guide.md](features/creating-features-guide.md)** - Guide for creating features with Clean Architecture (use-cases, controllers, modules)
6. **[testing-guide.md](features/testing-guide.md)** - Testing standards, patterns, and examples with Vitest
7. **[eslint-configuration.md](features/eslint-configuration.md)** - ESLint setup, rules, and linting across monorepo

### 📚 Package Documentation
8. **[domain-models.md](features/domain-models.md)** - `@piar/domain-models` package documentation
9. **[domain-fields.md](features/domain-fields.md)** - `@piar/domain-fields` package documentation (field configuration system)

### 🎯 Features
10. **[health-feature.md](features/health-feature.md)** - Health check feature with Clean Architecture (configuration/api/client)

### 🏢 Applications
13. **[TEMPLATE.md](features/TEMPLATE.md)** - Template for creating new documentation

## Quick Reference

### Creating a New Feature
1. Read: [creating-features-guide.md](features/creating-features-guide.md)
2. Create three packages: `configuration/`, `api/`, `client/`
3. Follow Clean Architecture pattern with use-cases
4. Document in `docs/features/`
5. Update this index

### Creating a New Package
1. Read: [creating-packages.md](features/creating-packages.md)
2. Follow the 14 steps
3. Document in `docs/features/`ackage
1. Read: [creating-packages.md](features/creating-packages.md)
2. Follow the 14 steps
3. Document in `docs/features/`
4. Update this index
4. Update this index

### Adding a New Feature
1. Create file in `docs/features/`
2. Use [TEMPLATE.md](features/TEMPLATE.md) as base
3. Update this index

### Before Making Changes
1. Check [repository-configuration.md](features/repository-configuration.md)
2. Review existing docs in `docs/features/`
3. Understand current structure

## How to Use This Documentation

For **AI Agents**:
1. Start here - read this entire file
2. Read [repository-configuration.md](features/repository-configuration.md) next (CRITICAL)
3. Check relevant feature docs before making changes
4. Always update docs after making changes

For **Developers**:
1. Start with [README.md](../README.md) at root
2. Come here for detailed guidelines
3. Reference specific feature docs as needed

## Rules Summary

✅ **ALWAYS DO**:
- Document all decisions in `docs/features/`
- Update this index when adding docs
- Follow existing patterns and conventions
- Check docs before making changes

❌ **NEVER DO**:
- Make structural changes without documenting
- Skip updating documentation
- Create duplicate documentation
- Ignore existing conventions
