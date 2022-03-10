export function isRequired (label) {
  return v => !!v || v === 0 || `${label || 'Field'} is required`
}

export function isNumber (label) {
  return v => !v || /^\d+$/.test(v) || `${label || 'Field'} is not a number`
}

export function inRange (label, [min, max]) {
  return v => (
    !v ||
    (!isNaN(v) && min <= parseFloat(v) && parseFloat(v) <= max) ||
    `${label || 'Field'} must be between ${min} and ${max}`
  )
}
