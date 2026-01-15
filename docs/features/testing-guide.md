# Testing Guide

## Purpose
Guide for writing and running tests in the PIAR monorepo. Establishes testing standards, patterns, and best practices for all packages and applications.

## Status
- [x] Completed - Testing setup for domain-models package
- [x] Vitest configured as test framework
- [x] Example tests created

## Testing Strategy

### Framework: Vitest
We use **Vitest** as our testing framework for all packages.

**Why Vitest?**
- ⚡ Fast - Uses Vite for instant test execution
- 🔧 TypeScript native - No additional configuration needed
- 📦 ESM first - Modern module support
- 🎯 Jest compatible - Familiar API
- 📊 Built-in coverage - Using V8
- 🔄 Workspace support - Test multiple packages together

### Workspace Configuration
**Monorepo structure:**
```
piar-repo/
├── vitest.config.ts           # Root workspace config
├── coverage/                  # Aggregated coverage reports
├── packages/
│   └── domain/
│       └── models/
│           ├── vitest.config.ts    # Package-specific config
│           ├── src/
│           │   └── entities/
│           └── tests/              # Test files
│               ├── base.entity.test.ts
│               └── account.entity.test.ts
└── apps/                      # Apps excluded from workspace tests
```

**Package structure:**
```
package-name/
├── src/
│   └── entities/
│       └── account/
│           └── account.entity.ts
├── tests/
│   └── account.entity.test.ts     # Tests mirror src structure
├── vitest.config.ts               # Package config
  'packages/*/*/vitest.config.ts', // For nested packages
  {
    test: {
      globals: true,
      environment: 'node',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        reportsDirectory: './coverage',
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.turbo/**',
          '**/coverage/**',
          '**/*.d.ts',
          '**/*.config.*',
          '**/tests/**',
          '**/index.ts',
          'apps/**', // Don't test apps in workspace tests
          'scripts/**',
          'docs/**',
          '*.md',
        ],
        // Coverage thresholds for the entire workspace
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 75,
          statements: 80
        }
      }
    }
  }
]);
```

**Key configuration points:**
- **Workspace mode** - Automatically discovers and runs tests from all packages
- **Packages only** - Apps are excluded from workspace tests (tested separately if needed)
- **Centralized coverage** - Aggregates coverage from all packages in `./coverage`
- **Coverage thresholds** - Enforces minimum 80% coverage on lines/functions/statements
- **Multiple reporters** - (if creating workspace from scratch)

Root workspace already has vitest installed. For individual packages:

Add to `package.json`:
```json
{
  "devDependencies": {
    "vitest": "^2.1.8",
    "@vitest/coverage-v8": "^2.1.8"
  }
}
```

**Note:** If using workspace mode, packages inherit from root vitest installation. tests/
│   └── account.entity.test.ts     # Tests mirror src structure
├── vitest.config.ts               # Vitest configuration
└── package.json                   # Test scripts
```

## Setting Up Tests for a Package

### Step 1: Install Vitest

Add to `package.json`:
```json
{
  "devDependencies": {
    "vitest": "^2.1.8",
    "@vitest/coverage-v8": "^2.1.8"
  }
}
```

### Step 2: Create vitest.config.ts

Create the Vitest configuration file in your package root:

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
      ]
    }
  }
});
```

**Configuration explained:**
- `globals: true` - Use describe/it/expect without imports
- `environment: 'node'` - Node.js environment (use 'jsdom' for browser/React components)
- `coverage.provider: 'v8'` - Fast coverage using V8's built-in coverage
- `coverage.reporter` - Output formats: text (terminal), json (programmatic), html (browser)
- `coverage.exclude` - Files to exclude from coverage:
  - Build artifacts: `dist/`, `node_modules/`
  - Type definitions: `**/*.d.ts`
  - Config files: `**/*.config.*`, package.json, tsconfig.json, turbo.json
  - Test files: `**/tests/**`
  - Documentation: `README.md`, `docs/**`
  - Barrel exports: `**/index.ts` (simple re-exports, don't need testing)
  - Git/build files: `.gitignore`, `coverage/**`

**Why exclude index.ts?**
Index files are typically simple re-exports (`export * from './entity'`) and don't contain logic to test. Testing the actual implementations provides full coverage.

### Step 3: Add Test Scripts

In `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

### Step 4: Update .gitignore

Add coverage folder:
```
node_modules
dist
*.log
.turbo
coverage
```

## Writing Tests

### Test File Naming Convention

- **Pattern**: `{feature}.test.ts` or `{feature}.spec.ts`
- **Location**: `tests/` folder
- **Mirror structure**: Match the src/ folder structure

Examples:
```
src/entities/account/account.entity.ts
tests/account.entity.test.ts

src/utils/validation.ts
tests/validation.test.ts
```

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { EntityToTest } from '../src/path/to/entity';

describe('EntityToTest', () => {
  it('should do something specific', () => {
    // Arrange - Setup test data
    const input = 'test';
    
    // Act - Execute the code
    const result = new EntityToTest(input);
    
    // Assert - Verify results
    expect(result).toBeDefined();
  });

  it('should handle another case', () => {
    // Test another scenario
  });
});
```

## Example Tests: domain-models

### Example 1: BaseEntity Test

File: `tests/base.entity.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { BaseEntity, BaseEntityProps } from '../src/entities/base/base.entity';

describe('BaseEntity', () => {
  it('should create entity with provided id and auto-generate timestamps', () => {
    const props: BaseEntityProps = {
      id: '123'
    };

    const entity = new BaseEntity(props);

    expect(entity.id).toBe('123');
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
  });

  it('should create entity with provided timestamps', () => {
    const createdDate = new Date('2025-01-01');
    const updatedDate = new Date('2025-01-15');

    const props: BaseEntityProps = {
      id: '456',
      createdAt: createdDate,
      updatedAt: updatedDate
    };

    const entity = new BaseEntity(props);

    expect(entity.id).toBe('456');
    expect(entity.createdAt).toEqual(createdDate);
    expect(entity.updatedAt).toEqual(updatedDate);
  });
});
```

### Example 2: AccountEntity Test

File: `tests/account.entity.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { AccountEntity, AccountEntityProps } from '../src/entities/account/account.entity';

describe('AccountEntity', () => {
  it('should create account entity with required properties', () => {
    const props: AccountEntityProps = {
      id: 'acc-001',
      accountCode: 'ACC-001'
    };

    const account = new AccountEntity(props);

    expect(account.id).toBe('acc-001');
    expect(account.accountCode).toBe('ACC-001');
    expect(account.role).toBeUndefined();
  });

  it('should create account entity with role', () => {
    const props: AccountEntityProps = {
      id: 'acc-002',
      accountCode: 'ACC-002',
      role: 'admin'
    };

    const account = new AccountEntity(props);

    expect(account.role).toBe('admin');
  });
});
```

## Running Tests

### Run All Tests in Workspace

From the root of the monorepo:

```bash
# Run all tests once
pnpm test

# Run all tests with coverage
pnpm test:coverage
```

These commands use Turbo to:
- Build dependencies first (`dependsOn: ["^build"]`)
- Run tests in all packages that have a `test` script
- Aggregate all results

### Run Tests for Specific Package

```bash
# Run tests once
pnpm --filter @piar/domain-models test

# Run in watch mode (auto-rerun on changes)
pnpm --filter @piar/domain-models test:watch

# Run with coverage report
pnpm --filter @piar/domain-models test:coverage
```

### Using Turbo Directly

```bash
# Run all tests
pnpm turbo test

# Run with coverage
pnpm turbo test:coverage

# Run tests for filtered packages
pnpm turbo test --filter=@piar/domain-models
```

## Test Patterns

### Testing Entity Construction

```typescript
it('should create entity with all properties', () => {
  const props = {
    id: '123',
    name: 'Test'
  };
  
  const entity = new MyEntity(props);
  
  expect(entity.id).toBe('123');
  expect(entity.name).toBe('Test');
});
```

### Testing Optional Properties

```typescript
it('should handle optional properties', () => {
  const props = {
    id: '123',
    name: 'Test'
    // optionalField is not provided
  };
  
  const entity = new MyEntity(props);
  
  expect(entity.optionalField).toBeUndefined();
});
```

### Testing Dates

```typescript
it('should handle date properties correctly', () => {
  const date = new Date('2025-01-01');
  const props = { id: '123', createdAt: date };
  
  const entity = new MyEntity(props);
  
  expect(entity.createdAt).toBeInstanceOf(Date);
  expect(entity.createdAt).toEqual(date);
});
```

### Testing Inheritance

```typescript
it('should extend base entity properly', () => {
  const props = {
    id: '123',
    specificField: 'value'
  };
  
  const entity = new SpecificEntity(props);
  
  // Test base properties
  expect(entity.id).toBe('123');
  expect(entity.createdAt).toBeInstanceOf(Date);
  
  // Test specific properties
  expect(entity.specificField).toBe('value');
});
```

## Best Practices

### 1. Test Naming
✅ **Good**:
- `should create entity with valid properties`
- `should throw error when id is missing`
- `should calculate total correctly`

❌ **Bad**:
- `test 1`
- `it works`
- `entity test`

### 2. Test Structure (AAA Pattern)
```typescript
it('should do something', () => {
  // Arrange - Setup
  const input = createTestData();
  
  // Act - Execute
  const result = performAction(input);
  
  // Assert - Verify
  expect(result).toBe(expected);
});
```

### 3. One Assertion Per Test (When Reasonable)
```typescript
// Good - Focused test
**Workspace-wide coverage:**
- Root vitest.config.ts aggregates coverage from all packages
- Reports saved to `./coverage/` in monorepo root
- Coverage thresholds enforced: 80% lines, 80% functions, 75% branchesit('should return correct id', () => {
  expect(entity.id).toBe('123');
});

// Also good - Related assertions
it('should create entity with all base properties', () => {
  expect(entity.id).toBe('123');
  expect(entity.createdAt).toBeInstanceOf(Date);
  expect(entity.updatedAt).toBeInstanceOf(Date);
});
```

### 4. Test Edge Cases
```typescript
describe('MyEntity', () => {
  itAchieving 100% Coverage

The `@piar/domain-models` package achieves **100% test coverage** by:

1. **Testing all entity classes** - BaseEntity and AccountEntity fully tested
2. **Excluding non-logic files** - index.ts barrel exports excluded
3. **Comprehensive test cases** - Testing all code paths and edge cases

### Minimum Coverage Targets

For production packages, aim for:
- **Statements**: 80%+ (100% achieved in domain-models)
- **Branches**: 75%+ (100% achieved in domain-models)
- **Functions**: 80%+ (100% achieved in domain-models)
- **Lines**: 80%+ (100% achieved in domain-models)

### Coverage Exclusions (Recommended)

Exclude from coverage reports:
```typescript
exclude: [
  'dist', 'node_modules',           // Build artifacts
  '**/*.d.ts', '**/*.config.*',     // Config and type files
  '**/tests/**', 'vitest.config.ts',// Test infrastructure
  'package.json', 'tsconfig.json',  // Package config
  'turbo.json', '.gitignore',       // Build/Git config
  'README.md', 'docs/**',           // Documentation
  'coverage/**',                     // Coverage output
  '**/index.ts',                    // Barrel exports (re-exports only)
]
```dle null values', () => {
    // Test null
  });
  
  it('should handle undefined values', () => {
    // Test undefined
  });
});
```

### 5. Keep Tests Simple
- Tests should be easy to read and understand
- Avoid complex logic in tests
- Each test should test one thing

## Coverage Guidelines

### Minimum Coverage Targets
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### What to Test
✅ **Always test**:
- Public APIs
- Entity constructors
- Business logic
- Edge cases
- Error conditions

❌ **Don't need to test**:
The root `turbo.json` includes test tasks:

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["^build"],
      "cache": false,
      "outputs": ["coverage/**"]
    },
    "test:coverage": {
      "dependsOn": ["^build"],
      "cache": false,
      "outputs": ["coverage/**"]
    }
  }
}
```

**Configuration explained:**
- `dependsOn: ["^build"]` - Builds dependencies before running tests
- `cache: false` - Tests always run (don't use cached results)
- `outputs: ["coverage/**"]` - Tracks coverage output for potential caching

The root `package.json` includes convenient scripts:

```json
{
  "scripts": {
    "test": "turbo test",
    "test:coverage": "turbo test:coverage"
  }
}
```

**Benefits:**
- Run `pnpm test` from anywhere in the monorepo
- Automatically runs tests in all packages with test scripts
- Ensures packages are built before testing
- Aggregates results from all packages
      "outputs": ["coverage/**"]
    }
  }
}
```

**Note**: Tests are typically not cached (`cache: false`) because we want to run them every time.

## Common Vitest Matchers

```typescript
// Equality
expect(value).toBe(expected)        // Strict equality (===)
expect(value).toEqual(expected)     // Deep equality
expect(value).toStrictEqual(...)    // Strict deep equality

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeDefined()
expect(value).toBeUndefined()
expect(value).toBeNull()

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeGreaterThanOrEqual(3)
expect(value).toBeLessThan(5)
expect(value).toBeCloseTo(0.3)

// Strings
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')
: `pnpm test:watch`
- Check coverage regularly: `pnpm test:coverage`
- **Aim for 100% coverage** on business logic (achieved in @piar/domain-models)
- Exclude barrel exports (index.ts) from coverage - they're just re-exports

## Last Updated
15 January 2026 - Updated with production-ready vitest.config.ts achieving 100% coverage
// Objects
expect(object).toHaveProperty('key')
expect(object).toMatchObject({ key: 'value' })

// Errors
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('error message')

// Types
expect(value).toBeInstanceOf(Class)
expect(typeof value).toBe('string')
```

## Related Documentation
- Domain Models Package: `docs/features/domain-models.md`
- Creating Packages: `docs/features/creating-packages.md`

## Notes
- Always run tests before committing
- Add tests for new features
- Update tests when changing behavior
- Use watch mode during development
- Check coverage regularly

## Last Updated
15 January 2026 - Initial testing guide with vitest setup and examples
