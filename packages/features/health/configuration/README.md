# @piar/health-configuration

Configuration package for the Health feature. Contains ports (interfaces) following Clean Architecture principles.

## Purpose

This package defines the contracts and interfaces for health check functionality. It represents the domain layer in Clean Architecture, containing only interfaces and types without any implementation details.

## Architecture

Following **Clean Architecture**, this package contains:

- **Ports**: Interfaces that define contracts for external dependencies
- **Types**: Domain types and data structures

## Exports

### Ports

- `IHealthRepository`: Repository interface for health check operations

### Types

- `HealthStatus`: Health status response structure
- `HealthCheck`: Individual health check result

## Usage

```typescript
import { IHealthRepository, HealthStatus } from '@piar/health-configuration';

// Implement the port in your adapter
class HttpHealthRepository implements IHealthRepository {
  async getHealth(serviceUrl: string): Promise<HealthStatus> {
    // Implementation details
  }
  
  async getHealthWithTimeout(serviceUrl: string, timeout: number): Promise<HealthStatus> {
    // Implementation details
  }
}
```

## Dependencies

This package has **zero dependencies** to maintain clean architecture principles. It only defines contracts.

## Development

```bash
# Build
pnpm --filter @piar/health-configuration build

# Watch mode
pnpm --filter @piar/health-configuration dev

# Type check
pnpm --filter @piar/health-configuration typecheck

# Lint
pnpm --filter @piar/health-configuration lint

# Test
pnpm --filter @piar/health-configuration test
```

## Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│   @piar/health-client (Use Cases)      │
│   - Business Logic                      │
│   - Application Layer                   │
└──────────────┬──────────────────────────┘
               │ depends on
               ▼
┌─────────────────────────────────────────┐
│   @piar/health-configuration (Ports)   │ ◄── YOU ARE HERE
│   - Interfaces                          │
│   - Domain Types                        │
│   - No dependencies                     │
└──────────────▲──────────────────────────┘
               │ implements
               │
┌──────────────┴──────────────────────────┐
│   @piar/health-api (Adapters)          │
│   - HTTP Implementation                 │
│   - External Dependencies               │
└─────────────────────────────────────────┘
```

## Related Packages

- `@piar/health-api`: API adapter implementation
- `@piar/health-client`: Client-side use cases and controllers
