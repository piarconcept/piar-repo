import { describe, it, expect } from 'vitest';
import { GetHealthUseCaseExecuter } from '../src/use-cases/get-health.use-case';

describe('GetHealthUseCase', () => {
  it('should return health status with ok status', async () => {
    const useCase = new GetHealthUseCaseExecuter();
    const result = await useCase.execute();

    expect(result).toBeDefined();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('health-api');
    expect(result.timestamp).toBeDefined();
  });

  it('should return valid ISO timestamp', async () => {
    const useCase = new GetHealthUseCaseExecuter();
    const result = await useCase.execute();

    const timestamp = new Date(result.timestamp);
    expect(timestamp.toString()).not.toBe('Invalid Date');
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('should return different timestamps on multiple calls', async () => {
    const useCase = new GetHealthUseCaseExecuter();
    
    const result1 = await useCase.execute();
    await new Promise(resolve => setTimeout(resolve, 10));
    const result2 = await useCase.execute();

    expect(result1.timestamp).not.toBe(result2.timestamp);
  });

  it('should return consistent service name', async () => {
    const useCase = new GetHealthUseCaseExecuter();
    
    const result1 = await useCase.execute();
    const result2 = await useCase.execute();

    expect(result1.service).toBe(result2.service);
    expect(result1.service).toBe('health-api');
  });

  it('should conform to HealthStatus interface', async () => {
    const useCase = new GetHealthUseCaseExecuter();
    const result = await useCase.execute();

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('service');
    expect(result).toHaveProperty('timestamp');
    expect(['ok', 'degraded', 'error']).toContain(result.status);
  });
});
