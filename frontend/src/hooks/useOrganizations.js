import { useCallback, useEffect, useState } from 'react';
import { organizationApi } from '../api/organizationApi';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await organizationApi.list();
      setOrganizations(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return { organizations, loading, error, refetch: fetchOrganizations };
}
