export function inRange(label, [min, max]) {
  return v => (
    !v ||
    (!isNaN(v) && min <= parseFloat(v) && parseFloat(v) <= max) ||
    `${label || 'Field'} must be between ${min} and ${max}`
  )
}
