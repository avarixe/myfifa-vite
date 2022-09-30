import { format, parseISO } from 'date-fns'

export default function (date, dateFormat = 'MMM dd, yyyy') {
  return date ? format(parseISO(date), dateFormat) : null
}
