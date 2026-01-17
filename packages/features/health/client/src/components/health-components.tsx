import { useHealth } from '../hooks/use-health';

export interface HealthBadgeProps {
  serviceUrl: string;
  serviceName?: string;
}

/**
 * Health Badge Component
 * Displays health status as a badge
 */
export function HealthBadge({ serviceUrl, serviceName }: HealthBadgeProps) {
  const { status, loading } = useHealth(serviceUrl);

  if (loading) {
    return <span style={{ color: '#999' }}>⏳ Checking...</span>;
  }

  if (!status) {
    return <span style={{ color: '#999' }}>❓ Unknown</span>;
  }

  const statusColors = {
    ok: '#22c55e',
    degraded: '#f59e0b',
    error: '#ef4444',
  };

  const statusIcons = {
    ok: '✓',
    degraded: '⚠',
    error: '✗',
  };

  return (
    <span style={{ color: statusColors[status.status] }}>
      {statusIcons[status.status]} {serviceName || status.service}
    </span>
  );
}

export interface HealthCardProps {
  serviceUrl: string;
  serviceName?: string;
}

/**
 * Health Card Component
 * Displays detailed health information
 */
export function HealthCard({ serviceUrl, serviceName }: HealthCardProps) {
  const { status, loading, refetch } = useHealth(serviceUrl);

  if (loading) {
    return (
      <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const statusColors = {
    ok: '#22c55e',
    degraded: '#f59e0b',
    error: '#ef4444',
  };

  // Check if there's an error in checks
  const errorCheck = status.checks?.find(c => c.status === 'error' && c.name === 'connection');
  
  if (status.status === 'error' && errorCheck) {
    return (
      <div style={{ padding: '1rem', border: '1px solid #ef4444', borderRadius: '0.5rem' }}>
        <p style={{ color: '#ef4444' }}>Error: {errorCheck.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', border: `1px solid ${statusColors[status.status]}`, borderRadius: '0.5rem' }}>
      <h3>{serviceName || status.service}</h3>
      <p>
        Status: <strong style={{ color: statusColors[status.status] }}>{status.status.toUpperCase()}</strong>
      </p>
      <p>
        <small>Last checked: {new Date(status.timestamp).toLocaleString()}</small>
      </p>
      
      {status.version && <p>Version: {status.version}</p>}

      {status.checks && status.checks.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <strong>Checks:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            {status.checks.map((check, idx) => (
              <li key={idx}>
                {check.name}: <span style={{ color: check.status === 'ok' ? '#22c55e' : '#ef4444' }}>
                  {check.status}
                </span>
                {check.message && ` - ${check.message}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={refetch} style={{ marginTop: '0.5rem' }}>
        Refresh
      </button>
    </div>
  );
}
