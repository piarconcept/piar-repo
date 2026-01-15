# @piar/domain-models

Shared domain models and TypeScript entities for the entire PIAR monorepo.

## Usage

```typescript
import { AccountEntity, AccountEntityProps } from '@piar/domain-models';

// Create new account
const account = new AccountEntity({
  id: '123',
  accountCode: 'ACC-001',
  role: 'admin'
  // createdAt and updatedAt are auto-generated
});

console.log(account.id); // '123'
console.log(account.createdAt); // Current Date
```

## Development

```bash
# Build (recommended: use turbo)
pnpm turbo build --filter=@piar/domain-models

# Watch mode
pnpm --filter @piar/domain-models dev

# Type check
pnpm --filter @piar/domain-models typecheck

# Run tests
pnpm --filter @piar/domain-models test

# Run tests in watch mode
pnpm --filter @piar/domain-models test:watch

# Run tests with coverage
pnpm --filter @piar/domain-models test:coverage
```
