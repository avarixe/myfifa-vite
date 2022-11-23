export function isRequired(label) {
  return v => !!v || v === 0 || `${label || 'Field'} is required`
}
