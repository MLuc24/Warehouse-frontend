import React from 'react'
import { Badge } from '@/components/ui'
import type { ProductStock } from '@/types'

interface StockStatusBadgeProps {
  status: ProductStock['stockStatus']
}

export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: ProductStock['stockStatus']) => {
    switch (status) {
      case 'in-stock': return 'success'
      case 'low-stock': return 'warning'
      case 'out-of-stock': return 'danger'
      case 'overstock': return 'info'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: ProductStock['stockStatus']) => {
    switch (status) {
      case 'in-stock': return 'Còn hàng'
      case 'low-stock': return 'Sắp hết'
      case 'out-of-stock': return 'Hết hàng'
      case 'overstock': return 'Tồn nhiều'
      default: return 'Không xác định'
    }
  }

  return (
    <Badge variant={getStatusColor(status)}>
      {getStatusText(status)}
    </Badge>
  )
}
