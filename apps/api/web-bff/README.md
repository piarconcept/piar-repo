# @piar/web-bff

Backend for Frontend (BFF) API for the web application.

## Description

This is a NestJS application that serves as the Backend for Frontend (BFF) layer for the web client. It provides a tailored API interface optimized for the web application's needs.

## Installation

```bash
# From the root of the monorepo
pnpm install
```

## Running the app

```bash
# Development mode with watch
pnpm --filter @piar/web-bff dev

# Production mode
pnpm --filter @piar/web-bff start:prod
```

## Testing

```bash
# Run tests
pnpm --filter @piar/web-bff test

# Run tests with coverage
pnpm --filter @piar/web-bff test:coverage
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `WEB_CLIENT_URL`: Web client URL for CORS configuration

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
pnpm --filter @piar/web-bff typecheck

# Lint
pnpm --filter @piar/web-bff lint

# Build
pnpm --filter @piar/web-bff build
```
