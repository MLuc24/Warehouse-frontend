import React from 'react'
import { Button } from '@/components/ui'
import { EmptyState } from '@/components/common'
import { Edit, History, AlertTriangle, Package, ChevronUp, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'
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
  onSetStockLevels: (stock: ProductStock) => void
  onViewHistory: (stock: ProductStock) => void
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  onAdjustStock,
  onSetStockLevels,
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
        className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider transition-colors ${
          canSort ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
        }`}
        onClick={() => canSort && onSort(field)}
      >
        <div className="flex items-center gap-2">
          <span>{label}</span>
          {canSort && (
            <div className="flex flex-col">
              <ChevronUp 
                className={`w-3 h-3 transition-colors ${
                  isSorted && sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'
                }`} 
              />
              <ChevronDown 
                className={`w-3 h-3 -mt-1 transition-colors ${
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
      {/* Enhanced Table */}
      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
              {renderSortableHeader('productName', 'Sản phẩm')}
              {renderSortableHeader('currentStock', 'Tồn kho')}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mức tồn kho
              </th>
              {renderSortableHeader('lastUpdated', 'Cập nhật')}
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
          {stocks.map((stock, index) => (
            <tr 
              key={stock.productId} 
              className={`transition-all duration-200 hover:bg-blue-50 hover:shadow-sm ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
              }`}
            >
              {/* Product Info */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {stock.productName}
                    </div>
                    <div className="text-sm text-gray-500">
                      SKU: {stock.sku}
                    </div>
                    {stock.category && (
                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        {stock.category}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* Current Stock */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-bold text-gray-900">
                    {stock.currentStock}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stock.unit}
                  </div>
                  {stock.stockStatus === 'low-stock' && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  {stock.stockStatus === 'in-stock' && (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                  {stock.stockStatus === 'out-of-stock' && (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                {stock.stockStatus === 'low-stock' && (
                  <div className="text-xs text-orange-600 mt-1 font-medium">
                    Cần đặt hàng
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
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  {stock.lastUpdated ? 
                    new Date(stock.lastUpdated).toLocaleDateString('vi-VN') : 
                    '-'
                  }
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAdjustStock(stock)}
                    className="text-xs px-3 py-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Điều chỉnh
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetStockLevels(stock)}
                    className="text-xs px-3 py-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                  >
                    <Package className="w-3 h-3 mr-1" />
                    Mức tồn
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewHistory(stock)}
                    className="text-xs px-3 py-2 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all"
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
