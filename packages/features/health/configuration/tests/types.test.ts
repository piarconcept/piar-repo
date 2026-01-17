import { describe, it, expect } from 'vitest';
import type { HealthStatus, HealthCheck } from '../src';

describe('HealthStatus Type', () => {
  it('should accept valid health status with ok status', () => {
    const status: HealthStatus = {
      status: 'ok',
      service: 'test-service',
      timestamp: new Date().toISOString(),
    };

    expect(status.status).toBe('ok');
    expect(status.service).toBe('test-service');
    expect(status.timestamp).toBeDefined();
  });

  it('should accept valid health status with degraded status', () => {
    const status: HealthStatus = {
      status: 'degraded',
      service: 'test-service',
      timestamp: new Date().toISOString(),
    };

    expect(status.status).toBe('degraded');
  });

  it('should accept valid health status with error status', () => {
    const status: HealthStatus = {
      status: 'error',
      service: 'test-service',
      timestamp: new Date().toISOString(),
    };

    expect(status.status).toBe('error');
  });

  it('should accept optional version field', () => {
    const status: HealthStatus = {
      status: 'ok',
      service: 'test-service',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    expect(status.version).toBe('1.0.0');
  });

  it('should accept optional checks field', () => {
    const checks: HealthCheck[] = [
      { name: 'database', status: 'ok' },
      { name: 'cache', status: 'error', message: 'Connection timeout' },
    ];

    const status: HealthStatus = {
      status: 'degraded',
      service: 'test-service',
      timestamp: new Date().toISOString(),
      checks,
    };

    expect(status.checks).toHaveLength(2);
    expect(status.checks?.[0].name).toBe('database');
    expect(status.checks?.[1].message).toBe('Connection timeout');
  });
});

describe('HealthCheck Type', () => {
  it('should accept valid health check with ok status', () => {
    const check: HealthCheck = {
      name: 'database',
      status: 'ok',
    };

    expect(check.name).toBe('database');
    expect(check.status).toBe('ok');
  });

  it('should accept valid health check with error status', () => {
    const check: HealthCheck = {
      name: 'cache',
      status: 'error',
    };

    expect(check.status).toBe('error');
  });

  it('should accept optional message field', () => {
    const check: HealthCheck = {
      name: 'api',
      status: 'error',
      message: 'Service unavailable',
    };

    expect(check.message).toBe('Service unavailable');
  });

});
