import { Button, Card } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import ContractFilters from '../components/contracts/ContractFilters';
import ContractsDataGrid from '../components/contracts/ContractsDataGrid';
import ErrorState from '../components/common/ErrorState';
import { useContracts } from '../hooks/useContracts';

export default function ContractsListPage() {
  const navigate = useNavigate();
  const {
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
    setSearch,
    setStatus,
    refetch,
  } = useContracts();

  return (
    <>
      <PageHeader
        title="Contracts"
        subtitle="Search, filter, and manage all contracts for this organization"
        actions={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => navigate('/contracts/new')}>
            New Contract
          </Button>
        }
      />

      <Card sx={{ p: 2.5 }}>
        <ContractFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        {error ? (
          <ErrorState message={error} onRetry={refetch} minHeight={280} />
        ) : (
          <ContractsDataGrid
            rows={rows}
            rowCount={rowCount}
            loading={loading}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </Card>
    </>
  );
}
