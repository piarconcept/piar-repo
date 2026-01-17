import type { IHealthRepository, HealthStatus } from '@piar/health-configuration';

/**
 * HTTP implementation of Health Repository for frontend
 * Uses fetch API to communicate with backend
 */
export class HttpHealthRepository implements IHealthRepository {
  /**
   * Get health status from a service
   */
  async getHealth(serviceUrl: string): Promise<HealthStatus> {
    try {
      const response = await fetch(serviceUrl);
      
      if (!response.ok) {
        return {
          status: 'error',
          timestamp: new Date().toISOString(),
          service: serviceUrl,
        };
      }

      const data = await response.json();
      return data as HealthStatus;
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        service: serviceUrl,
        checks: [{
          name: 'connection',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Get health status with timeout
   */
  async getHealthWithTimeout(serviceUrl: string, timeout: number): Promise<HealthStatus> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(serviceUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          status: 'error',
          timestamp: new Date().toISOString(),
          service: serviceUrl,
        };
      }

      const data = await response.json();
      return data as HealthStatus;
    } catch (error) {
      clearTimeout(timeoutId);
      
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        service: serviceUrl,
        checks: [{
          name: 'connection',
          status: 'error',
          message: isTimeout ? 'Request timeout' : (error instanceof Error ? error.message : 'Unknown error'),
        }],
      };
    }
  }
}
