export function formatMoney (amount, currency = '$', emptyString = '') {
  return amount
    ? `${currency}${parseInt(amount).toLocaleString()}`
    : (emptyString || 'N/A')
}
