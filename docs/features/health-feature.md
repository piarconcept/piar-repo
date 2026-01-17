# Health Feature

## Descripción

El feature `health` proporciona endpoints para verificar el estado de salud de las APIs BFF. Permite monitorear el estado de las aplicaciones y sus dependencias (base de datos, cache, etc.).

## Arquitectura

Este feature sigue **Clean Architecture** con la siguiente estructura de capas:

```
packages/features/health/
├── configuration/          # 🔷 Capa de Dominio (Ports & Interfaces)
│   └── src/
│       └── ports/
│           └── health-repository.port.ts
├── api/                   # 🔶 Capa de Infraestructura (NestJS)
│   └── src/
│       ├── controllers/   # Capa de presentación
│       ├── use-cases/     # Casos de uso (lógica de negocio)
│       ├── modules/       # Módulos NestJS (DI)
│       └── index.ts
└── client/                # 🔷 Capa de Cliente (React)
    └── src/
        ├── repositories/  # Implementación HTTP
        ├── hooks/         # Hooks de React
        └── components/    # Componentes UI
```

### Capas

1. **Configuration (Dominio)**: Define interfaces y tipos sin dependencias
2. **API (NestJS)**: Implementación backend con use-cases, controllers y módulos
3. **Client (React)**: Implementación frontend con hooks y componentes

## Paquetes

### 1. @piar/health-configuration

**Propósito**: Definir contratos y tipos compartidos (capa de dominio pura).

**Características**:
- ✅ Cero dependencias
- ✅ Tipos TypeScript puros
- ✅ Interfaces (ports) para repositorios

**Exports principales**:
```typescript
// Types
interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  timestamp: string;
  version?: string;
  checks?: HealthCheck[];
}

interface HealthCheck {
  name: string;
  status: 'ok' | 'error';
  message?: string;
}

// Ports
interface IHealthRepository {
  getHealth(): Promise<HealthStatus>;
  getHealthWithTimeout(timeoutMs: number): Promise<HealthStatus>;
}
```

### 2. @piar/health-api

**Propósito**: Implementación NestJS con use-cases, controllers y módulos.

**Dependencias**:
- `@nestjs/common`
- `@nestjs/core`
- `@piar/health-configuration`

**Estructura**:

#### Use Cases
Los use-cases encapsulan la lógica de negocio:

```typescript
// get-health.use-case.ts
export interface GetHealthUseCase {
  execute(): Promise<HealthStatus>;
}

export class GetHealthUseCaseExecuter implements GetHealthUseCase {
  async execute(): Promise<HealthStatus> {
    return { 
      status: 'ok',
      service: 'health-api',
      timestamp: new Date().toISOString(),
    };
  }
}
```

#### Controllers
Los controllers exponen los endpoints HTTP:

```typescript
// health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    @Inject(GetHealthUseCase)
    private readonly getHealthUseCase: GetHealthUseCase,
    @Inject(GetDetailedHealthUseCase)
    private readonly getDetailedHealthUseCase: GetDetailedHealthUseCase
  ) {}

  @Get()
  async getHealth(): Promise<HealthStatus> {
    return this.getHealthUseCase.execute();
  }

  @Get('detailed')
  async getDetailedHealth(): Promise<HealthStatus> {
    return this.getDetailedHealthUseCase.execute();
  }
}
```

#### Modules
El módulo configura la inyección de dependencias:

```typescript
// health.module.ts
@Module({
  controllers: [HealthController],
})
export class HealthModule {
  static register(): DynamicModule {
    return {
      module: HealthModule,
      providers: [
        {
          provide: GetHealthUseCase,
          useFactory: () => new GetHealthUseCaseExecuter(),
        },
        {
          provide: GetDetailedHealthUseCase,
          useFactory: () => new GetDetailedHealthUseCaseExecuter(),
        }
      ],
    };
  }
}
```

**Exports principales**:
```typescript
export * from './modules/health.module';
export * from './controllers/health.controller';
export * from './use-cases';
```

### 3. @piar/health-client

**Propósito**: Implementación React con hooks y componentes.

**Dependencias**:
- `react` (peer dependency)
- `@piar/health-configuration`

**Exports principales**:
```typescript
// Hooks
export function useHealth(url: string);
export function useMultipleHealth(urls: string[]);
export function useHealthPolling(url: string, intervalMs: number);

// Components
export function HealthBadge({ serviceUrl, serviceName });
export function HealthCard({ serviceUrl, serviceName });

// Repository
export class HttpHealthRepository implements IHealthRepository;
```

## Integración en BFFs

### 1. Añadir dependencia

```json
// apps/api/web-bff/package.json
{
  "dependencies": {
    "@piar/health-api": "workspace:*"
  }
}
```

### 2. Importar módulo en AppModule

```typescript
// apps/api/web-bff/src/app.module.ts
import { Module } from '@nestjs/common';
import { HealthModule } from '@piar/health-api';

@Module({
  imports: [
    HealthModule.register(),
    // ... otros módulos
  ],
})
export class AppModule {}
```

### 3. Endpoints disponibles

Una vez integrado, los siguientes endpoints estarán disponibles:

- `GET /health` - Health check básico
- `GET /health/detailed` - Health check detallado con checks

#### Ejemplo de respuesta básica
```json
{
  "status": "ok",
  "service": "health-api",
  "timestamp": "2026-01-16T10:30:00.000Z"
}
```

#### Ejemplo de respuesta detallada
```json
{
  "status": "ok",
  "service": "health-api",
  "timestamp": "2026-01-16T10:30:00.000Z",
  "checks": [
    {
      "name": "database",
      "status": "ok"
    },
    {
      "name": "cache",
      "status": "ok"
    }
  ]
}
```

## Integración en Clientes Next.js

### 1. Añadir dependencia

```json
// apps/client/web/package.json
{
  "dependencies": {
    "@piar/health-client": "workspace:*"
  }
}
```

### 2. Usar componentes

```tsx
// apps/client/web/src/app/page.tsx
import { HealthBadge, HealthCard } from '@piar/health-client';

export default function Home() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Badge simple */}
      <HealthBadge 
        serviceUrl="http://localhost:5000/health" 
        serviceName="Web BFF"
      />
      
      {/* Card detallado */}
      <HealthCard 
        serviceUrl="http://localhost:5000/health/detailed"
        serviceName="Web BFF"
      />
    </div>
  );
}
```

### 3. Usar hooks personalizados

```tsx
import { useHealth, useHealthPolling } from '@piar/health-client';

function CustomHealthComponent() {
  // Polling cada 30 segundos
  const { status, loading, error } = useHealthPolling(
    'http://localhost:5000/health',
    30000
  );

  if (loading) return <div>Checking...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Status: {status?.status}</div>;
}
```

## Testing

### Test de Use Cases

```typescript
// tests/get-health.use-case.test.ts
import { describe, it, expect } from 'vitest';
import { GetHealthUseCaseExecuter } from '../src/use-cases';

describe('GetHealthUseCase', () => {
  it('should return health status', async () => {
    const useCase = new GetHealthUseCaseExecuter();
    const result = await useCase.execute();
    
    expect(result.status).toBe('ok');
    expect(result.service).toBe('health-api');
    expect(result.timestamp).toBeDefined();
  });
});
```

### Test de Controllers

```typescript
// tests/health.controller.test.ts
import { Test } from '@nestjs/testing';
import { HealthController } from '../src/controllers/health.controller';
import { GetHealthUseCase } from '../src/use-cases';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: GetHealthUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({
              status: 'ok',
              service: 'test',
              timestamp: new Date().toISOString(),
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return health status', async () => {
    const result = await controller.getHealth();
    expect(result.status).toBe('ok');
  });
});
```

## Scripts útiles

```bash
# Build todos los paquetes health
pnpm turbo build --filter=@piar/health-*

# Test todos los paquetes health
pnpm turbo test --filter=@piar/health-*

# Iniciar web-bff con health
pnpm run dev:web-bff

# Iniciar backoffice-bff con health
pnpm run dev:backoffice-bff

# Test manual del endpoint
curl http://localhost:5000/health
curl http://localhost:5000/health/detailed
```

## Ventajas de esta arquitectura

1. **Separación de responsabilidades**: Cada capa tiene una responsabilidad clara
2. **Reutilización**: Los tipos y contratos son compartidos entre API y cliente
3. **Testabilidad**: Los use-cases son fáciles de testear sin dependencias de NestJS
4. **Escalabilidad**: Fácil añadir nuevos checks o funcionalidades
5. **Type-safety**: TypeScript garantiza consistencia entre capas
6. **Independencia**: Los módulos pueden evolucionar independientemente

## Próximos pasos

- [ ] Añadir checks de base de datos reales
- [ ] Añadir checks de servicios externos
- [ ] Implementar health checks con Kubernetes liveness/readiness probes
- [ ] Añadir métricas de performance
- [ ] Implementar alertas basadas en health status
