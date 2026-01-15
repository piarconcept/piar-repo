# Domain Models Package

## Purpose
Centralized package for domain entities and models shared across all applications (web, backoffice, api, lambda). Ensures consistency and type safety across the entire monorepo.

## Status
- [x] Completed - Build verified working ✅
- [x] Base entity pattern implemented
- [x] AccountEntity created as example
- [x] Tests configured with 100% coverage ✅
- [x] Ready for use in all apps

## Package Location
`packages/domain/models/` → `@piar/domain-models`

## Key Decisions
- **Single source of truth**: All domain entities are defined here to avoid duplication
- **TypeScript only**: Pure TypeScript interfaces and types, no runtime dependencies
- **Compiled output**: Built to `dist/` for consumption by other packages
- **Strict typing**: Enforces strict TypeScript rules for maximum type safety

## Technical Details

### Architecture
This package contains TypeScript classes and types that represent the core business domain:
- **Entities**: Core domain objects as classes (AccountEntity, etc.)
  - Each entity has Props interface and Class implementation
  - All extend BaseEntity for consistent id/timestamps
  - Organized in folders: `entities/{entity-name}/{entity-name}.entity.ts`
- **Value Objects**: Small, immutable objects (to be added as needed)
- **Enums**: Shared enumeration types (to be added as needed)
- **DTOs**: Data Transfer Objects for API communication (to be added as needed)

### Dependencies
- **typescript 5.9.3**: Only dev dependency, no runtime dependencies
- **Pure types**: This package should remain dependency-free to avoid version conflicts

### File Structure
```
packages/domain/models/
├── package.json           # @piar/domain-models
├── tsconfig.json         # Strict Type: export * from './entities'
│   ├── entities/
│   │   ├── index.ts      # Export all entities
│   │   ├── base/
│   │   │   ├── base.entity.ts       # BaseEntity + BaseEntityProps
│   │   │   └── index.ts
│   │   ├── account/
│   │   │   ├── account.entity.ts    # AccountEntity + AccountEntityProps
│   │   │   └── index.ts
│   │   └── [other-entities]/        # Same pattern for new entities
│   ├── value-objects/    # Value objects (to be added)
│   ├── enums/            # Shared enums (to be added)
│   └── dtos/             # Data Transfer Objects (to be added)
└── dist/                 # Compiled output (gitignored)
    ├── index.js
    ├── index.d.ts
    └── entities//                 # Compiled output (gitignored)
    ├── index.js
    ├── index.d.ts
    └── ...
```

### Configuration

#### TypeScript Config
- **Target**: ES2020
- **Module**: ESNext with bundler resolution
- **Strict mode**: Enabled with all strict checks
- **Output**: Declaration files (.d.ts) with source maps

#### Turbo Configuration
The package has its own `turbo.json` that extends the root configuration:
```json
{
  "extends": ["//"],
  "tasks": { "build": { "outputs": ["dist/**"] } }
}
```
- **Extends**: Uses root turbo.json as base
- **Outputs**: Specifies dist/** for caching

#### Vitest Configuration
The package has its own `vitest.config.ts` configured for 100% coverage:
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
        '**/index.ts',  // Barrel exports excluded
      ]
    }
  }
});
```

**Key points:**
- Excludes barrel exports (`**/index.ts`) from coverage
- Achieves 100% test coverage on business logic
- Comprehensive exclusion list for non-logic files

#### Package Exports
```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

## Usage

### In Other Packages
1. Add dependency to package.json:
```jsonAccountEntity, AccountEntityProps } from '@piar/domain-models';

// Create new entity instance
const account = new AccountEntity({
  id: '123',
  accountCode: 'ACC-001',
  role: 'admin'
  // createdAt and updatedAt are auto-generated if not provided
});

// Or with explicit timestamps
const existingAccount = new AccountEntity({
  id: '456',
  accountCode: 'ACC-002',
  role: 'user',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-15')
})``typescript
import { User, BaseEntity } from '@piar/domain-models';

const user: User = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'user',

Follow this pattern for consistency:

1. **Create entity folder**: `src/entities/{entity-name}/`
2. **Create entity file**: `{entity-name}.entity.ts`
3. **Define Props interface**: Extends `BaseEntityProps`
4. **Define Entity class**: Extends `BaseEntity`, implements Props
5. **Create index.ts**: Export the entity
6. **Update parent index**: Add to `src/entities/index.ts`
7. **Build**: Run `pnpm --filter @piar/domain-models build`
8. **Document**: Update this file with the new entity

**Example for new ProductEntity:**
```typescript
// src/entities/product/product.entity.ts
import { BaseEntityProps, BaseEntity } from '../base/base.entity.js';

export interface ProductEntityProps extends BaseEntityProps {
  name: string;
  price: number;
  sku: string;
}

export class ProductEntity extends BaseEntity implements ProductEntityProps {
  name: string;
  price: number;
  sku: string;

  constructor(props: ProductEntityProps) {
    super(props);
    this.name = props.name;
    this.price = props.price;
    this.sku = props.sku;
  }
}

// src/entities/product/index.ts
export * from './product.entity';

// Add to src/entities/index.ts
export * from './product';
```
### Development Commands
```bash
# Build the package (recommended: use turbo for caching)
pnpm turbo build --filter=@piar/domain-models

# Or direct build
pnpm --filter @piar/domain-models build

# Watch mode for development
pnpm --filter @piar/domain-models dev

# Type checking
pnpm --filter @piar/domain-models typecheck

# Run tests
pnpm --filter @piar/domain-models test

# Run tests in watch mode
pnpm --filter @piar/domain-models test:watch

# Run tests with coverage
pnpm --filter @piar/domain-models test:coverage

# Build all packages (uses turbo cache)
pnpm turbo build
```

### Adding New Entities
1. Create new file in `src/entities/` or appropriate folder
2. Define interfaces with proper types
3. Export from the index file
4. Build the package
5. Document the entity in this file

### Entities Structure Pattern

All entities follow a consistent class-based pattern:

```tyClass-based entities**: Use classes extending BaseEntity, not plain interfaces
2. **Props + Entity pattern**: Separate Props interface from Entity class
3. **Folder organization**: One folder per entity with its own index.ts
4. **Auto-timestamps**: Let BaseEntity handle createdAt/updatedAt defaults
5. **Strict typing**: Avoid `any`, prefer union types for enums
6. **JSDoc comments**: Document complex properties and business rules
7. **Version carefully**: Changes affect all consumers across apps
8. **Immutability considerations**: Consider making entities immutable if needed
9. **File naming**: Use `.entity.ts` suffix for clarity
}

export class BaseEntity implements BaseEntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: BaseEntityProps) {
    this.id = props.id;
    this.createdAtMigrated to class-based entities with Props pattern. AccountEntity implemented as first domain entity.w Date();
    this.updatedAt = props.updatedAt ? new Date(props.updatedAt) : new Date();
  }
}

// Domain entity example - AccountEntity
export interface AccountEntityProps extends BaseEntityProps {
  accountCode: string;
  role?: 'admin' | 'user';
}

export class AccountEntity extends BaseEntity implements AccountEntityProps {
  accountCode: string;
  role?: 'admin' | 'user';

  constructor(props: AccountEntityProps) {
    super(props);
    this.accountCode = props.accountCode;
    this.role = props.role;
  }
}
```

**Entity fconfigured with 100% coverage** ✅ - See [testing-guide.md](testing-guide.md)
- All apps (web, backoffice, api, lambda) should use these types
- Maintain backwards compatibility when possible, document breaking changes
- The `dist/` folder is cached by turbo for faster rebuilds
- `.gitignore` excludes build artifacts (dist, node_modules, .turbo, coverage)

## Last Updated
15 January 2026 - Production-ready with 100% test coverage. vitest.config.ts optimized.
│   └── index.ts
└── index.ts
```

## Best Practices

1. **Keep it pure**: No runtime code, only types and interfaces
2. **Use strict typing**: Avoid `any`, prefer union types
3. **Document interfaces**: Add JSDoc comments for clarity
4. **Version carefully**: Changes affect all consumers
5. **Extend BaseEntity**: All entities should have common fields
6. **Use enums wisely**: Consider union types for small sets

## Related Documentation
- Repository Configuration: `docs/features/repository-configuration.md`
- Project Setup: `docs/features/setup-proyecto.md`

## Notes
- **Use turbo for builds**: `pnpm turbo build` leverages caching across workspace
- This package must be built before other packages can use it
- Turbo automatically handles build dependencies via `dependsOn: ["^build"]`
- **Package has its own turbo.json** that extends root config for specific outputs
- **Tests are configured with Vitest** - See [testing-guide.md](testing-guide.md)
- All apps (web, backoffice, api, lambda) should use these types
- Maintain backwards compatibility when possible, document breaking changes
- The `dist/` folder is cached by turbo for faster rebuilds
- `.gitignore` excludes build artifacts (dist, node_modules, .turbo, coverage)

## Last Updated
15 January 2026 - Added testing setup with Vitest and example tests

## Last Updated
15 January 2026 - Initial package creation with base entity structure
