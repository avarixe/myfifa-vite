export function formatDate(date: string | null, dateFormat = 'MMM dd, yyyy') {
  return date ? format(parseISO(date), dateFormat) : null
}

export function formatMoney(
  amount: number | string | null,
  currency = '$',
  emptyString = ''
) {
  return amount
    ? `${currency}${Number(amount).toLocaleString()}`
    : emptyString || 'N/A'
}

export function capitalize(str: string): string {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}
