import { format, parseISO } from 'date-fns'

export function formatDate(date, dateFormat = 'MMM dd, yyyy') {
  return date ? format(parseISO(date), dateFormat) : null
}

export function formatMoney(amount, currency = '$', emptyString = '') {
  return amount
    ? `${currency}${parseInt(amount).toLocaleString()}`
    : emptyString || 'N/A'
}
