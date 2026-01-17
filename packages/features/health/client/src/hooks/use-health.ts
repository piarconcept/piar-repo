import type { HealthStatus, IHealthRepository } from '@piar/health-configuration';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { HttpHealthRepository } from '../repositories/http-health.repository';

/**
 * Hook to check health status of a service
 */
export function useHealth(serviceUrl: string, repository?: IHealthRepository) {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const repo = useMemo(() => repository || new HttpHealthRepository(), [repository]);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    const healthStatus = await repo.getHealth(serviceUrl);
    setStatus(healthStatus);
    setLoading(false);
  }, [serviceUrl, repo]);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return {
    status,
    loading,
    error,
    refetch: fetchHealth,
    isHealthy: status?.status === 'ok',
  };
}

/**
 * Hook to check health status of multiple services
 */
export function useMultipleHealth(serviceUrls: string[], repository?: IHealthRepository) {
  const [statuses, setStatuses] = useState<HealthStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const repo = useMemo(() => repository || new HttpHealthRepository(), [repository]);
  const urlsRef = useRef(serviceUrls);
  urlsRef.current = serviceUrls;

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);

    const promises = urlsRef.current.map(url => repo.getHealthWithTimeout(url, 5000));
    const results = await Promise.all(promises);
    setStatuses(results);
    setLoading(false);
  }, [repo]);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const isAllHealthy = statuses.every(s => s.status === 'ok');
  const hasError = statuses.some(s => s.status === 'error');

  return {
    statuses,
    loading,
    error,
    refetch: fetchHealth,
    isAllHealthy,
    hasError,
  };
}

/**
 * Hook to poll health status at intervals
 */
export function useHealthPolling(
  serviceUrl: string,
  intervalMs: number = 30000,
  repository?: IHealthRepository
) {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const repo = useMemo(() => repository || new HttpHealthRepository(), [repository]);

  useEffect(() => {
    const fetchHealth = async () => {
      const healthStatus = await repo.getHealth(serviceUrl);
      setStatus(healthStatus);
      setError(null);
      setLoading(false);
    };

    // Initial fetch
    fetchHealth();

    // Set up polling
    const intervalId = setInterval(fetchHealth, intervalMs);

    return () => clearInterval(intervalId);
  }, [serviceUrl, intervalMs, repo]);

  return {
    status,
    loading,
    error,
    isHealthy: status?.status === 'ok',
  };
}
