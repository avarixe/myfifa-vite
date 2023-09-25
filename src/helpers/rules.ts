export function isRequired(
  label: string
): (v: string | number | null) => string | true {
  return v => !!v || v === 0 || `${label || 'Field'} is required`
}

export function isNumber(label: string): (v: string | null) => string | true {
  return v => !v || /^\d+$/.test(v) || `${label || 'Field'} is not a number`
}

export function inRange(
  label: string,
  [min, max]: number[]
): (v: number | string | null) => string | true {
  return v =>
    !v ||
    (!isNaN(Number(String(v))) && min <= Number(v) && Number(v) <= max) ||
    `${label || 'Field'} must be between ${min} and ${max}`
}
