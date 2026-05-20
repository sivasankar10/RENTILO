import React from 'react'
import { cn } from '@shared/utils/cn'

// ── Column Definition ──
export interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-text-muted text-body">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        {/* Minimalist header: uppercase, tracking-wider, slate-500 */}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left',
                  'text-label font-semibold uppercase tracking-wider text-text-muted',
                  'border-b border-outline',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Rows: 1px border-bottom, no vertical lines */}
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'border-b border-outline last:border-b-0',
                'transition-colors duration-200',
                onRowClick && 'cursor-pointer hover:bg-hover-light'
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-4 py-4 text-body text-text-primary',
                    col.className
                  )}
                >
                  {col.render
                    ? col.render(item)
                    : (item as Record<string, unknown>)[col.key]?.toString() ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
