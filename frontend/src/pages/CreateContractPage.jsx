import { useState } from 'react';
import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import ContractForm from '../components/contracts/ContractForm';
import { contractApi } from '../api/contractApi';
import { formValuesToPayload } from '../utils/contractMapper';
import { useNotification } from '../context/NotificationContext';

export default function CreateContractPage() {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      const payload = {

        field_data: {
          organization_id: values.organizationId,
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
            total: Number(item.total),
          })),
        },
      };

      const created = await contractApi.create(payload);

      notifySuccess("Contract created successfully");
      navigate(`/contracts/${created.id}`);
    } catch (err) {
      notifyError(err.message || "Failed to create contract");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Contract" subtitle="Create a new contract for this organization" />
      <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
        <ContractForm onSubmit={handleSubmit} submitLabel="Create Contract" submitting={submitting} />
      </Card>
    </>
  );
}
