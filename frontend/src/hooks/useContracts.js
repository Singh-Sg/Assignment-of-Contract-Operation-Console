import { useCallback, useEffect, useRef, useState } from 'react';
import { contractApi } from '../api/contractApi';
import { useOrganization } from '../context/OrganizationContext';
import { useRealtime } from '../context/RealtimeContext';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

export function useContracts() {
  const { organizationId } = useOrganization();
  const { subscribeToEvents } = useRealtime();

  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0); 
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const requestIdRef = useRef(0);

  const fetchContracts = useCallback(async () => {
    if (!organizationId) return;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await contractApi.list({
        page: page + 1,
        pageSize,
        search,
        status,
      });
     
      if (requestId !== requestIdRef.current) return;
      const mappedRows = data.map((contract) => ({
        id: contract.id,
        contractNumber: contract.id, 
        clientName: contract.field_data.client_name,
        poRefNo: contract.field_data.po_ref_no,
        poDate: contract.field_data.po_date,
        status: contract.status,
        createdAt: contract.created_at,
      }));
      setRows(mappedRows);
      setRowCount(mappedRows.length);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err.message || 'Failed to load contracts');
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [organizationId, page, pageSize, search, status]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    return subscribeToEvents((event) => {
      if (
        ['CONTRACT_STATUS_CHANGED', 'CONTRACT_CREATED', 'CONTRACT_DELETED', 'CONTRACT_UPDATED'].includes(
          event.type
        )
      ) {
        fetchContracts();
      }
    });
  }, [subscribeToEvents, fetchContracts]);

  const updateSearch = useCallback((value) => {
    setPage(0);
    setSearch(value);
  }, []);

  const updateStatusFilter = useCallback((value) => {
    setPage(0);
    setStatus(value);
  }, []);
  return {
    rows,
    rowCount,
    loading,
    error,
    page,
    pageSize,
    search,
    status,
    setPage,
    setPageSize,
    setSearch: updateSearch,
    setStatus: updateStatusFilter,
    refetch: fetchContracts,
  };
}
