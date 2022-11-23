export function isNumber(label) {
  return v => !v || /^\d+$/.test(v) || `${label || 'Field'} is not a number`
}

