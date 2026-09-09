# ESLint Configuration

**Status**: ✅ Configured  
**Last Updated**: 27 January 2026

## Overview

PIAR monorepo uses ESLint for code quality and consistency across all TypeScript files. The configuration is centralized in the root with specific extensions for Next.js apps.

## Structure

```
/
├── eslint.config.mjs          # Root ESLint config (base TypeScript rules)
├── apps/
│   └── client/
│       ├── backoffice/
│       │   └── eslint.config.mjs  # Extends root + Next.js rules
│       └── web/
│           └── eslint.config.mjs  # Extends root + Next.js rules
└── packages/
    └── domain/
        └── models/
            └── eslint.config.mjs  # Uses root config
```

## Root Configuration (`eslint.config.mjs`)

Base configuration for all TypeScript packages:

- **Parser**: `@typescript-eslint/parser`
- **Plugins**: `@typescript-eslint`, `eslint-plugin-import`
- **Globals**: `globals` package for Node/Vitest globals in tests
- **Formatting**: `eslint-config-prettier` disables conflicting rules
- **File Types**: `**/*.ts`, `**/*.tsx`

### Key Rules

#### TypeScript

- `@typescript-eslint/no-unused-vars`: Error (allows `_` prefix for unused)
- `@typescript-eslint/no-explicit-any`: Warning
- `@typescript-eslint/no-non-null-assertion`: Warning

#### Import Organization

- `import/order`: Disabled (kept flexible for faster iteration)
- `import/no-duplicates`: Disabled (handled by tooling and review)

#### Code Quality

- `no-console`: Warn (except `console.warn`, `console.error`)
- `prefer-const`: Error
- `no-var`: Error

### Ignored Patterns

```js
ignores: [
  '**/node_modules/**',
  '**/dist/**',
  '**/.turbo/**',
  '**/coverage/**',
  '**/.next/**',
  '**/out/**',
  '**/build/**',
  '**/*.config.*',
  'apps/**', // Apps have their own configs
];
```

### Test File Overrides

Test files are linted and include Vitest globals:

```js
files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
languageOptions: {
  globals: {
    ...globals.node,
    ...globals.vitest,
  },
},
```

## Next.js Apps Configuration

Apps extend root config and add Next.js specific rules:

```js
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import rootConfig from '../../../eslint.config.mjs';

const appDirectory = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: appDirectory });

export default defineConfig([
  ...rootConfig,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
```

The clients keep `next` and `eslint-config-next` on the same supported 15.5 patch. The
`@eslint/eslintrc` compatibility layer is required because this Next.js line still exposes legacy
shareable presets while the repository uses ESLint 9 flat configuration.

## Package Configuration

Packages simply import and use the root configuration:

```js
// packages/domain/models/eslint.config.mjs
import rootConfig from '../../../eslint.config.mjs';

export default rootConfig;
```

## Scripts

### Root Level (`pnpm lint`)

Runs ESLint across all workspace packages and apps using Turbo:

```json
{
  "scripts": {
    "lint": "turbo lint"
  }
}
```

### Package Level

Each package has its own lint script:

```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

## Turbo Task Configuration

```json
{
  "lint": {
    "dependsOn": ["^lint"],
    "cache": true
  }
}
```

- **Dependency**: Runs after dependencies are linted
- **Caching**: Enabled for performance

## Usage

### Lint All Workspace

```bash
pnpm lint
```

### Lint Specific Package

```bash
pnpm --filter @piar/domain-models lint
```

### Lint Next.js Apps

```bash
pnpm --filter @piar/backoffice lint
pnpm --filter @piar/web lint
```

### Auto-fix Issues

```bash
pnpm lint -- --fix
```

## Dependencies

### Root Workspace (`-w`)

```json
{
  "devDependencies": {
    "eslint": "^9.18.0",
    "@typescript-eslint/eslint-plugin": "^8.20.0",
    "@typescript-eslint/parser": "^8.20.0",
    "eslint-plugin-import": "^2.31.0"
  }
}
```

### Next.js Apps

```json
{
  "devDependencies": {
    "eslint": "^9",
    "eslint-config-next": "16.1.2"
  }
}
```

## Creating New Packages

### Approach 1: Simple Extension (Recommended for most packages)

For most packages, extending the root configuration is sufficient:

1. Create `eslint.config.mjs`:

   ```js
   import rootConfig from '../../../eslint.config.mjs';
   export default rootConfig;
   ```

2. Add lint script to `package.json`:

   ```json
   {
     "scripts": {
       "lint": "eslint ."
     }
   }
   ```

3. Run `pnpm lint` from root to verify

### Approach 2: Complete TypeScript-Specific Configuration (For packages with complex TypeScript needs)

⚠️ **Important**: Use this approach when you need advanced TypeScript rules or the simple extension causes "weird errors". This is the pattern used in `@piar/ui-components`.

**When to use this approach:**

- Package has complex TypeScript with generics, conditional types
- Need strict TypeScript rules with project-aware parsing
- The simple extension approach causes module resolution errors
- Working with React components that require JSX parsing

**Complete configuration pattern** (`packages/ui/components/eslint.config.mjs`):

```javascript
import tsEslint from 'typescript-eslint';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tsEslint.config(
  ...tsEslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.turbo/**',
      'eslint.config.mjs',
      'coverage/**',
      '**/*.config.*',
    ],
  },
);
```

**Key elements explained:**

- `import tsEslint from 'typescript-eslint'`: Direct import of typescript-eslint package
- `__dirname` resolution: Required for ESM modules to correctly locate tsconfig.json
- `project: true`: Enables type-aware linting with TypeScript's type checker
- `tsconfigRootDir: __dirname`: Tells ESLint where to find tsconfig.json
- Custom rules: Override specific rules for your package's needs
- Comprehensive ignores: Prevent linting of build artifacts and config files

**Dependencies required:**

```json
{
  "devDependencies": {
    "typescript-eslint": "^8.20.0",
    "eslint": "^9.18.0"
  }
}
```

**Common issues this solves:**

- ❌ "Cannot find package 'typescript-eslint'" → Fixed by correct import path
- ❌ "Parsing error: Cannot read file" → Fixed by tsconfigRootDir
- ❌ "Unable to resolve path to module" → Fixed by project: true
- ❌ Random module resolution failures → Fixed by complete configuration

### Comparison: When to Use Each Approach

| Feature                  | Simple Extension                         | Complete Config             |
| ------------------------ | ---------------------------------------- | --------------------------- |
| **Setup Time**           | ⚡ Fast (2 lines)                        | ⏱️ Medium (15 lines)        |
| **Maintenance**          | ✅ Easy                                  | ⚠️ Manual updates           |
| **TypeScript Awareness** | ⚠️ Basic                                 | ✅ Full type-aware          |
| **Custom Rules**         | ❌ Limited                               | ✅ Full control             |
| **Use Case**             | Domain packages, utilities               | UI components, complex libs |
| **Examples**             | @piar/domain-models, @piar/domain-fields | @piar/ui-components         |

**Decision flowchart:**

1. Start with **Simple Extension** (Approach 1)
2. If you encounter ESLint errors or need type-aware rules:
   - Try fixing with simple config first
   - If issues persist, switch to **Complete Config** (Approach 2)
3. Document your choice in package README

## IDE Integration

### VS Code

ESLint will auto-detect `eslint.config.mjs` files. Install the ESLint extension:

```json
{
  "recommendations": ["dbaeumer.vscode-eslint"]
}
```

### Auto-fix on Save

Add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Best Practices

### ✅ DO:

1. **Start simple**: Begin with simple extension (Approach 1), upgrade if needed
2. **Document your choice**: Explain in package README why you chose a specific config
3. **Use complete config for UI packages**: Components often need type-aware rules
4. **Test after changes**: Run `pnpm lint` after modifying ESLint config
5. **Keep ignores comprehensive**: Include dist, coverage, config files
6. **Centralize common rules**: Put shared rules in root config when possible

### ❌ DON'T:

1. **Don't mix approaches**: Stick to one config pattern per package
2. **Don't skip tsconfigRootDir**: Required for ESM modules with project-aware linting
3. **Don't ignore the "weird errors"**: They indicate incomplete configuration
4. **Don't copy configs blindly**: Understand what each config does
5. **Don't forget dependencies**: Complete config needs `typescript-eslint` in devDependencies
6. **Don't lint build artifacts**: Always include dist/, coverage/ in ignores

### Package-Specific Recommendations:

| Package Type                              | Recommended Approach | Reason                                           |
| ----------------------------------------- | -------------------- | ------------------------------------------------ |
| **Domain models** (`@piar/domain-models`) | Simple Extension     | Pure TypeScript, minimal complexity              |
| **Utilities** (`@piar/domain-fields`)     | Simple Extension     | Straightforward logic, no JSX                    |
| **UI Components** (`@piar/ui-components`) | Complete Config      | React/JSX, complex types, needs type-aware rules |
| **Layout packages** (`@piar/layout`)      | Complete Config      | React components with composition patterns       |
| **Feature packages** (configuration)      | Simple Extension     | Interface definitions only                       |
| **Feature packages** (client)             | Complete Config      | React hooks and components                       |
| **Messages/i18n**                         | Simple Extension     | JSON manipulation, minimal logic                 |

## Troubleshooting

### Issue: "Cannot find package 'typescript-eslint'" or similar module errors

**Problem**: Package ESLint config can't resolve typescript-eslint modules.

**Solutions**:

1. **Best solution**: Use the complete TypeScript-specific configuration (see Approach 2 above)
2. Verify `typescript-eslint` is in devDependencies of the package
3. Run `pnpm install` to ensure dependencies are linked
4. Check that import path is exact: `import tsEslint from 'typescript-eslint';`

**Why this happens**: ESM module resolution can be strict. The complete config with direct imports avoids resolution ambiguities.

### Issue: "Weird errors" with ESLint (parsing errors, type errors)

**Problem**: Random ESLint failures, parsing errors, or type-checking issues.

**Root Cause**: Simple config extension doesn't provide enough context for TypeScript project-aware linting.

**Solution**: Switch to the complete TypeScript-specific configuration (Approach 2). This pattern is proven to work in `@piar/ui-components` and provides:

- Proper `__dirname` resolution for ESM
- `project: true` for type-aware linting
- `tsconfigRootDir` pointing to correct location
- Explicit ignores to avoid parsing build artifacts

### Issue: ESLint not finding configuration

**Solution**: Ensure `eslint.config.mjs` exists in the package directory or verify path to root config.

### Issue: Import order errors

**Solution**: Run `pnpm lint -- --fix` to auto-sort imports.

### Issue: Next.js specific rules not working

**Solution**: Verify app's `eslint.config.mjs` extends both root and Next.js configs.

### Issue: "Parsing error: Cannot read file 'tsconfig.json'"

**Problem**: ESLint can't locate TypeScript configuration.

**Solution**:

1. Use complete config with `tsconfigRootDir: __dirname`
2. Verify `tsconfig.json` exists in package root
3. Ensure `project: true` is set in parserOptions

### Issue: Different behavior between packages

**Problem**: ESLint works in some packages but fails in others.

**Analysis**:

- Packages with **simple extension**: Inherit root rules, basic TypeScript support
- Packages with **complete config**: Full type-aware linting, custom rules

**Solution**: Standardize on one approach per package type:

- Domain/util packages → Simple extension
- Component/UI packages → Complete config

## Related Documentation

- [Creating Packages](./creating-packages.md) - Package setup guide
- [Testing Guide](./testing-guide.md) - Testing standards
- [Repository Configuration](./repository-configuration.md) - Monorepo structure

## Future Enhancements

- [ ] Add Prettier integration
- [ ] Add pre-commit hooks with husky + lint-staged
- [ ] Add custom rules for API and SQS packages
- [ ] Configure import path aliases resolution

## Notes

- Root config applies to packages only, apps have their own configs
- ESLint v9 uses flat config format (`eslint.config.mjs`)
- Turbo caches lint results for faster subsequent runs
- Apps use Next.js ESLint configs which include React rules
- Import sorting is alphabetical with grouped categories
- **Two valid approaches**: Simple extension for basic packages, complete config for complex packages
- **Complete config pattern proven in production**: Used successfully in `@piar/ui-components`
- **Type-aware linting**: Only works with complete config + `project: true`
- **ESM module resolution**: Requires `__dirname` setup in complete config

## Summary

The PIAR monorepo uses **two ESLint configuration patterns**:

1. **Simple Extension** (70% of packages):
   - Quick setup, inherits root rules
   - Best for: domain models, utilities, simple TypeScript packages
   - Example: `@piar/domain-models`, `@piar/domain-fields`

2. **Complete TypeScript Config** (30% of packages):
   - Full type-aware linting with project context
   - Best for: UI components, React packages, complex TypeScript
   - Example: `@piar/ui-components` (proven pattern)
   - **Prevents "weird errors"** that can occur with simple configs

**Golden Rule**: Start with simple extension. If you encounter ESLint issues or need advanced TypeScript rules, switch to complete config using the `@piar/ui-components` pattern as reference.

---

**Last Updated**: 9 September 2026
**Configuration**: Root-based with two package patterns (simple extension + complete TypeScript config)
