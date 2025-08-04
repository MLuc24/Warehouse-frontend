import React from 'react'
import { Input, Button } from '@/components/ui'
import { Search, Filter, RefreshCw } from 'lucide-react'
import type { ProductStock } from '@/types'

interface StockFiltersProps {
  searchTerm: string
  onSearchTermChange: (term: string) => void
  statusFilter: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock'
  onStatusFilterChange: (status: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock') => void
  sortBy: keyof ProductStock
  onSortByChange: (sortBy: keyof ProductStock) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  onRefresh: () => void
  loading?: boolean
}

export const StockFilters: React.FC<StockFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onRefresh,
  loading = false
}) => {
  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'in-stock', label: 'Còn hàng' },
    { value: 'low-stock', label: 'Sắp hết' },
    { value: 'out-of-stock', label: 'Hết hàng' },
    { value: 'overstock', label: 'Tồn nhiều' }
  ]

  const sortOptions = [
    { value: 'productName', label: 'Tên sản phẩm' },
    { value: 'sku', label: 'Mã SKU' },
    { value: 'currentStock', label: 'Số lượng hiện tại' },
    { value: 'minStockLevel', label: 'Mức tồn tối thiểu' },
    { value: 'lastUpdated', label: 'Cập nhật gần đây' }
  ]

  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm, SKU..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Lọc:</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as typeof statusFilter)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as keyof ProductStock)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
      </div>
    </div>
  )
}
