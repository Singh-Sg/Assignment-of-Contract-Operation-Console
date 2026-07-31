import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Stack, Tooltip } from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate } from 'react-router-dom';
import StatusChip from '../common/StatusChip';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { PAGE_SIZE_OPTIONS } from '../../utils/constants';

export default function ContractsDataGrid({
  rows,
  rowCount,
  loading,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  const navigate = useNavigate();


  const columns = [
    {
      field: 'contractNumber',
      headerName: 'Contract ID',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>{params.value}</span>
      ),
    },
    { field: 'clientName', headerName: 'Client Name', flex: 1.3, minWidth: 180 },
    { field: 'poRefNo', headerName: 'PO Reference', flex: 1, minWidth: 140 },
    {
      field: 'poDate',
      headerName: 'PO Date',
      flex: 0.8,
      minWidth: 120,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 130,
      sortable: false,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 0.9,
      minWidth: 130,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.7,
      minWidth: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View details">
            <IconButton size="small" onClick={() => navigate(`/contracts/${params.row.id}`)}>
              <VisibilityRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.status === 'DRAFT' ? 'Edit contract' : 'Only drafts can be edited'}>
            <span>
              <IconButton
                size="small"
                disabled={params.row.status !== 'DRAFT'}
                onClick={() => navigate(`/contracts/${params.row.id}/edit`)}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      rowCount={rowCount}
      loading={loading}
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
      disableColumnFilter
      disableColumnMenu
      paginationModel={{ page, pageSize }}
      onPaginationModelChange={(model) => {
        if (model.pageSize !== pageSize) {
          onPageSizeChange(model.pageSize);
        }
        if (model.page !== page) {
          onPageChange(model.page);
        }
      }}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      onRowClick={(params) => navigate(`/contracts/${params.row.id}`)}
      slots={{
        noRowsOverlay: () => (
          <EmptyState
            title="No contracts found"
            message="Try adjusting your search or filters, or create a new contract."
            minHeight={220}
          />
        ),
      }}
      sx={{
        border: 'none',
        '& .MuiDataGrid-row': { cursor: 'pointer' },
        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
          outline: 'none',
        },
      }}
    />
  );
}
