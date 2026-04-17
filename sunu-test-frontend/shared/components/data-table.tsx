'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Pagination } from './ui/pagination'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pageSize: number
  totalItems: number
  renderActions?: (item: T) => React.ReactNode
  emptyMessage?: string
  className?: string
  onPageChange: (page: number) => void
  currentPage: number
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  pageSize,
  totalItems,
  onPageChange,
  currentPage,
  renderActions,
  emptyMessage = "Aucune donnée disponible",
  className = "",
}: Readonly<DataTableProps<T>>) {
  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
              {renderActions && <TableHead className="w-[60px]" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalItems === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index + 1} className="hover:bg-muted/50">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className={col.className}>
                      {col.render ? col.render(item) : ''}
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell className="text-right">
                      {renderActions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}