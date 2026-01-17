# Guía para Crear Features

Esta guía describe cómo crear nuevos features siguiendo la arquitectura Clean Architecture del proyecto PIAR.

## Arquitectura de Features

Cada feature se divide en **tres paquetes** independientes:

```
packages/features/{feature-name}/
├── configuration/    # 🔷 Dominio (Ports & Types)
├── api/             # 🔶 Infraestructura NestJS
└── client/          # 🔷 Cliente React
```

### Principios

1. **Clean Architecture**: Separación clara entre dominio, aplicación e infraestructura
2. **Dependency Inversion**: Las dependencias apuntan hacia el dominio
3. **Reutilización**: Tipos compartidos entre API y cliente
4. **Type-safety**: TypeScript end-to-end
5. **Testabilidad**: Cada capa es testeable independientemente

## Paso 1: Crear el paquete Configuration

Este paquete define los **contratos** del feature (ports e interfaces).

### Estructura

```
packages/features/{feature-name}/configuration/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── README.md
└── src/
    ├── index.ts
    ├── ports/              # Interfaces (puertos)
    │   └── {name}-repository.port.ts
    └── common/             # Types, DTOs, Entities
        └── types.ts
```

### package.json

```json
{
  "name": "@piar/{feature-name}-configuration",
  "version": "0.1.0",
  "description": "Domain configuration for {feature-name} feature",
  "type": "module",
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
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@vitest/coverage-v8": "^2.1.9",
    "typescript": "^5.9.3",
    "vitest": "^2.1.9"
  }
}
```

### tsconfig.json

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
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Ejemplo de Port

```typescript
// src/ports/{feature}-repository.port.ts
export interface IFeatureRepository {
  findById(id: string): Promise<FeatureEntity | null>;
  save(entity: FeatureEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Ejemplo de Types

```typescript
// src/common/types.ts
export interface FeatureEntity {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type CreateFeatureDTO = Omit<FeatureEntity, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFeatureDTO = Partial<CreateFeatureDTO>;
```

### src/index.ts

```typescript
// Ports
export * from './ports/{feature}-repository.port';

// Types
export * from './common/types';
```

## Paso 2: Crear el paquete API (NestJS)

Este paquete implementa la **lógica backend** con NestJS.

### Estructura

```
packages/features/{feature-name}/api/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── README.md
└── src/
    ├── index.ts
    ├── controllers/         # Controladores HTTP
    │   └── {feature}.controller.ts
    ├── use-cases/          # Casos de uso (business logic)
    │   ├── create-{feature}.use-case.ts
    │   ├── get-{feature}.use-case.ts
    │   └── index.ts
    ├── modules/            # Módulos NestJS (DI)
    │   └── {feature}.module.ts
    └── repositories/       # Implementaciones de ports (opcional)
        └── {feature}.repository.ts
```

### package.json

```json
{
  "name": "@piar/{feature-name}-api",
  "version": "0.1.0",
  "description": "NestJS API implementation for {feature-name} feature",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.16",
    "@nestjs/core": "^11.0.16",
    "@piar/{feature-name}-configuration": "workspace:*"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.16",
    "@types/node": "^22.10.5",
    "@vitest/coverage-v8": "^2.1.9",
    "typescript": "^5.9.3",
    "vitest": "^2.1.9"
  },
  "peerDependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "moduleResolution": "node",
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
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Ejemplo de Use Case

```typescript
// src/use-cases/get-{feature}.use-case.ts
import { FeatureEntity } from '@piar/{feature-name}-configuration';

/**
 * Use Case Interface
 */
export interface GetFeatureUseCase {
  execute(id: string): Promise<FeatureEntity | null>;
}

/**
 * Symbol for DI
 */
export const GetFeatureUseCase = Symbol('GetFeatureUseCase');

/**
 * Use Case Implementation
 */
export class GetFeatureUseCaseExecuter implements GetFeatureUseCase {
  constructor(
    // Inyectar repositorio si es necesario
    // private readonly repository: IFeatureRepository
  ) {}

  async execute(id: string): Promise<FeatureEntity | null> {
    // Lógica de negocio aquí
    return {
      id,
      name: 'Example',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
```

### Ejemplo de Controller

```typescript
// src/controllers/{feature}.controller.ts
import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { FeatureEntity, CreateFeatureDTO } from '@piar/{feature-name}-configuration';
import { GetFeatureUseCase, CreateFeatureUseCase } from '../use-cases';

@Controller('{feature}')
export class FeatureController {
  constructor(
    @Inject(GetFeatureUseCase)
    private readonly getFeatureUseCase: GetFeatureUseCase,
    @Inject(CreateFeatureUseCase)
    private readonly createFeatureUseCase: CreateFeatureUseCase
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<FeatureEntity | null> {
    return this.getFeatureUseCase.execute(id);
  }

  @Post()
  async create(@Body() dto: CreateFeatureDTO): Promise<FeatureEntity> {
    return this.createFeatureUseCase.execute(dto);
  }
}
```

### Ejemplo de Module

```typescript
// src/modules/{feature}.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { FeatureController } from '../controllers/{feature}.controller';
import { 
  GetFeatureUseCase, 
  GetFeatureUseCaseExecuter,
  CreateFeatureUseCase,
  CreateFeatureUseCaseExecuter
} from '../use-cases';

@Module({
  controllers: [FeatureController],
})
export class FeatureModule {
  static register(): DynamicModule {
    return {
      module: FeatureModule,
      providers: [
        {
          provide: GetFeatureUseCase,
          useFactory: () => new GetFeatureUseCaseExecuter(),
        },
        {
          provide: CreateFeatureUseCase,
          useFactory: () => new CreateFeatureUseCaseExecuter(),
        },
      ],
      exports: [GetFeatureUseCase, CreateFeatureUseCase],
    };
  }
}
```

### src/index.ts

```typescript
// Module
export * from './modules/{feature}.module';

// Controller
export * from './controllers/{feature}.controller';

// Use Cases
export * from './use-cases';
```

## Paso 3: Crear el paquete Client (React)

Este paquete implementa la **lógica frontend** con React.

### Estructura

```
packages/features/{feature-name}/client/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── README.md
└── src/
    ├── index.ts
    ├── repositories/        # Implementación HTTP
    │   └── http-{feature}.repository.ts
    ├── hooks/              # Custom hooks
    │   └── use-{feature}.ts
    └── components/         # React components
        └── {feature}-components.tsx
```

### package.json

```json
{
  "name": "@piar/{feature-name}-client",
  "version": "0.1.0",
  "description": "React client implementation for {feature-name} feature",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "@piar/{feature-name}-configuration": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.0",
    "@vitest/coverage-v8": "^2.1.9",
    "typescript": "^5.9.3",
    "vitest": "^2.1.9"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
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
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Ejemplo de Repository

```typescript
// src/repositories/http-{feature}.repository.ts
import { IFeatureRepository, FeatureEntity } from '@piar/{feature-name}-configuration';

export class HttpFeatureRepository implements IFeatureRepository {
  constructor(private readonly baseUrl: string) {}

  async findById(id: string): Promise<FeatureEntity | null> {
    const response = await fetch(`${this.baseUrl}/{feature}/${id}`);
    if (!response.ok) return null;
    return response.json();
  }

  async save(entity: FeatureEntity): Promise<void> {
    await fetch(`${this.baseUrl}/{feature}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entity),
    });
  }

  async delete(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/{feature}/${id}`, {
      method: 'DELETE',
    });
  }
}
```

### Ejemplo de Hook

```typescript
// src/hooks/use-{feature}.ts
import { useState, useEffect } from 'react';
import { FeatureEntity } from '@piar/{feature-name}-configuration';

export function useFeature(url: string, id: string) {
  const [data, setData] = useState<FeatureEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${url}/{feature}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, id]);

  return { data, loading, error };
}
```

### Ejemplo de Component

```typescript
// src/components/{feature}-components.tsx
import React from 'react';
import { useFeature } from '../hooks/use-{feature}';

export interface FeatureCardProps {
  apiUrl: string;
  featureId: string;
}

export function FeatureCard({ apiUrl, featureId }: FeatureCardProps) {
  const { data, loading, error } = useFeature(apiUrl, featureId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}>
      <h3>{data.name}</h3>
      <p>Status: {data.status}</p>
      <small>Created: {new Date(data.createdAt).toLocaleString()}</small>
    </div>
  );
}
```

### src/index.ts

```typescript
// Repositories
export * from './repositories/http-{feature}.repository';

// Hooks
export * from './hooks/use-{feature}';

// Components
export * from './components/{feature}-components';
```

## Paso 4: Integración en BFFs

### 1. Añadir dependencia

```json
// apps/api/web-bff/package.json
{
  "dependencies": {
    "@piar/{feature-name}-api": "workspace:*"
  }
}
```

### 2. Importar en AppModule

```typescript
// apps/api/web-bff/src/app.module.ts
import { Module } from '@nestjs/common';
import { FeatureModule } from '@piar/{feature-name}-api';

@Module({
  imports: [
    FeatureModule.register(),
    // ... otros módulos
  ],
})
export class AppModule {}
```

## Paso 5: Integración en Clientes

### 1. Añadir dependencia

```json
// apps/client/web/package.json
{
  "dependencies": {
    "@piar/{feature-name}-client": "workspace:*"
  }
}
```

### 2. Usar en componentes

```tsx
// apps/client/web/src/app/page.tsx
import { FeatureCard } from '@piar/{feature-name}-client';

export default function Page() {
  return (
    <FeatureCard 
      apiUrl={process.env.NEXT_PUBLIC_API_URL}
      featureId="123"
    />
  );
}
```

## Checklist de Creación

- [ ] Crear estructura de carpetas: `configuration/`, `api/`, `client/`
- [ ] Crear `package.json` en cada paquete
- [ ] Crear `tsconfig.json` con configuración apropiada
- [ ] Crear `README.md` descriptivo
- [ ] Definir ports y types en `configuration`
- [ ] Implementar use-cases en `api`
- [ ] Implementar controller en `api`
- [ ] Crear module en `api` con DI
- [ ] Implementar repository HTTP en `client`
- [ ] Crear hooks en `client`
- [ ] Crear componentes en `client`
- [ ] Exportar todo en `index.ts`
- [ ] Instalar dependencias: `pnpm install`
- [ ] Build: `pnpm turbo build --filter=@piar/{feature}-*`
- [ ] Integrar en BFFs
- [ ] Integrar en clientes
- [ ] Crear tests
- [ ] Documentar en `docs/features/{feature}-feature.md`

## Ejemplo Completo

Ver el feature `health` como referencia completa:
- [Health Feature Documentation](./health-feature.md)
- Código: `packages/features/health/`

## Buenas Prácticas

1. **Nombres consistentes**: Usa el mismo nombre base en los tres paquetes
2. **Zero dependencies en configuration**: No añadas dependencias externas
3. **Use-cases puros**: La lógica de negocio debe estar en use-cases, no en controllers
4. **Inyección de dependencias**: Usa Symbols y DI para use-cases
5. **Type-safety**: Exporta y reutiliza tipos desde configuration
6. **Tests**: Escribe tests para cada capa independientemente
7. **README**: Documenta cómo usar el feature en cada paquete
8. **Exports limpios**: Expón solo lo necesario en index.ts
