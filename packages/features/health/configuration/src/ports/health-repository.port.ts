/**
 * Health status response structure
 */
export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  service: string;
  version?: string;
  checks?: HealthCheck[];
}

/**
 * Individual health check result
 */
export interface HealthCheck {
  name: string;
  status: 'ok' | 'error';
  message?: string;
  duration?: number;
}

/**
 * Health repository port (interface)
 * This defines the contract that any health check implementation must follow
 */
export interface IHealthRepository {
  /**
   * Get health status from a service
   * @param serviceUrl - The URL of the service to check
   * @returns Promise with the health status
   */
  getHealth(serviceUrl: string): Promise<HealthStatus>;

  /**
   * Get health status with timeout
   * @param serviceUrl - The URL of the service to check
   * @param timeout - Timeout in milliseconds
   * @returns Promise with the health status
   */
  getHealthWithTimeout(serviceUrl: string, timeout: number): Promise<HealthStatus>;
}
