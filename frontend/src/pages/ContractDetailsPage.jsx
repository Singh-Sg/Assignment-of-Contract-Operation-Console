import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PageHeader from '../components/common/PageHeader';
import StatusChip from '../components/common/StatusChip';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ErrorState from '../components/common/ErrorState';
import { DetailsSkeleton } from '../components/common/SkeletonLoader';
import AuditTimeline from '../components/contracts/AuditTimeline';
import { useContract } from '../hooks/useContract';
import { useAuditHistory } from '../hooks/useAuditHistory';
import { contractApi } from '../api/contractApi';
import { useNotification } from '../context/NotificationContext';
import { formatCurrency, formatDate, calculateItemTotal } from '../utils/formatters';
import { STATUS_TRANSITIONS, STATUS_LABELS } from '../utils/constants';

export default function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const { contract, loading, error, refetch } = useContract(id);
  const {
    events,
    loading: auditLoading,
    error: auditError,
    refetch: refetchAudit,
  } = useAuditHistory(id);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (loading) {
    return (
      <>
        <PageHeader title="Contract Details" />
        <DetailsSkeleton />
      </>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} minHeight={400} />;
  }

  if (!contract) return null;

  const nextStatus = STATUS_TRANSITIONS[contract.status];
  const isDraft = contract.status === 'DRAFT';

  const handleAdvanceStatus = async () => {
    if (!nextStatus) return;
    setActionLoading(true);
    try {
      await contractApi.updateStatus(
        contract.id,
        contract.organization_id,
        nextStatus
      );
      notifySuccess(`Contract ${STATUS_LABELS[nextStatus].toLowerCase()} successfully`);
      setStatusDialogOpen(false);
      refetch();
      refetchAudit();
    } catch (err) {
      notifyError(err.message || 'Failed to update contract status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await contractApi.remove(contract.id);
      notifySuccess('Contract deleted successfully');
      navigate('/contracts');
    } catch (err) {
      notifyError(err.message || 'Failed to delete contract');
      setActionLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={contract.contractNumber || `Contract ${contract.id}`}
        subtitle={contract.clientName}
        actions={
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              startIcon={<EditRoundedIcon />}
              disabled={!isDraft}
              onClick={() => navigate(`/contracts/${contract.id}/edit`)}
            >
              Edit
            </Button>
            {nextStatus ? (
              <Button
                variant="contained"
                color={nextStatus === 'FINALIZED' ? 'success' : 'inherit'}
                startIcon={nextStatus === 'FINALIZED' ? <CheckCircleRoundedIcon /> : <ArchiveRoundedIcon />}
                onClick={() => setStatusDialogOpen(true)}
              >
                {nextStatus === 'FINALIZED' ? 'Finalize' : 'Archive'}
              </Button>
            ) : null}
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineRoundedIcon />}
              disabled={!isDraft}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Card>
              <CardHeader
                title="General Information"
                action={<StatusChip status={contract.status} size="medium" />}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Client Name
                    </Typography>
                    <Typography variant="body1">{contract?.field_data?.client_name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Created Date
                    </Typography>
                    <Typography variant="body1">{formatDate(contract.created_at)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Payment Terms
                    </Typography>
                    <Typography variant="body1">{contract?.field_data?.payment_terms}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Delivery Terms
                    </Typography>
                    <Typography variant="body1">{contract?.field_data?.delivery_terms}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Purchase Order" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      PO Reference No.
                    </Typography>
                    <Typography variant="body1">{contract?.field_data?.po_ref_no}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      PO Date
                    </Typography>
                    <Typography variant="body1">{formatDate(contract?.field_data?.po_date)}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Items" />
              <Divider />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell>Pricing Unit</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(contract.field_data?.items || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell>{item.quantity_unit}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unit_price)}</TableCell>
                        <TableCell>{item.pricing_unit}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(
                            item.total ?? calculateItemTotal(item.quantity, item.unit_price)
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider />
              <CardContent>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Typography variant="subtitle1">Contract Total</Typography>

                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {formatCurrency(
                      (contract.field_data?.items || []).reduce(
                        (sum, item) =>
                          sum +
                          (item.total ??
                            calculateItemTotal(item.quantity, item.unit_price)),
                        0
                      )
                    )}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <AuditTimeline
            events={events}
            loading={auditLoading}
            error={auditError}
            onRetry={refetchAudit}
          />
        </Grid>
      </Grid>

      <ConfirmDialog
        open={statusDialogOpen}
        title={nextStatus === 'FINALIZED' ? 'Finalize contract?' : 'Archive contract?'}
        message={
          nextStatus === 'FINALIZED'
            ? 'Once finalized, this contract can no longer be edited. This action can be reversed only by archiving it later.'
            : 'Archiving this contract removes it from active workflows. This action cannot be undone.'
        }
        confirmLabel={nextStatus === 'FINALIZED' ? 'Finalize' : 'Archive'}
        confirmColor={nextStatus === 'FINALIZED' ? 'success' : 'primary'}
        loading={actionLoading}
        onConfirm={handleAdvanceStatus}
        onClose={() => setStatusDialogOpen(false)}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete this draft contract?"
        message="This will permanently delete the contract. This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        loading={actionLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}
