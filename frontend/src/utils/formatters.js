export function formatCurrency(value, currency = 'USD') {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function formatNumber(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '—';
  return new Intl.NumberFormat('en-US').format(numeric);
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculateItemTotal(quantity, unitPrice) {
  const q = Number(quantity);
  const p = Number(unitPrice);
  if (Number.isNaN(q) || Number.isNaN(p)) return 0;
  return Math.round(q * p * 100) / 100;
}

export function calculateContractTotal(items = []) {
  return items.reduce((sum, item) => sum + calculateItemTotal(item.quantity, item.unitPrice), 0);
}
