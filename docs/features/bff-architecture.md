# BFF Architecture (Backend for Frontend)

## Purpose
Document the BFF (Backend for Frontend) architecture pattern implementation in the PIAR monorepo, explaining the design decisions, structure, and best practices.

## Status
- [x] Completed - Initial BFF architecture documentation

## Overview

The PIAR monorepo implements the **Backend for Frontend (BFF)** pattern, which provides specialized backend services tailored to the specific needs of each frontend application. This approach offers several advantages over a single, generic API:

- **Optimized APIs**: Each BFF is designed specifically for its client's needs
- **Independent Evolution**: BFFs can evolve independently based on client requirements
- **Reduced Over-fetching**: No unnecessary data transfer
- **Simplified Frontend**: Clients don't need complex data aggregation logic
- **Team Autonomy**: Frontend teams can control their backend interface

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Clients                         │
├──────────────────────────┬──────────────────────────────────┤
│   @piar/web              │   @piar/backoffice               │
│   (Public Website)       │   (Admin Panel)                  │
│   Next.js on :3000       │   Next.js on :3001               │
└──────────┬───────────────┴──────────┬───────────────────────┘
           │                          │
           │ HTTP/REST                │ HTTP/REST
           │                          │
┌──────────▼───────────────┬──────────▼───────────────────────┐
│   @piar/web-bff          │   @piar/backoffice-bff           │
│   (Web BFF)              │   (Backoffice BFF)               │
│   NestJS on :3001        │   NestJS on :3002                │
│   - Public data          │   - Admin operations             │
│   - User authentication  │   - User management              │
│   - Content delivery     │   - System configuration         │
│                          │   - Audit logs                   │
└──────────┬───────────────┴──────────┬───────────────────────┘
           │                          │
           │                          │
           └──────────┬───────────────┘
                      │
           ┌──────────▼───────────────┐
           │   Shared Services        │
           ├──────────────────────────┤
           │   - Database             │
           │   - Authentication       │
           │   - Business Logic       │
           │   - External APIs        │
           │   - Message Queues       │
           └──────────────────────────┘
```

## Implementation Details

### Current BFF Applications

#### 1. Web BFF (@piar/web-bff)

**Purpose**: Serves the public-facing web application

**Location**: `apps/api/web-bff`

**Port**: 5000

**Responsibilities**:
- Public content delivery
- User authentication and registration
- Public API endpoints
- Session management
- Rate limiting for public access
- SEO-friendly data formatting

**Target Client**: `@piar/web` (Next.js public website)

**Security Level**: Public-facing, basic authentication

**Documentation**: [web-bff-application.md](web-bff-application.md)

#### 2. Backoffice BFF (@piar/backoffice-bff)

**Purpose**: Serves the admin/backoffice application

**Location**: `apps/api/backoffice-bff`

**Port**: 5050

**Responsibilities**:
- Admin operations
- User management (CRUD)
- System configuration
- Audit logging
- Advanced reporting
- Role-based access control
- Bulk operations

**Target Client**: `@piar/backoffice` (Next.js admin panel)

**Security Level**: High security, admin authentication required

**Documentation**: [backoffice-bff-application.md](backoffice-bff-application.md)

## Technical Stack

### Common Technologies (Both BFFs)

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.9.x
- **Runtime**: Node.js 20.x
- **Testing**: Vitest 2.1.x
- **Module System**: CommonJS (NestJS standard)
- **Build**: NestJS CLI with TypeScript compiler

### Why NestJS?

NestJS was chosen for the BFF layer because:

1. **TypeScript First**: Full type safety end-to-end
2. **Modular Architecture**: Easy to organize code by feature
3. **Dependency Injection**: Clean, testable code
4. **Decorators**: Express API structure clearly
5. **Middleware & Guards**: Built-in request processing
6. **Testing Support**: First-class testing utilities
7. **Production Ready**: Battle-tested in enterprise apps
8. **Documentation**: Excellent docs and community

## Design Principles

### 1. Single Responsibility

Each BFF serves **only one** client application. This ensures:
- Clear ownership
- Focused API design
- No feature bloat
- Easy to reason about

### 2. Client-Driven Design

BFFs are designed **from the client's perspective**:
- Endpoints match UI needs
- Data structures match component requirements
- No unnecessary data transformation in the client

### 3. Independent Deployment

Each BFF can be:
- Deployed independently
- Scaled independently
- Updated without affecting other BFFs
- Versioned separately

### 4. Shared Domain Logic

While BFFs are separate, they share:
- Domain models (`@piar/domain-models`)
- Field configurations (`@piar/domain-fields`)
- Business logic (through shared services)
- Authentication mechanisms

### 5. Security by Design

Security is implemented at the BFF level:
- Authentication at entry point
- Authorization per endpoint
- Input validation
- Rate limiting
- CORS configuration
- Audit logging (especially for backoffice)

## Communication Patterns

### Frontend → BFF

**Protocol**: HTTP/REST

**Authentication**: 
- Web BFF: JWT tokens, session cookies
- Backoffice BFF: JWT tokens with admin claims

**Request Flow**:
```typescript
// Example: Web client fetches user profile
// 1. Client makes request
const response = await fetch('http://localhost:5000/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 2. Web BFF handles request
@Controller('api/user')
export class UserController {
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return this.userService.getProfile(user.id);
  }
}

// 3. BFF returns optimized response
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  // Only fields needed by the UI
}
```

### BFF → Backend Services

BFFs orchestrate calls to:
- **Database**: Direct queries or via repositories
- **External APIs**: Third-party services
- **Microservices**: Internal services
- **Message Queues**: Async operations

**Pattern**: Aggregate, transform, and optimize

```typescript
// BFF aggregates data from multiple sources
async getDashboard(userId: string) {
  const [user, stats, notifications] = await Promise.all([
    this.userService.getUser(userId),
    this.analyticsService.getUserStats(userId),
    this.notificationService.getRecent(userId)
  ]);
  
  // Return aggregated, UI-ready data
  return {
    user: this.transformUser(user),
    stats,
    notifications: notifications.map(this.formatNotification)
  };
}
```

## Project Structure (Per BFF)

```
apps/api/{bff-name}/
├── src/
│   ├── main.ts                    # Application bootstrap
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   │
│   ├── auth/                      # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   │
│   ├── users/                     # Users module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── common/                    # Shared utilities
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── decorators/
│   │
│   └── config/                    # Configuration
│       └── configuration.ts
│
├── test/                          # Tests
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.build.json
└── vitest.config.ts
```

## Module Organization Guidelines

### 1. Feature Modules

Organize by domain feature:

```typescript
// users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export if other modules need it
})
export class UsersModule {}
```

### 2. Shared Modules

Create shared modules for common functionality:

```typescript
// common/common.module.ts
@Module({
  providers: [
    LoggerService,
    ValidationService,
    // Other shared services
  ],
  exports: [LoggerService, ValidationService],
})
export class CommonModule {}
```

### 3. Configuration

Use NestJS config module:

```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
  },
});
```

## Best Practices

### 1. DTOs for Validation

Use DTOs (Data Transfer Objects) with class-validator:

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### 2. Guards for Authorization

Use guards to protect routes:

```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles('admin')
  async getUsers() {
    return this.userService.getAllUsers();
  }
}
```

### 3. Interceptors for Transformation

Use interceptors to transform responses:

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }))
    );
  }
}
```

### 4. Exception Filters

Handle errors consistently:

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 5. Testing Strategy

Comprehensive testing approach:

```typescript
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: vi.fn(),
            findOne: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should return all users', async () => {
    const mockUsers = [{ id: '1', name: 'Test User' }];
    vi.spyOn(service, 'findAll').mockResolvedValue(mockUsers);

    const result = await controller.findAll();
    expect(result).toEqual(mockUsers);
  });
});
```

## Development Workflow

### 1. Adding a New Endpoint

```bash
# Generate a resource (controller + service + module)
cd apps/api/web-bff
npx nest g resource products

# This creates:
# - products/products.module.ts
# - products/products.controller.ts
# - products/products.service.ts
# - products/dto/create-product.dto.ts
# - products/dto/update-product.dto.ts
# - products/entities/product.entity.ts
```

### 2. Running in Development

```bash
# Start with watch mode
pnpm --filter @piar/web-bff dev

# Or start both BFFs
pnpm turbo dev --filter=@piar/web-bff --filter=@piar/backoffice-bff
```

### 3. Testing

```bash
# Run tests for specific BFF
pnpm --filter @piar/web-bff test

# Run with coverage
pnpm --filter @piar/web-bff test:coverage
```

### 4. Building for Production

```bash
# Build specific BFF
pnpm turbo build --filter=@piar/web-bff

# Build all
pnpm turbo build
```

## Deployment Considerations

### Environment Variables

Each BFF needs:

```env
# Application
PORT=5000
NODE_ENV=production

# Client
WEB_CLIENT_URL=https://example.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=user
DB_PASSWORD=secret

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# External Services
API_KEY=your-api-key
```

### Docker Deployment

Example Dockerfile:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm turbo build --filter=@piar/web-bff

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/apps/api/web-bff/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/main"]
```

### Health Checks

Both BFFs include health check endpoints:

```bash
# Check if BFF is running
curl http://localhost:5000/health

# Response:
{
  "status": "ok",
  "timestamp": "2026-01-16T...",
  "service": "web-bff"
}
```

## Scaling Strategy

### Horizontal Scaling

BFFs can be scaled horizontally:

```yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-bff
spec:
  replicas: 3  # Multiple instances
  selector:
    matchLabels:
      app: web-bff
  template:
    metadata:
      labels:
        app: web-bff
    spec:
      containers:
      - name: web-bff
        image: piar/web-bff:latest
        ports:
        - containerPort: 5000
```

### Load Balancing

Use a load balancer (Nginx, ALB, etc.):

```nginx
upstream web_bff {
    server bff1:5000;
    server bff2:5000;
    server bff3:5000;
}

server {
    listen 80;
    location / {
        proxy_pass http://web_bff;
    }
}
```

## Security Checklist

### For Web BFF
- [ ] JWT authentication implemented
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] HTTPS in production
- [ ] Security headers (helmet)
- [ ] Logging enabled

### For Backoffice BFF (Additional)
- [ ] Role-based access control (RBAC)
- [ ] Admin-only guards
- [ ] Audit logging for all operations
- [ ] IP whitelisting (optional)
- [ ] Multi-factor authentication
- [ ] Session timeout
- [ ] Privileged operation confirmation
- [ ] Data encryption at rest

## Monitoring & Observability

### Recommended Tools

1. **Logging**: Winston, Pino
2. **Metrics**: Prometheus
3. **Tracing**: Jaeger, OpenTelemetry
4. **APM**: New Relic, Datadog
5. **Error Tracking**: Sentry

### Key Metrics to Track

- Request rate
- Response time (p50, p95, p99)
- Error rate
- CPU usage
- Memory usage
- Database connection pool
- Cache hit rate

## Future Enhancements

### Planned Improvements

1. **GraphQL Support**
   - Add GraphQL layer alongside REST
   - Use Apollo Server with NestJS

2. **WebSocket Support**
   - Real-time updates for both clients
   - Socket.io integration

3. **API Gateway**
   - Centralized routing
   - Shared authentication
   - Rate limiting

4. **Service Mesh**
   - Istio or Linkerd
   - Advanced traffic management

5. **Event-Driven Architecture**
   - Message queues (RabbitMQ, Kafka)
   - Async communication between BFFs

## Related Documentation

- [Web BFF Application](web-bff-application.md)
- [Backoffice BFF Application](backoffice-bff-application.md)
- [Repository Configuration](repository-configuration.md)
- [Testing Guide](testing-guide.md)
- [Creating Packages](creating-packages.md)

## References

- [NestJS Documentation](https://docs.nestjs.com/)
- [BFF Pattern by Sam Newman](https://samnewman.io/patterns/architectural/bff/)
- [Micro Frontends by Cam Jackson](https://martinfowler.com/articles/micro-frontends.html)

## Last Updated
16 January 2026 - Initial BFF architecture documentation
