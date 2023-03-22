export function formatDate(date: string, dateFormat = 'MMM dd, yyyy') {
  return date ? format(parseISO(date), dateFormat) : null
}

export function formatMoney(amount: number | string, currency = '$', emptyString = '') {
  return amount
    ? `${currency}${parseInt(amount.toString()).toLocaleString()}`
    : emptyString || 'N/A'
}

export function capitalize(str: string): string {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}
