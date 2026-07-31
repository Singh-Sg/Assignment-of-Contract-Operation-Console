import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import ContractForm from '../components/contracts/ContractForm';
import ErrorState from '../components/common/ErrorState';
import { DetailsSkeleton } from '../components/common/SkeletonLoader';
import { useContract } from '../hooks/useContract';
import { contractApi } from '../api/contractApi';
import { formValuesToPayload, contractToFormValues } from '../utils/contractMapper';
import { useNotification } from '../context/NotificationContext';

export default function EditContractPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const { contract, loading, error, refetch } = useContract(id);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <>
        <PageHeader title="Edit Contract" />
        <DetailsSkeleton />
      </>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} minHeight={400} />;
  }

  if (!contract) return null;

  if (contract.status !== 'DRAFT') {
    return (
      <>
        <PageHeader title="Edit Contract" subtitle={contract.clientName} />
        <Alert severity="warning" sx={{ mb: 2 }}>
          This contract is {contract.status.toLowerCase()} and can no longer be edited. Only contracts in
          draft status are editable.
        </Alert>
        <Button variant="contained" onClick={() => navigate(`/contracts/${contract.id}`)}>
          Back to Contract Details
        </Button>
      </>
    );
  }

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      const payload = {
        field_data: {
          client_name: values.clientName,
          po_ref_no: values.poRefNo,
          po_date: values.poDate,
          payment_terms: values.paymentTerms,
          delivery_terms: values.deliveryTerms,

          items: values.items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            quantity_unit: item.quantityUnit,
            unit_price: Number(item.unitPrice),
            pricing_unit: item.pricingUnit,
            total:
              Number(item.total) ||
              Number(item.quantity) * Number(item.unitPrice),
          })),
        },
      };

      await contractApi.update(
        contract.id,
        contract.organization_id,
        payload
      );

      notifySuccess("Contract updated successfully");

      navigate(`/contracts/${contract.id}`);
    } catch (err) {
      notifyError(err.message || "Failed to update contract");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Edit Contract" subtitle={contract.clientName} />
      <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
        <ContractForm
          defaultValues={contractToFormValues(contract)}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          submitting={submitting}
        />
      </Card>
    </>
  );
}
