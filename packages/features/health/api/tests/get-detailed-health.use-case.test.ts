import { describe, it, expect } from 'vitest';
import { GetDetailedHealthUseCaseExecuter } from '../src/use-cases/get-detailed-health.use-case';

describe('GetDetailedHealthUseCase', () => {
  it('should return health status with ok status', async () => {
    const useCase = new GetDetailedHealthUseCaseExecuter();
    const result = await useCase.execute();

    expect(result).toBeDefined();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('health-api');
    expect(result.timestamp).toBeDefined();
  });

  it('should include health checks', async () => {
    const useCase = new GetDetailedHealthUseCaseExecuter();
    const result = await useCase.execute();

    expect(result.checks).toBeDefined();
    expect(Array.isArray(result.checks)).toBe(true);
  });

  it('should include database check', async () => {
    const useCase = new GetDetailedHealthUseCaseExecuter();
    const result = await useCase.execute();

    const databaseCheck = result.checks?.find(check => check.name === 'database');
    expect(databaseCheck).toBeDefined();
    expect(databaseCheck?.status).toBe('ok');
  });

  it('should include cache check', async () => {
    const useCase = new GetDetailedHealthUseCaseExecuter();
    const result = await useCase.execute();

    const cacheCheck = result.checks?.find(check => check.name === 'cache');
    expect(cacheCheck).toBeDefined();
    expect(cacheCheck?.status).toBe('ok');
  });

  it('should return valid ISO timestamp', async () => {
    const useCase = new GetDetailedHealthUseCaseExecuter();
    const result = await useCase.execute();

    const timestamp = new Date(result.timestamp);
    expect(timestamp.toString()).not.toBe('Invalid Date');
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('should conform to HealthStatus interface with checks', async () => {
    const useCase = new GetDetailedHealthUseCaseExecuter();
    const result = await useCase.execute();

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('service');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('checks');
    expect(['ok', 'degraded', 'error']).toContain(result.status);

    result.checks?.forEach(check => {
      expect(check).toHaveProperty('name');
      expect(check).toHaveProperty('status');
      expect(['ok', 'error']).toContain(check.status);
    });
  });

  it('should return at least 2 checks', async () => {
    const useCase = new GetDetailedHealthUseCaseExecuter();
    const result = await useCase.execute();

    expect(result.checks?.length).toBeGreaterThanOrEqual(2);
  });
});
