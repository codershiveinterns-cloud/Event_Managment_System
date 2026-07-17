export default function MoneyText({ value = 0, className = '' }) {
  return <span className={className}>₹{Number(value || 0).toLocaleString('en-IN')}</span>
}
