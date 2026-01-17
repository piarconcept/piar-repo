# Backoffice BFF Application

## Purpose
Backend for Frontend (BFF) API built with NestJS for the backoffice application. Provides a tailored API layer optimized for admin and management operations.

## Status
- [x] Completed - Initial NestJS setup

## Overview

The Backoffice BFF (Backend for Frontend) is a NestJS application that serves as an intermediary layer between the backoffice client and backend services. It provides:

- **Admin API**: Tailored endpoints for backoffice and administrative operations
- **CORS Configuration**: Pre-configured for backoffice client communication
- **Health Checks**: Monitoring endpoints for deployment health
- **Type Safety**: Full TypeScript support with strict mode
- **Testing**: Vitest integration for unit and integration tests

## Technical Details

### Technology Stack
- **Framework**: NestJS 11.x
- **Runtime**: Node.js 20.x
- **Language**: TypeScript 5.9.x
- **Testing**: Vitest 2.1.x with coverage
- **Build**: NestJS CLI with TypeScript compiler

### Package Information
- **Name**: `@piar/backoffice-bff`
- **Version**: 0.1.0
- **Type**: Private application
- **Location**: `apps/api/backoffice-bff`

### Project Structure

```
apps/api/backoffice-bff/
├── src/
│   ├── main.ts              # Application entry point with bootstrap
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Root controller with health check
│   └── app.service.ts       # Root service
├── test/                    # Test files (future)
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── eslint.config.mjs       # ESLint configuration
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Dependencies and scripts
├── README.md               # Package documentation
├── tsconfig.json           # TypeScript configuration
├── tsconfig.build.json     # Build-specific TypeScript config
└── vitest.config.ts        # Vitest test configuration
```

### Key Features

#### 1. Bootstrap Configuration
- CORS enabled for backoffice client
- Configurable port (default: 3002)
- Environment-based configuration

#### 2. API Endpoints
- `GET /`: Welcome message
- `GET /health`: Health check with timestamp and status

#### 3. Environment Variables
```env
PORT=5050
NODE_ENV=development
BACKOFFICE_CLIENT_URL=http://localhost:3030
```

### Development Scripts

```bash
# Development mode with watch
pnpm --filter @piar/backoffice-bff dev

# Build for production
pnpm --filter @piar/backoffice-bff build

# Start production build
pnpm --filter @piar/backoffice-bff start:prod

# Type checking
pnpm --filter @piar/backoffice-bff typecheck

# Linting
pnpm --filter @piar/backoffice-bff lint

# Testing
pnpm --filter @piar/backoffice-bff test
pnpm --filter @piar/backoffice-bff test:coverage
```

### Dependencies

**Production**:
- `@nestjs/common`: ^11.0.16
- `@nestjs/core`: ^11.0.16
- `@nestjs/platform-express`: ^11.0.16
- `reflect-metadata`: ^0.2.2
- `rxjs`: ^7.8.1

**Development**:
- `@nestjs/cli`: ^11.0.16
- `@nestjs/schematics`: ^11.0.9
- `@nestjs/testing`: ^11.0.16
- `vitest`: ^2.1.9
- `typescript`: ^5.9.3

## Configuration Details

### TypeScript Configuration
- **Target**: ES2021
- **Module**: CommonJS (NestJS standard)
- **Decorators**: Enabled for NestJS
- **Strict Mode**: Enabled for type safety
- **Path Aliases**: `@/*` maps to `src/*`

### ESLint Configuration
- Extends root configuration
- NestJS-specific rules:
  - Interface name prefix: off
  - Explicit return types: off
  - Explicit module boundaries: off
  - No explicit any: warn

### Vitest Configuration
- **Environment**: Node
- **Globals**: Enabled
- **Coverage**: v8 provider with HTML/JSON/text reports
- **Excludes**: node_modules, dist, test files

## Integration

### Monorepo Integration
- Part of pnpm workspace at root
- Uses Turbo for build orchestration
- Follows repository naming conventions (`@piar/` scope)
- Shares common configurations (ESLint, TypeScript)

### Client Integration
The BFF is designed to work with:
- `@piar/backoffice` - Backoffice client application
- CORS configured for local development
- Environment-based client URL configuration

## Usage Examples

### Starting the Server
```bash
# From repository root
pnpm --filter @piar/backoffice-bff dev

# Server starts on http://localhost:3002
```

### Testing the API
```bash
# Health check
curl http://localhost:3002/health

# Response:
# {
#   "status": "ok",
#   "timestamp": "2026-01-16T...",
#   "service": "backoffice-bff"
# }
```

### Adding New Endpoints
1. Create a new module: `nest g module <name>`
2. Create a controller: `nest g controller <name>`
3. Create a service: `nest g service <name>`
4. Import module in `app.module.ts`

## Best Practices

### Module Organization
- Keep modules focused and cohesive
- Use dependency injection for services
- Implement proper error handling
- Add input validation with DTOs
- Use guards for authentication/authorization

### Testing Strategy
- Unit tests for services
- Integration tests for controllers
- E2E tests for critical admin flows
- Maintain >80% coverage

### Security Considerations
- Implement authentication middleware
- Use role-based access control (RBAC)
- Validate and sanitize all inputs
- Log security-relevant events
- Use HTTPS in production

### Error Handling
- Use NestJS exception filters
- Provide meaningful error messages
- Log errors appropriately
- Return consistent error responses

## Future Enhancements

### Planned Features
- [ ] Authentication & authorization (JWT)
- [ ] Role-based access control (RBAC)
- [ ] Audit logging for admin actions
- [ ] API versioning
- [ ] Request logging
- [ ] Rate limiting
- [ ] OpenAPI/Swagger documentation
- [ ] Database integration
- [ ] Admin user management endpoints
- [ ] System configuration endpoints

### Performance Optimizations
- [ ] Response caching
- [ ] Connection pooling
- [ ] Compression middleware
- [ ] Request validation caching

## Differences from Web BFF

While both BFFs share similar architecture, the Backoffice BFF has specific considerations:

1. **Authentication**: More robust auth required for admin access
2. **Authorization**: RBAC for different admin roles
3. **Audit Logging**: Track all administrative actions
4. **Permissions**: Fine-grained permission system
5. **Security**: Enhanced security measures for privileged operations

## Related Documentation
- [Web BFF Application](web-bff-application.md)
- [Repository Configuration](repository-configuration.md)
- [Creating Packages](creating-packages.md)
- [Testing Guide](testing-guide.md)
- [ESLint Configuration](eslint-configuration.md)

## Notes
- This application follows NestJS best practices and conventions
- Uses CommonJS modules (NestJS standard) unlike other packages that use ESM
- Decorators and metadata are essential for NestJS dependency injection
- Health check endpoint is crucial for container orchestration and monitoring
- Security is paramount for backoffice operations - implement auth/authz early

## Last Updated
16 January 2026 - Initial NestJS setup for backoffice-bff application
