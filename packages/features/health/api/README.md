# @piar/health-api

API adapter package for the Health feature. Implements the ports defined in `@piar/health-configuration` using HTTP/fetch.

## Purpose

This package contains the adapter implementations for health check functionality. It represents the infrastructure layer in Clean Architecture, implementing the interfaces defined in the configuration package.

## Architecture

Following **Clean Architecture**, this package contains:

- **Adapters**: Concrete implementations of repository interfaces
- **HTTP Client**: Fetch-based implementation for API calls

## Exports

### Adapters

- `HttpHealthRepository`: HTTP implementation of `IHealthRepository`

## Usage

```typescript
import { HttpHealthRepository } from '@piar/health-api';
import type { HealthStatus } from '@piar/health-configuration';

// Create the repository instance
const healthRepository = new HttpHealthRepository();

// Check health status
const status: HealthStatus = await healthRepository.getHealth('http://localhost:5000');

console.log(status);
// {
//   status: 'ok',
//   timestamp: '2026-01-16T...',
//   service: 'web-bff'
// }

// Check with timeout (5 seconds)
const statusWithTimeout = await healthRepository.getHealthWithTimeout(
  'http://localhost:5000',
  5000
);
```

## Dependencies

- `@piar/health-configuration`: Port definitions (interfaces)
- Native `fetch`: For HTTP requests (no external dependencies needed)

## Development

```bash
# Build
pnpm --filter @piar/health-api build

# Watch mode
pnpm --filter @piar/health-api dev

# Type check
pnpm --filter @piar/health-api typecheck

# Lint
pnpm --filter @piar/health-api lint

# Test
pnpm --filter @piar/health-api test
```

## Implementation Details

### HttpHealthRepository

Implements `IHealthRepository` using native fetch API:

**Features:**
- Automatic error handling
- Timeout support with AbortController
- Structured error responses
- Type-safe responses

**Error Handling:**
- Network errors: Returns error status with message
- Timeout errors: Returns timeout-specific error
- HTTP errors (4xx, 5xx): Returns error status

## Testing

```typescript
import { describe, it, expect, vi } from 'vitest';
import { HttpHealthRepository } from './http-health.repository';

describe('HttpHealthRepository', () => {
  it('should fetch health status', async () => {
    const repository = new HttpHealthRepository();
    const status = await repository.getHealth('http://localhost:5000');
    
    expect(status).toHaveProperty('status');
    expect(status).toHaveProperty('timestamp');
  });
});
```

## Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│   @piar/health-client (Use Cases)      │
│   - Business Logic                      │
└──────────────┬──────────────────────────┘
               │ depends on
               ▼
┌─────────────────────────────────────────┐
│   @piar/health-configuration (Ports)   │
│   - Interfaces                          │
└──────────────▲──────────────────────────┘
               │ implements
               │
┌──────────────┴──────────────────────────┐
│   @piar/health-api (Adapters)          │ ◄── YOU ARE HERE
│   - HTTP Implementation                 │
│   - Fetch API                           │
└─────────────────────────────────────────┘
```

## Related Packages

- `@piar/health-configuration`: Port definitions
- `@piar/health-client`: Client-side use cases and controllers

## Notes

- Uses native `fetch` API (available in Node.js 18+)
- No external HTTP library dependencies
- Fully typed with TypeScript
- Error handling built-in
