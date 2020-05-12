export default function formatPhone(phone) {
  if (!phone) {
    return phone
  }

  if (phone.length > 12) {
    return phone
  }

  if (phone.length === 10) {
    return phone.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2—$3')
  }

  return phone
    .replace(/[^0-9]/g, '')
    .replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5')
}
