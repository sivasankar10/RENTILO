import type { PlatformPayment } from '@shared/store/paymentsStore'

function receiptHtml(payment: PlatformPayment, title: string) {
  const amount =
    payment.amountDisplay.startsWith('$') || payment.amountDisplay.startsWith('₹')
      ? payment.amountDisplay
      : `₹${payment.amount.toLocaleString('en-IN')}`

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${payment.txnId} Receipt</title>
<style>
  body { font-family: Arial, sans-serif; color: #0f172a; padding: 32px; }
  h1 { margin: 0 0 8px; font-size: 28px; }
  .muted { color: #64748b; font-size: 14px; }
  .amount { font-size: 36px; font-weight: 800; margin: 24px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  td { padding: 10px 0; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  td:first-child { width: 180px; color: #64748b; font-weight: 600; }
</style></head><body>
  <p class="muted">RENTILO · ${title}</p>
  <h1>Payment Receipt</h1>
  <p class="muted">${payment.paidAt}</p>
  <div class="amount">${amount}</div>
  <table>
    <tr><td>Status</td><td>${payment.status}</td></tr>
    <tr><td>Category</td><td>${payment.category}</td></tr>
    <tr><td>Transaction ID</td><td>${payment.txnId}</td></tr>
    <tr><td>Reference ID</td><td>${payment.refId}</td></tr>
    <tr><td>Method</td><td>${payment.method}</td></tr>
    <tr><td>Counterparty</td><td>${payment.counterparty}</td></tr>
    ${payment.propertyName ? `<tr><td>Property</td><td>${payment.propertyName}${payment.unit ? ` · ${payment.unit}` : ''}</td></tr>` : ''}
    ${payment.tenantName ? `<tr><td>Tenant</td><td>${payment.tenantName}</td></tr>` : ''}
    ${payment.description ? `<tr><td>Description</td><td>${payment.description}</td></tr>` : ''}
  </table>
</body></html>`
}

export function downloadPaymentReceipt(payment: PlatformPayment, title = 'Official Receipt') {
  const html = receiptHtml(payment, title)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${payment.txnId}-receipt.html`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function printPaymentReceipt(payment: PlatformPayment, title = 'Official Receipt') {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!printWindow) {
    window.print()
    return
  }
  printWindow.document.write(receiptHtml(payment, title))
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}
