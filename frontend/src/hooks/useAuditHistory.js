import { useCallback, useEffect, useState } from 'react';
import { contractApi } from '../api/contractApi';
import { useRealtime } from '../context/RealtimeContext';

export function useAuditHistory(organization_id) {
  const { subscribeToEvents } = useRealtime();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const organizationId = Number(organization_id)
  const fetchAuditHistory = useCallback(async () => {
    if (!organization_id) return;
    setLoading(true);
    setError(null);

    try {
      const data = await contractApi.getAuditHistory(organizationId);
      setEvents(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load audit history');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchAuditHistory();
  }, [fetchAuditHistory]);

  useEffect(() => {
    return subscribeToEvents((event) => {
      if (String(event.contract_id) === String(organizationId)) {
        fetchAuditHistory();
      }
    });
  }, [subscribeToEvents, organizationId, fetchAuditHistory]);

  return { events, loading, error, refetch: fetchAuditHistory };
}
