import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Alert,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ContractItemsFieldArray from './ContractItemsFieldArray';
import { contractFormSchema } from '../../utils/validationSchemas';
import { calculateContractTotal, formatCurrency } from '../../utils/formatters';
import { QUANTITY_UNITS, PRICING_UNITS } from '../../utils/constants';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';

const DEFAULT_ITEM = {
  description: '',
  quantity: '',
  quantityUnit: QUANTITY_UNITS[0],
  unitPrice: '',
  pricingUnit: PRICING_UNITS[0],
};

const contractJsonItemSchema = z.object({
  description: z
    .string({ required_error: 'Item description is required' })
    .trim()
    .min(1, 'Item description is required'),
  quantity: z.coerce
    .number({ invalid_type_error: 'Quantity must be a number' })
    .gt(0, 'Quantity must be greater than 0'),
  quantity_unit: z.string().trim().optional(),
  unit_price: z.coerce
    .number({ invalid_type_error: 'Unit price must be a number' })
    .gte(0, 'Unit price must be 0 or greater'),
  pricing_unit: z.string().trim().optional(),
  total: z.coerce.number().optional(),
});

const contractJsonUploadSchema = z.object({
  client_name: z
    .string({ required_error: 'Client name is required' })
    .trim()
    .min(1, 'Client name is required'),
  po_ref_no: z
    .string({ required_error: 'PO reference number is required' })
    .trim()
    .min(1, 'PO reference number is required'),
  po_date: z
    .string({ required_error: 'PO date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'PO date must be in YYYY-MM-DD format'),
  payment_terms: z.string().trim().optional(),
  delivery_terms: z.string().trim().optional(),
  items: z
    .array(contractJsonItemSchema, {
      required_error: 'At least one item is required',
    })
    .min(1, 'At least one item is required'),
});

const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export default function ContractForm({ defaultValues, onSubmit, submitLabel = 'Save', submitting }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contractFormSchema),
    defaultValues: defaultValues || {
      clientName: '',
      poRefNo: '',
      poDate: '',
      paymentTerms: '',
      deliveryTerms: '',
      items: [DEFAULT_ITEM],
    },
    mode: 'onBlur',
  });
  const [uploadErrors, setUploadErrors] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const items = watch('items');
  const contractTotal = calculateContractTotal(items || []);

  const handleJsonUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setUploadSuccess('');

   
    const isJsonFile = file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');
    if (!isJsonFile) {
      setUploadErrors(['Please upload a file with a .json extension.']);
      return;
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setUploadErrors(['File is too large. Please upload a JSON file under 2MB.']);
      return;
    }
    if (file.size === 0) {
      setUploadErrors(['The uploaded file is empty.']);
      return;
    }

    let json;
    try {
      const text = await file.text();
      json = JSON.parse(text);
    } catch (err) {
      setUploadErrors(['The file is not valid JSON. Please check its formatting and try again.']);
      return;
    }

    if (typeof json !== 'object' || json === null || Array.isArray(json)) {
      setUploadErrors(['The JSON file must contain a single contract object.']);
      return;
    }

    const result = contractJsonUploadSchema.safeParse(json);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => {
        const path = issue.path.join('.');
        return path ? `${path}: ${issue.message}` : issue.message;
      });
      setUploadErrors(Array.from(new Set(messages)));
      return;
    }

    const data = result.data;

    reset({
      clientName: data.client_name,
      poRefNo: data.po_ref_no,
      poDate: data.po_date,
      paymentTerms: data.payment_terms || '',
      deliveryTerms: data.delivery_terms || '',
      items: data.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        quantityUnit: item.quantity_unit || QUANTITY_UNITS[0],
        unitPrice: item.unit_price,
        pricingUnit: item.pricing_unit || PRICING_UNITS[0],
      })),
    });

    setUploadErrors([]);
    setUploadSuccess('Contract data loaded from file. Review the fields below and save when ready.');
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h6">
            Upload Contract
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Upload structured contract data (.json). The form will be filled automatically.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFileRoundedIcon />}
        >
          Upload JSON

          <input
            hidden
            accept=".json,application/json"
            type="file"
            onChange={handleJsonUpload}
          />
        </Button>
      </Stack>

      {uploadErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: uploadErrors.length > 1 ? 0.5 : 0 }}>
            {uploadErrors.length > 1
              ? 'The uploaded JSON has the following issues:'
              : uploadErrors[0]}
          </Typography>
          {uploadErrors.length > 1 && (
            <List dense sx={{ listStyleType: 'disc', pl: 2, py: 0 }}>
              {uploadErrors.map((message, index) => (
                <ListItem key={index} sx={{ display: 'list-item', p: 0 }}>
                  {message}
                </ListItem>
              ))}
            </List>
          )}
        </Alert>
      )}

      {uploadSuccess && !uploadErrors.length && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setUploadSuccess('')}>
          {uploadSuccess}
        </Alert>
      )}

      <Typography variant="h5" sx={{ mb: 2 }}>
        General Information
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Client Name"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            {...register('clientName')}
            error={Boolean(errors.clientName)}
            helperText={errors.clientName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="PO Reference No."
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            {...register('poRefNo')}
            error={Boolean(errors.poRefNo)}
            helperText={errors.poRefNo?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="PO Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('poDate')}
            error={Boolean(errors.poDate)}
            helperText={errors.poDate?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Payment Terms"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            minRows={1}
            {...register('paymentTerms')}
            error={Boolean(errors.paymentTerms)}
            helperText={errors.paymentTerms?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Delivery Terms"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            minRows={2}
            {...register('deliveryTerms')}
            error={Boolean(errors.deliveryTerms)}
            helperText={errors.deliveryTerms?.message}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, mt: 1 }}>
        Items
      </Typography>
      <ContractItemsFieldArray control={control} register={register} errors={errors} watch={watch} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: -1, mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Contract Total
        </Typography>
        <Typography variant="h4">{formatCurrency(contractTotal)}</Typography>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<SaveRoundedIcon />}
          disabled={submitting}
        >
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
