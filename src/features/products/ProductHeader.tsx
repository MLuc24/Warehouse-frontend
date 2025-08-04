import React from 'react'
import { Card } from '@/components/ui'

interface ProductHeaderProps {
  quickStats: {
    total: number
    active: number
    lowStock: number
    categories: number
  }
}

interface StatCardProps {
  title: string
  value: number
  icon: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
  description?: string
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  variant = 'default',
  description 
}) => {
  const variantStyles = {
    default: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200'
  }

  return (
    <Card className={`p-4 border-l-4 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          {description && (
            <p className="text-xs opacity-60 mt-1">{description}</p>
          )}
        </div>
        <div className="text-3xl opacity-60">
          {icon}
        </div>
      </div>
    </Card>
  )
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ quickStats }) => {
  return (
    <div className="space-y-6">
      {/* Page Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý sản phẩm
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý toàn bộ sản phẩm, danh mục, tồn kho và báo cáo chi tiết
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            📤 Export
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            📥 Import
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            ➕ Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng sản phẩm"
          value={quickStats.total}
          icon="📦"
          variant="default"
          description="Tất cả sản phẩm trong hệ thống"
        />
        <StatCard
          title="Đang hoạt động"
          value={quickStats.active}
          icon="✅"
          variant="success"
          description="Sản phẩm đang được bán"
        />
        <StatCard
          title="Sắp hết hàng"
          value={quickStats.lowStock}
          icon="⚠️"
          variant={quickStats.lowStock > 0 ? 'warning' : 'success'}
          description="Cần nhập thêm hàng"
        />
        <StatCard
          title="Danh mục"
          value={quickStats.categories}
          icon="📋"
          variant="default"
          description="Số danh mục sản phẩm"
        />
      </div>
    </div>
  )
}

export default ProductHeader
