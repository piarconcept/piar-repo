# @piar/backoffice-bff

Backend for Frontend (BFF) API for the backoffice application.

## Description

This is a NestJS application that serves as the Backend for Frontend (BFF) layer for the backoffice client. It provides a tailored API interface optimized for the backoffice application's needs, including admin features and management operations.

## Installation

```bash
# From the root of the monorepo
pnpm install
```

## Running the app

```bash
# Development mode with watch
pnpm --filter @piar/backoffice-bff dev

# Production mode
pnpm --filter @piar/backoffice-bff start:prod
```

## Testing

```bash
# Run tests
pnpm --filter @piar/backoffice-bff test

# Run tests with coverage
pnpm --filter @piar/backoffice-bff test:coverage
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT`: Server port (default: 5050)
- `NODE_ENV`: Environment (development/production)
- `BACKOFFICE_CLIENT_URL`: Backoffice client URL for CORS configuration

## API Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint

## Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root module
├── app.controller.ts    # Root controller
└── app.service.ts       # Root service
```

## Development

```bash
# Type check
pnpm --filter @piar/backoffice-bff typecheck

# Lint
pnpm --filter @piar/backoffice-bff lint

# Build
pnpm --filter @piar/backoffice-bff build
```
