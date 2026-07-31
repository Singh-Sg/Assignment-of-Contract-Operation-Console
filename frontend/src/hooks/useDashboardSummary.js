import { useCallback, useEffect, useState } from 'react';
import { contractApi } from '../api/contractApi';
import { useOrganization } from '../context/OrganizationContext';
import { useRealtime } from '../context/RealtimeContext';

export function useDashboardSummary() {
  const { organizationId } = useOrganization();
  const { subscribeToEvents } = useRealtime();

  const [summary, setSummary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!organizationId) return;
    setLoading(true);
    setError(null);
    try {
      const [contracts, activityData] = await Promise.all([
        contractApi.getSummary(),
        contractApi.getRecentActivity(8),
      ]);
      const summaryData = {
        total: contracts.length,
        draft: contracts.filter(c => c.status === "DRAFT").length,
        finalized: contracts.filter(c => c.status === "FINALIZED").length,
        archived: contracts.filter(c => c.status === "ARCHIVED").length,
      };

      setSummary(summaryData);
      setRecentActivity(Array.isArray(activityData) ? activityData : activityData?.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    return subscribeToEvents((event) => {
      if (
        ['CONTRACT_STATUS_CHANGED', 'CONTRACT_CREATED', 'CONTRACT_DELETED', 'CONTRACT_UPDATED'].includes(
          event.type
        )
      ) {
        fetchDashboardData();
      }
    });
  }, [subscribeToEvents, fetchDashboardData]);

  return { summary, recentActivity, loading, error, refetch: fetchDashboardData };
}
