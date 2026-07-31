import { Controller, useFieldArray } from 'react-hook-form';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { QUANTITY_UNITS, PRICING_UNITS, PRICING_UNIT_LABELS } from '../../utils/constants';
import { calculateItemTotal, formatCurrency } from '../../utils/formatters';

const EMPTY_ITEM = {
  description: '',
  quantity: '',
  quantityUnit: QUANTITY_UNITS[0],
  unitPrice: '',
  pricingUnit: PRICING_UNITS[0],
};

export default function ContractItemsFieldArray({ control, register, errors, watch }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');

  return (
    <Box>
      <Stack spacing={2.5}>
        {fields.map((field, index) => {
          const quantity = watchedItems?.[index]?.quantity;
          const unitPrice = watchedItems?.[index]?.unitPrice;
          const total = calculateItemTotal(quantity, unitPrice);
          const itemErrors = errors?.items?.[index];

          return (
            <Box
              key={field.id}
              sx={{
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.default',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2">Item {index + 1}</Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    size="small"
                    {...register(`items.${index}.description`)}
                    error={Boolean(itemErrors?.description)}
                    helperText={itemErrors?.description?.message}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ step: 'any', min: 0 }}
                    {...register(`items.${index}.quantity`)}
                    error={Boolean(itemErrors?.quantity)}
                    helperText={itemErrors?.quantity?.message}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Controller
                    name={`items.${index}.quantityUnit`}
                    control={control}
                    render={({ field: selectField }) => (
                      <TextField {...selectField} select label="Unit" fullWidth size="small">
                        {QUANTITY_UNITS.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Unit Price"
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ step: 'any', min: 0 }}
                    {...register(`items.${index}.unitPrice`)}
                    error={Boolean(itemErrors?.unitPrice)}
                    helperText={itemErrors?.unitPrice?.message}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Controller
                    name={`items.${index}.pricingUnit`}
                    control={control}
                    render={({ field: selectField }) => (
                      <TextField {...selectField} select label="Pricing Unit" fullWidth size="small">
                        {PRICING_UNITS.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {PRICING_UNIT_LABELS[unit]}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <Typography variant="body2" color="text.secondary">
                      Line total:&nbsp;
                      <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {formatCurrency(total)}
                      </Typography>
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </Stack>

      {errors?.items?.message ? (
        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
          {errors.items.message}
        </Typography>
      ) : null}

      <Button
        startIcon={<AddRoundedIcon />}
        onClick={() => append(EMPTY_ITEM)}
        sx={{ mt: 2 }}
        variant="outlined"
      >
        Add Item
      </Button>

      <Divider sx={{ my: 3 }} />
    </Box>
  );
}
