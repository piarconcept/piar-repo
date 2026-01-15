# Documentation Index

> **Quick Link**: Start with [AI-context.md](AI-context.md) for the complete guide

## 📖 Documentation Structure

### Entry Points
| File | Purpose | Audience |
|------|---------|----------|
| [../README.md](../README.md) | Project overview and quick start | Developers |
| [AI-context.md](AI-context.md) | Main documentation index | AI Agents & Developers |

### Core Documentation

#### 🏗️ Setup & Configuration
| Document | Status | Description |
|----------|--------|-------------|
| [setup-proyecto.md](features/setup-proyecto.md) | ✅ Complete | Initial project setup, structure, and commands |
| [repository-configuration.md](features/repository-configuration.md) | ⚠️ CRITICAL | Monorepo configuration, naming conventions, rules |

#### 📦 Development Guides
| Document | Status | Description |
|----------|--------|-------------|
| [creating-packages.md](features/creating-packages.md) | 📦 GUIDE | 14-step guide for creating new workspace packages |
| [testing-guide.md](features/testing-guide.md) | ✅ Complete | Testing standards, patterns, and Vitest setup |
| [eslint-configuration.md](features/eslint-configuration.md) | ✅ Complete | ESLint setup, rules, and linting across monorepo |

#### 📚 Package Documentation
| Package | Document | Status | Description |
|---------|----------|--------|-------------|
| `@piar/domain-models` | [domain-models.md](features/domain-models.md) | ✅ Complete | Shared domain entities and models |

#### 📝 Templates & Resources
| Document | Purpose |
|----------|---------|
| [TEMPLATE.md](features/TEMPLATE.md) | Template for creating new feature documentation |

## 🔍 Quick Find

### I want to...

**Set up the project for the first time**
→ [setup-proyecto.md](features/setup-proyecto.md)

**Understand the monorepo structure and rules**
→ [repository-configuration.md](features/repository-configuration.md)

**Create a new shared package**
→ [creating-packages.md](features/creating-packages.md)

**Use domain entities in my app**
→ [domain-models.md](features/domain-models.md)

**Document a new feature**
→ [TEMPLATE.md](features/TEMPLATE.md)

**Get AI agent guidelines**
→ [AI-context.md](AI-context.md)

## 📂 Folder Structure

```
docs/
├── README.md              # This file - Quick index
├── AI-context.md         # Main entry point for AI agents
└── features/             # Feature-specific documentation
    ├── TEMPLATE.md
    ├── setup-proyecto.md
    ├── repository-configuration.md
    ├── creating-packages.md
    └── domain-models.md
```

## 🎯 Documentation Standards

All documentation follows these principles:

1. ✅ **Single Source of Truth** - No duplicate information
2. ✅ **Up to Date** - Last updated date on each doc
3. ✅ **Structured** - Follow the TEMPLATE.md format
4. ✅ **Indexed** - All docs listed in AI-context.md
5. ✅ **Clear** - Written for both humans and AI

## 🔄 Maintenance

When adding new documentation:
1. Create file in `features/` following TEMPLATE.md
2. Add entry to [AI-context.md](AI-context.md)
3. Add entry to this file
4. Update last modified date

---

**Last Updated**: 15 January 2026
