# ESLint Configuration

**Status**: ✅ Configured  
**Last Updated**: 15 January 2026

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
- **File Types**: `**/*.ts`, `**/*.tsx`

### Key Rules

#### TypeScript
- `@typescript-eslint/no-unused-vars`: Error (allows `_` prefix for unused)
- `@typescript-eslint/no-explicit-any`: Warning
- `@typescript-eslint/no-non-null-assertion`: Warning

#### Import Organization
- `import/order`: Enforced with groups and alphabetical sorting
- `import/no-duplicates`: Error

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
  'apps/**', // Apps have their own configs
]
```

## Next.js Apps Configuration

Apps extend root config and add Next.js specific rules:

```js
import rootConfig from "../../../eslint.config.mjs";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...rootConfig,
  ...nextVitals,
  ...nextTs,
  globalIgnores([...])
]);
```

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

## Troubleshooting

### Issue: ESLint not finding configuration
**Solution**: Ensure `eslint.config.mjs` exists in the package directory or verify path to root config.

### Issue: Import order errors
**Solution**: Run `pnpm lint -- --fix` to auto-sort imports.

### Issue: Next.js specific rules not working
**Solution**: Verify app's `eslint.config.mjs` extends both root and Next.js configs.

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

---

**Last Updated**: 15 January 2026  
**Configuration**: Root-based with app-specific extensions
