'use client'

import { useEffect, useState } from 'react'

export const useClientFormatter = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDate = (dateString: string): string => {
    if (!mounted) return ''
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const formatCurrency = (amount: number): string => {
    if (!mounted) return ''
    return (amount).toLocaleString('fr-FR')
  }

  return { formatDate, formatCurrency, mounted }
}