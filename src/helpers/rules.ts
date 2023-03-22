export function isRequired(label: string): (v) => string | true {
  return v => !!v || v === 0 || `${label || 'Field'} is required`
}

export function isNumber(label: string): (v) => string | true {
  return v => !v || /^\d+$/.test(v) || `${label || 'Field'} is not a number`
}

export function inRange(label: string, [min, max]: number[]): (v) => string | true {
  return v =>
    !v ||
    (!isNaN(v) && min <= parseFloat(v) && parseFloat(v) <= max) ||
    `${label || 'Field'} must be between ${min} and ${max}`
}
