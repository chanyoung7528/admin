// Date formatting
export function formatDate(date: Date | string, _format = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  // TODO: Implement proper date formatting or use date-fns
  return d.toISOString().split('T')[0] ?? '';
}

// Currency formatting
export function formatCurrency(amount: number, currency = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Number formatting
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}
