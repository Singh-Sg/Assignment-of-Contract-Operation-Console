import { useCallback, useEffect, useState } from 'react';
import { contractApi } from '../api/contractApi';
import { useRealtime } from '../context/RealtimeContext';

export function useContract(contractId) {
  const { subscribeToEvents } = useRealtime();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContract = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await contractApi.getById(contractId);
      setContract(data);
    } catch (err) {
      setError(err.message || 'Failed to load contract');
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  useEffect(() => {
    return subscribeToEvents((event) => {
      if (String(event.contract_id) === String(contractId)) {
        fetchContract();
      }
    });
  }, [subscribeToEvents, contractId, fetchContract]);

  return { contract, loading, error, refetch: fetchContract, setContract };
}
