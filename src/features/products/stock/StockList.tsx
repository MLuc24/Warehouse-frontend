import React from 'react'
import { Button } from '@/components/ui'
import { EmptyState } from '@/components/common'
import { Edit, History, AlertTriangle, Package, ChevronUp, ChevronDown } from 'lucide-react'
import { StockStatusBadge } from './StockStatusBadge'
import { StockProgressBar } from './StockProgressBar'
import type { ProductStock } from '@/types'

interface StockListProps {
  stocks: ProductStock[]
  loading?: boolean
  sortBy?: keyof ProductStock
  sortOrder?: 'asc' | 'desc'
  onSort?: (field: keyof ProductStock) => void
  onAdjustStock: (stock: ProductStock) => void
  onSetReorderPoint: (stock: ProductStock) => void
  onViewHistory: (stock: ProductStock) => void
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  onAdjustStock,
  onSetReorderPoint,
  onViewHistory
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (stocks.length === 0) {
    return (
      <EmptyState
        title="Không có sản phẩm nào"
        description="Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại"
      />
    )
  }

  const renderSortableHeader = (field: keyof ProductStock, label: string) => {
    const isSorted = sortBy === field
    const canSort = onSort !== undefined

    return (
      <th
        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
          canSort ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
        }`}
        onClick={() => canSort && onSort(field)}
      >
        <div className="flex items-center gap-1">
          <span>{label}</span>
          {canSort && (
            <div className="flex flex-col">
              <ChevronUp 
                className={`w-3 h-3 ${
                  isSorted && sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'
                }`} 
              />
              <ChevronDown 
                className={`w-3 h-3 -mt-1 ${
                  isSorted && sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'
                }`} 
              />
            </div>
          )}
        </div>
      </th>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stocks.length}</div>
          <div className="text-sm text-gray-600">Tổng sản phẩm</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {stocks.filter(s => s.stockStatus === 'in-stock').length}
          </div>
          <div className="text-sm text-gray-600">Còn hàng</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stocks.filter(s => s.stockStatus === 'low-stock').length}
          </div>
          <div className="text-sm text-gray-600">Sắp hết</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {stocks.filter(s => s.stockStatus === 'out-of-stock').length}
          </div>
          <div className="text-sm text-gray-600">Hết hàng</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {renderSortableHeader('productName', 'Sản phẩm')}
            {renderSortableHeader('currentStock', 'Tồn kho')}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mức tồn
            </th>
            {renderSortableHeader('lastUpdated', 'Cập nhật')}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stocks.map((stock) => (
            <tr key={stock.productId} className="hover:bg-gray-50">
              {/* Product Info */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {stock.productName}
                    </div>
                    <div className="text-sm text-gray-500">
                      SKU: {stock.sku}
                    </div>
                    {stock.category && (
                      <div className="text-xs text-gray-400">
                        {stock.category}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* Current Stock */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {stock.currentStock} {stock.unit}
                </div>
                {stock.stockStatus === 'low-stock' && (
                  <div className="flex items-center gap-1 text-orange-600 mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-xs">Cần đặt hàng</span>
                  </div>
                )}
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <StockStatusBadge status={stock.stockStatus} />
              </td>

              {/* Stock Levels & Progress */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-32">
                  <StockProgressBar
                    current={stock.currentStock}
                    min={stock.minStockLevel || 0}
                    max={stock.maxStockLevel}
                    showLabel={false}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Min: {stock.minStockLevel || '-'}</span>
                    <span>Max: {stock.maxStockLevel || '-'}</span>
                  </div>
                </div>
              </td>

              {/* Last Updated */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {stock.lastUpdated ? 
                  new Date(stock.lastUpdated).toLocaleDateString('vi-VN') : 
                  '-'
                }
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAdjustStock(stock)}
                    className="text-xs"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Điều chỉnh
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetReorderPoint(stock)}
                    className="text-xs"
                  >
                    <Package className="w-3 h-3 mr-1" />
                    Điểm đặt hàng
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewHistory(stock)}
                    className="text-xs"
                  >
                    <History className="w-3 h-3 mr-1" />
                    Lịch sử
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
