export const CONTRACT_STATUSES = ['DRAFT', 'FINALIZED', 'ARCHIVED'];

export const STATUS_TRANSITIONS = {
  DRAFT: 'FINALIZED',
  FINALIZED: 'ARCHIVED',
  ARCHIVED: null,
};

export const STATUS_LABELS = {
  DRAFT: 'Draft',
  FINALIZED: 'Finalized',
  ARCHIVED: 'Archived',
};

export const QUANTITY_UNITS = ['pcs', 'kg', 'g', 'ton', 'litre', 'meter', 'box', 'pallet', 'set'];

export const PRICING_UNITS = ['per_unit', 'per_kg', 'per_litre', 'per_meter', 'per_box', 'per_set', 'lump_sum'];

export const PRICING_UNIT_LABELS = {
  per_unit: 'per unit',
  per_kg: 'per kg',
  per_litre: 'per litre',
  per_meter: 'per meter',
  per_box: 'per box',
  per_set: 'per set',
  lump_sum: 'lump sum',
};

export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const AUDIT_EVENT_LABELS = {
  CREATED: 'Contract created',
  UPDATED: 'Contract updated',
  STATUS_CHANGED: 'Status changed',
  FINALIZED: 'Contract finalized',
  ARCHIVED: 'Contract archived',
  DELETED: 'Contract deleted',
};
