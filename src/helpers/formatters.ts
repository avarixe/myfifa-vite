export function formatDate(date, dateFormat = 'MMM dd, yyyy') {
  return date ? format(parseISO(date), dateFormat) : null
}

export function formatMoney(amount, currency = '$', emptyString = '') {
  return amount
    ? `${currency}${parseInt(amount).toLocaleString()}`
    : emptyString || 'N/A'
}

export function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}
