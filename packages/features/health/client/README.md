# @piar/health-client

Client package for the Health feature. Contains use cases, controllers, and module for consuming health check functionality.

## Purpose

This package contains the application layer for health check functionality. It represents the use cases and controllers in Clean Architecture, orchestrating business logic and coordinating between the presentation and domain layers.

## Architecture

Following **Clean Architecture**, this package contains:

- **Use Cases**: Application-specific business rules
- **Controllers**: Coordinate use cases and handle presentation logic
- **Module**: Factory for dependency injection and configuration

## Exports

### Use Cases

- `GetHealthStatusUseCase`: Get health status of a service
- `GetMultipleHealthStatusUseCase`: Get health status of multiple services
- `GetHealthStatusWithRetryUseCase`: Get health status with retry logic

### Controllers

- `HealthController`: Main controller for health operations

### Module

- `HealthModule`: Factory for creating configured instances

### Types

Re-exports all types from `@piar/health-configuration`

## Usage

### Basic Usage

```typescript
import { HealthModule } from '@piar/health-client';

// Create controller instance
const healthController = HealthModule.create();

// Get health status of a service
const status = await healthController.getHealth('http://localhost:5000');
console.log(status);
// { status: 'ok', timestamp: '...', service: 'web-bff' }

// Check if service is healthy
const isHealthy = await healthController.isHealthy('http://localhost:5000');
console.log(isHealthy); // true or false
```

### Multiple Services

```typescript
const healthController = HealthModule.create();

const services = [
  'http://localhost:5000',  // web-bff
  'http://localhost:5050',  // backoffice-bff
];

const statuses = await healthController.getMultipleHealth(services);
statuses.forEach(status => {
  console.log(`${status.service}: ${status.status}`);
});
```

### Aggregated Health

```typescript
const healthController = HealthModule.create();

const result = await healthController.getAggregatedHealth([
  'http://localhost:5000',
  'http://localhost:5050',
]);

console.log(`Overall: ${result.overall}`);
// Overall: ok | degraded | error

result.services.forEach(service => {
  console.log(`- ${service.service}: ${service.status}`);
});
```

### With Retry Logic

```typescript
const healthController = HealthModule.create();

// Will retry up to 3 times with 1 second delay
const status = await healthController.getHealthWithRetry('http://localhost:5000');
```

### Singleton Pattern

```typescript
// Get singleton instance
const controller1 = HealthModule.getInstance();
const controller2 = HealthModule.getInstance();

// Same instance
console.log(controller1 === controller2); // true

// Reset for testing
HealthModule.resetInstance();
```

### Custom Repository

```typescript
import { HealthModule } from '@piar/health-client';
import type { IHealthRepository } from '@piar/health-configuration';

// Create custom repository
class CustomHealthRepository implements IHealthRepository {
  async getHealth(serviceUrl: string) {
    // Custom implementation
  }
  
  async getHealthWithTimeout(serviceUrl: string, timeout: number) {
    // Custom implementation
  }
}

// Use custom repository
const customRepo = new CustomHealthRepository();
const controller = HealthModule.create(customRepo);
```

## Dependencies

- `@piar/health-configuration`: Port definitions
- `@piar/health-api`: Default HTTP adapter implementation

## Development

```bash
# Build
pnpm --filter @piar/health-client build

# Watch mode
pnpm --filter @piar/health-client dev

# Type check
pnpm --filter @piar/health-client typecheck

# Lint
pnpm --filter @piar/health-client lint

# Test
pnpm --filter @piar/health-client test
```

## Use Cases

### GetHealthStatusUseCase

Simple health check for a single service.

```typescript
import { GetHealthStatusUseCase } from '@piar/health-client';
import { HttpHealthRepository } from '@piar/health-api';

const repository = new HttpHealthRepository();
const useCase = new GetHealthStatusUseCase(repository);

const status = await useCase.execute('http://localhost:5000');
```

### GetMultipleHealthStatusUseCase

Parallel health checks for multiple services with timeout.

```typescript
import { GetMultipleHealthStatusUseCase } from '@piar/health-client';
import { HttpHealthRepository } from '@piar/health-api';

const repository = new HttpHealthRepository();
const useCase = new GetMultipleHealthStatusUseCase(repository);

const statuses = await useCase.execute([
  'http://localhost:5000',
  'http://localhost:5050',
]);
```

### GetHealthStatusWithRetryUseCase

Health check with automatic retry logic.

```typescript
import { GetHealthStatusWithRetryUseCase } from '@piar/health-client';
import { HttpHealthRepository } from '@piar/health-api';

const repository = new HttpHealthRepository();
const useCase = new GetHealthStatusWithRetryUseCase(
  repository,
  3,    // max retries
  1000  // retry delay in ms
);

const status = await useCase.execute('http://localhost:5000');
```

## Testing

```typescript
import { describe, it, expect, vi } from 'vitest';
import { HealthController } from './health.controller';
import type { IHealthRepository } from '@piar/health-configuration';

describe('HealthController', () => {
  it('should get health status', async () => {
    const mockRepository: IHealthRepository = {
      getHealth: vi.fn().mockResolvedValue({
        status: 'ok',
        timestamp: '2026-01-16T...',
        service: 'test',
      }),
      getHealthWithTimeout: vi.fn(),
    };

    const controller = new HealthController(mockRepository);
    const status = await controller.getHealth('http://test');

    expect(status.status).toBe('ok');
  });
});
```

## Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│   Frontend Components                   │
│   - React/Next.js                       │
│   - UI Layer                            │
└──────────────┬──────────────────────────┘
               │ uses
               ▼
┌─────────────────────────────────────────┐
│   @piar/health-client                   │ ◄── YOU ARE HERE
│   - Use Cases (Business Logic)          │
│   - Controllers (Coordination)          │
│   - Module (Dependency Injection)       │
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
│   @piar/health-api (Adapters)          │
│   - HTTP Implementation                 │
└─────────────────────────────────────────┘
```

## Related Packages

- `@piar/health-configuration`: Port definitions
- `@piar/health-api`: HTTP adapter implementation

## Integration with Frontend

### Next.js App Router Example

```typescript
// app/health/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { HealthModule, type HealthStatus } from '@piar/health-client';

export default function HealthPage() {
  const [statuses, setStatuses] = useState<HealthStatus[]>([]);

  useEffect(() => {
    const controller = HealthModule.getInstance();
    
    controller.getMultipleHealth([
      'http://localhost:5000',
      'http://localhost:5050',
    ]).then(setStatuses);
  }, []);

  return (
    <div>
      <h1>Service Health</h1>
      {statuses.map(status => (
        <div key={status.service}>
          <h2>{status.service}</h2>
          <p>Status: {status.status}</p>
          <p>Timestamp: {status.timestamp}</p>
        </div>
      ))}
    </div>
  );
}
```

## Notes

- Business logic is isolated in use cases
- Controllers coordinate between UI and use cases
- Module provides dependency injection
- Follows SOLID principles
- Testable and maintainable
