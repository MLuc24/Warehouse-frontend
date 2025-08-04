import React from 'react'
import { ComingSoonPlaceholder } from './ComingSoonPlaceholder'

/**
 * Stock Table Component - Tuần 4-5 Implementation
 * Will include:
 * - Stock level management
 * - Low stock alerts
 * - Stock adjustment tools
 * - Stock history tracking
 */
export const StockTable: React.FC = () => {
  return (
    <ComingSoonPlaceholder
      title="📦 Stock Management"
      description="Quản lý tồn kho với hệ thống cảnh báo và điều chỉnh thông minh"
      expectedWeeks={5}
      features={[
        'Theo dõi mức tồn kho thời gian thực',
        'Cảnh báo hết hàng và sắp hết hàng',
        'Điều chỉnh tồn kho nhanh chóng',
        'Lịch sử xuất nhập kho',
        'Thiết lập điểm đặt hàng lại',
        'Báo cáo tồn kho chi tiết'
      ]}
    />
  )
}

export default StockTable
