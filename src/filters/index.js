import { format, parseISO } from 'date-fns'

export function formatDate(date, dateFormat = 'MMM dd, yyyy') {
  return date ? format(parseISO(date), dateFormat) : null
}
