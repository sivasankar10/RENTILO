/**
 * Convert an array of records into CSV and trigger a browser download.
 * Lightweight implementation — handles strings, numbers, booleans, escaping.
 */
export function exportToCsv<T extends object>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[],
) {
  if (!rows.length) return

  const cols =
    headers ??
    (Object.keys(rows[0] as Record<string, unknown>).map((k) => ({
      key: k as keyof T,
      label: k,
    })) as { key: keyof T; label: string }[])

  const escape = (val: unknown): string => {
    if (val == null) return ''
    const str = String(val)
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
    return str
  }

  const csvLines = [
    cols.map((c) => escape(c.label)).join(','),
    ...rows.map((row) => cols.map((c) => escape((row as Record<string, unknown>)[c.key as string])).join(',')),
  ]

  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
