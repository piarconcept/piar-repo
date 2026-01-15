# Creating New Packages

## Purpose
Step-by-step guide for creating new shared packages in the monorepo. Ensures consistency and proper integration with the workspace.

## Status
- [x] Completed - Comprehensive guide based on domain-models package

## Package Types

### 1. **Shared Libraries** (TypeScript/JavaScript)
Examples: domain-models, utils, validation
- Pure TypeScript/JavaScript code
- Compiled to dist/
- Used across multiple apps

### 2. **Component Libraries** (React/UI)
Examples: ui-components, design-system
- React components
- Used in web/backoffice apps

### 3. **Configuration Packages**
Examples: eslint-config, tsconfig
- Shared configurations
- Minimal or no build step

## Step-by-Step Guide

### Step 1: Create Package Structure

```bash
# Navigate to packages directory
cd packages/

# Create package folder (use descriptive name)
mkdir -p {category}/{package-name}

# Example: packages/domain/models (category + name)
# Example: packages/ui/components
# Example: packages/utils/validation
```

### Step 2: Create package.json

Create `packages/{category}/{package-name}/package.json`:

```json
{
  "name": "@piar/{package-name}",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "dev": "tsc --watch",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "vitest": "^2.1.8",
    "@vitest/coverage-v8": "^2.1.8"
  }
}
```

**Key points:**
- **Name**: Must use `@piar/` scope
- **Private**: `true` for internal packages
- **Main/Types**: Point to compiled output
- **Exports**: Modern module exports
- **Scripts**: Consistent across packages

### Step 3: Create tsconfig.json

Create `packages/{category}/{package-name}/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Adjust if needed:**
- For React packages: add `"jsx": "react-jsx"` and `"dom"` to lib
- For Node.js packages: adjust target and lib accordingly

### Step 4: Create Source Files

Create your package source structure:

```bash
# Create src directory
mkdir -p packages/{category}/{package-name}/src

# Create main export file
touch packages/{category}/{package-name}/src/index.ts
```

Example structure:
```
packages/{category}/{package-name}/
├── src/
│   ├── index.ts          # Main export
│   ├── {feature}/
│   │   ├── index.ts
│   │   └── *.ts
│   └── ...
```

### Step 5: Create turbo.json (Optional but Recommended)

Create `packages/{category}/{package-name}/turbo.json` to extend root configuration:

```json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

**Benefits:**
- Explicit cache outputs for this package
- Can override root turbo configuration if needed
- Better control over build behavior

### Step 6: Create .gitignore

Create `packages/{category}/{package-name}/.gitignore`:

```
node_modules
dist
*.log
.turbo
```

### Step 7: Create README.md

Create `packages/{category}/{package-name}/README.md`:

```markdown
# @piar/{package-name}

Brief description of what this package does.

## Usage

\`\`\`typescript
import { Something } from '@piar/{package-name}';
\`\`\`

## Development

\`\`\`bash
# Build
pnpm turbo build --filter=@piar/{package-name}

# Watch mode
pnpm --filter @piar/{package-name} dev

# Type check
pnpm --filter @piar/{package-name} typecheck

# Lint
pnpm --filter @piar/{package-name} lint

# Test
pnpm --filter @piar/{package-name} test
\`\`\`
```

### Step 8: Register in Workspace

The package should automatically be detected by pnpm workspace (configured in `pnpm-workspace.yaml`):

```yaml
packages:
  - "apps/**"
  - "packages/*"      # Matches packages/category/name
```

If using nested structure like `packages/category/name`, update to:
```yaml
packages:
  - "apps/**"
  - "packages/**"     # Two asterisks for nested folders
```

**Install dependencies** to register the package:
```bash
pnpm install
```

### Step 9: Verify Root Turbo Configuration

Ensure root `turbo.json` includes your package's output directory:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", ".serverless/**"]
    }
  }
}
```

The `dist/**` pattern should cover most packages.

### Step 10: Build the Package

```bash
# Build with turbo (recommended)
pnpm turbo build --filter=@piar/{package-name}

# Or build all packages
pnpm turbo build
```

### Step 11: Create ESLint Configuration

Create `packages/{category}/{package-name}/eslint.config.mjs`:

```javascript
import rootConfig from '../../../eslint.config.mjs';

/**
 * ESLint configuration for @piar/{package-name}
 * Extends root configuration
 */
export default rootConfig;
```

This reuses the root ESLint configuration for consistency.

### Step 12: Document the Package

1. Create documentation file:
   ```bash
   touch docs/features/{package-name}.md
   ```

2. Use the template in `docs/features/TEMPLATE.md`

3. Update `docs/AI-context.md` to add the new package:
   ```markdown
   ## Features
   - Your new package: `docs/features/{package-name}.md`
   ```

### Step 13: Add Tests (Recommended)

1. Tests dependencies are already in package.json from Step 2

2. Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config';
   
   export default defineConfig({
     test: {
       globals: true,
       environment: 'node',
       coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
         exclude: [
           'dist', 'node_modules', 
           '**/*.d.ts', '**/*.config.*', 
           '**/tests/**', 'vitest.config.ts', 
           'package.json', 'tsconfig.json', 'turbo.json', 
           '.gitignore', 'README.md', 'docs/**', 'coverage/**',
           '**/index.ts',
         ],
         thresholds: {
           lines: 100,
           functions: 100,
           branches: 100,
           statements: 100
         }
       }
     }
   });
   ```
   
   **Note**: Exclude `**/index.ts` from coverage as they're typically barrel exports

3. Add tes4 scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:watch": "vitest --watch",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

4. Create tests folder and write tests:
   ```bash
   mkdir tests
   touch tests/my-feature.test.ts
   ```

5. See [testing-guide.md](testing-guide.md) for detailed examples

### Step 13: Use in Other Apps

1. Add to consumer's `package.json`:
   ```json
   {
     "dependencies": {
       "@piar/{package-name}": "workspace:*"
     }
   }
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Import and use:
   ```typescript
   import { YourExport } from '@piar/{package-name}';
   ```

## Package Naming Conventions

### General Rules
- **Scope**: Always use `@piar/` prefix
- **Kebab-case**: Use hyphens, not underscores or camelCase
- **Descriptive**: Name should indicate purpose
- **Short**: Prefer concise names

### Examples
```
@piar/domain-models       ✅ Good
@piar/ui-components       ✅ Good
@piar/validation-utils    ✅ Good
@piar/eslint-config       ✅ Good

@piar/domainModels        ❌ Bad (camelCase)
@piar/domain_models       ❌ Bad (underscores)
domain-models             ❌ Bad (no scope)
@piar/utils               ⚠️  Too generic
```

## Package Categories (Suggested)

Organize packages by category for better structure:

```
packages/
├── domain/              # Domain logic
│   └── models/
├── ui/                  # UI components
│   └── components/
├── utils/               # Utilities
│   ├── validation/
│   └── formatting/
├── config/              # Configurations
│   ├── eslint-config/
│   └── tsconfig/
└── api/                 # API clients
    └── client/
```

## Common Issues and Solutions

### Issue: Package not found by turbo
**Solution**: Run `pnpm install` to register the package in workspace

### Issue: TypeScript errors in consumers
**Solution**: Ensure package is built (`pnpm turbo build --filter=@piar/{package-name}`)

### Issue: Circular dependencies
**Solution**: Restructure packages or use dependency injection

### Issue: Changes not reflected
**Solution**: Clear turbo cache: `pnpm turbo build --force`

## Best Practices

1. ✅ **Always use `@piar/` scope** for package names
2. ✅ **Keep packages focused** - one responsibility per package
3. ✅ **Use TypeScript** for type safety across workspace
4. ✅ **Include README** with usage examples
5. ✅ **Document in docs/features/** for AI context
6. ✅ **Use turbo for builds** to leverage caching
7. ✅ **Version carefully** - changes affect all consumers
8. ✅ **Test before committing** - build all consumers
9. ✅ **Keep dependencies minimal** - reduce coupling
10. ✅ **Export only public API** - hide implementation details

## Checklist for New Package

- [ ] Package folder created in `packages/`
- [ ] `package.json` with `@piar/` scope and all scripts created
- [ ] `tsconfig.json` configured
- [ ] `turbo.json` created (extends root config)
- [ ] `.gitignore` created (dist, node_modules, .turbo, coverage)
- [ ] `eslint.config.mjs` created (extends root config)
- [ ] `vitest.config.ts` created for testing with coverage thresholds
- [ ] `src/` directory with code
- [ ] `tests/` directory with test files
- [ ] `README.md` with usage examples
- [ ] `pnpm install` executed
- [ ] Package builds successfully: `pnpm turbo build --filter=@piar/{package-name}`
- [ ] Type check passes: `pnpm --filter @piar/{package-name} typecheck`
- [ ] Linting passes: `pnpm --filter @piar/{package-name} lint`
- [ ] Tests pass with 100% coverage: `pnpm --filter @piar/{package-name} test:coverage`
- [ ] Documentation created in `docs/features/`
- [ ] `docs/AI-context.md` updated with new package
- [ ] Tested in at least one consumer app

## Related Documentation
- Domain Models Package: `docs/features/domain-models.md` (example)
- Repository Configuration: `docs/features/repository-configuration.md`
- Project Setup: `docs/features/setup-proyecto.md`
- Testing Guide: `docs/features/testing-guide.md`
- ESLint Configuration: `docs/features/eslint-configuration.md`

## Notes
- Follow this guide strictly to maintain consistency
- When in doubt, reference the `domain-models` package as example
- **Every package should have turbo.json, .gitignore, eslint.config.mjs, and vitest.config.ts**
- **Add tests for all packages** with 100% coverage target - See [testing-guide.md](testing-guide.md)
- **Add linting for all packages** - See [eslint-configuration.md](eslint-configuration.md)
- The `extends: ["//"]` in turbo.json refers to the root config
- **Root workspace vitest** automatically discovers and runs package tests
- **Root eslint.config.mjs** is extended by all packages for consistency
- Update this guide if you find improvements or issues

## Last Updated
15 January 2026 - Added ESLint configuration step, now includes 14 steps with complete tooling
