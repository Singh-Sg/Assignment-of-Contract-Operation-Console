import { z } from 'zod';

export const contractItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description must be under 500 characters'),
  quantity: z
    .coerce.number({ invalid_type_error: 'Quantity must be a number' })
    .positive('Quantity must be greater than 0'),
  quantityUnit: z.string().trim().min(1, 'Quantity unit is required'),
  unitPrice: z
    .coerce.number({ invalid_type_error: 'Unit price must be a number' })
    .nonnegative('Unit price cannot be negative'),
  pricingUnit: z.string().trim().min(1, 'Pricing unit is required'),
});

export const contractFormSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, 'Client name must be at least 2 characters')
    .max(200, 'Client name must be under 200 characters'),
  poRefNo: z
    .string()
    .trim()
    .min(1, 'PO reference number is required')
    .max(100, 'PO reference must be under 100 characters'),
  poDate: z
    .string()
    .min(1, 'PO date is required')
    .refine((val) => !Number.isNaN(new Date(val).getTime()), 'Enter a valid date'),
  paymentTerms: z
    .string()
    .trim()
    .min(1, 'Payment terms are required')
    .max(1000, 'Payment terms must be under 1000 characters'),
  deliveryTerms: z
    .string()
    .trim()
    .min(1, 'Delivery terms are required')
    .max(1000, 'Delivery terms must be under 1000 characters'),
  items: z.array(contractItemSchema).min(1, 'Add at least one item'),
});
