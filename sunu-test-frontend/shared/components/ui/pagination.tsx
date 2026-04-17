'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Readonly<PaginationProps>) {
  const goToFirst = () => onPageChange(1)
  const goToPrev = () => onPageChange(Math.max(1, currentPage - 1))
  const goToNext = () => onPageChange(Math.min(totalPages, currentPage + 1))
  const goToLast = () => onPageChange(totalPages)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToFirst}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrev}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="px-4 text-sm">
          Page {currentPage} sur {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToLast}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}