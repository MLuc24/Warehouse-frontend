import React, { useState, useEffect } from 'react'
import { Edit, History, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { Button, Input, Badge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/utils'
import type { ProductPricingDto } from '@/types/pricing'

interface PricingTableProps {
  pricingData: ProductPricingDto[]
  loading?: boolean
  error?: string | null
  onEditPrice?: (pricing: ProductPricingDto) => void
  onViewHistory?: (productId: number) => void
  onRefresh?: () => void
  selectedItems?: number[]
  onSelectionChange?: (selectedIds: number[]) => void
}

export const PricingTable: React.FC<PricingTableProps> = ({
  pricingData,
  loading,
  error,
  onEditPrice,
  onViewHistory,
  onRefresh,
  selectedItems = [],
  onSelectionChange
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<ProductPricingDto[]>([])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(pricingData)
    } else {
      const filtered = pricingData.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredData(filtered)
    }
  }, [pricingData, searchTerm])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(filteredData.map(item => item.productId))
    } else {
      onSelectionChange?.([])
    }
  }

  const handleItemSelect = (productId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedItems, productId])
    } else {
      onSelectionChange?.(selectedItems.filter(id => id !== productId))
    }
  }

  const getMarginStatus = (margin?: number) => {
    if (!margin) return { color: 'secondary', label: 'N/A' }
    if (margin < 0) return { color: 'danger', label: 'Lỗ' }
    if (margin < 10) return { color: 'warning', label: 'Thấp' }
    if (margin < 25) return { color: 'info', label: 'OK' }
    return { color: 'success', label: 'Tốt' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải dữ liệu giá...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">❌ {error}</div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          Thử lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="text-sm text-gray-600">
          Hiển thị {filteredData.length} / {pricingData.length} sản phẩm
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá mua
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lợi nhuận
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tỷ suất (%)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cập nhật
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => {
              const marginStatus = getMarginStatus(item.profitMargin)
              const isSelected = selectedItems.includes(item.productId)
              
              return (
                <tr key={item.productId} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleItemSelect(item.productId, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 mr-3">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.productName}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {item.productName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {item.purchasePrice ? formatCurrency(item.purchasePrice) : (
                        <span className="text-gray-400 italic">Chưa có</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {item.sellingPrice ? formatCurrency(item.sellingPrice) : (
                        <span className="text-gray-400 italic">Chưa có</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {item.profitAmount ? (
                        <span className={item.profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(item.profitAmount)}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    {item.profitMargin !== undefined ? (
                      <div className="flex items-center gap-2">
                        <Badge variant={marginStatus.color as 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info'}>
                          {marginStatus.label}
                        </Badge>
                        <span className={`text-sm ${item.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.profitMargin >= 0 ? <TrendingUp className="w-4 h-4 inline" /> : <TrendingDown className="w-4 h-4 inline" />}
                          <span className="ml-1">{item.profitMargin.toFixed(1)}%</span>
                        </span>
                      </div>
                    ) : (
                      <Badge variant="secondary">N/A</Badge>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {item.lastPriceUpdate ? formatDate(item.lastPriceUpdate) : (
                        <span className="text-gray-400 italic">Chưa có</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditPrice?.(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewHistory?.(item.productId)}
                      >
                        <History className="w-4 h-4" />
                      </Button>
                      
                      {(!item.purchasePrice || !item.sellingPrice) && (
                        <div title="Thiếu thông tin giá">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Chưa có dữ liệu giá'}
          </div>
        )}
      </div>
    </div>
  )
}
