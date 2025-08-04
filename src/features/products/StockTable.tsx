import React, { useState, useEffect, useMemo } from 'react'
import { Card, Button, Input, Select, Alert, Badge, Progress } from '@/components/ui'
import { GenericList, GenericModal, EmptyState } from '@/components/common'
import { useStock } from '@/hooks'
import type { ProductStock, StockAdjustment, ReorderPointUpdate } from '@/types'

/**
 * Stock Table Component - Tuần 4-5 Implementation
 * Full-featured stock management with:
 * - Stock level management
 * - Low stock alerts
 * - Stock adjustment tools
 * - Stock history tracking
 * - Reorder point management
 */
export const StockTable: React.FC = () => {
  const {
    stocks,
    lowStockProducts,
    stockHistory,
    loading,
    loadingLowStock,
    loadingHistory,
    updating,
    adjusting,
    error,
    fetchAllStock,
    fetchLowStockProducts,
    fetchStockHistory,
    adjustStock,
    setReorderPoint,
    clearError
  } = useStock()

  // Local state
  const [selectedStock, setSelectedStock] = useState<ProductStock | null>(null)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [showReorderModal, setShowReorderModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock'>('all')
  const [sortBy, setSortBy] = useState<keyof ProductStock>('productName')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Adjustment form state
  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease' | 'set'>('increase')
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('')
  const [adjustmentReason, setAdjustmentReason] = useState('')
  const [adjustmentNotes, setAdjustmentNotes] = useState('')

  // Reorder point form state
  const [minStockLevel, setMinStockLevel] = useState('')
  const [maxStockLevel, setMaxStockLevel] = useState('')

  // Load data on mount
  useEffect(() => {
    fetchAllStock()
    fetchLowStockProducts()
  }, [fetchAllStock, fetchLowStockProducts])

  // Filter and sort stocks
  const filteredAndSortedStocks = useMemo(() => {
    let result = stocks.filter(stock => {
      const matchesSearch = stock.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           stock.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (stock.category && stock.category.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || stock.stockStatus === statusFilter
      
      return matchesSearch && matchesStatus
    })

    // Sort stocks
    result.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue, 'vi') 
          : bValue.localeCompare(aValue, 'vi')
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    return result
  }, [stocks, searchTerm, statusFilter, sortBy, sortOrder])

  // Get stock status color
  const getStatusColor = (status: ProductStock['stockStatus']) => {
    switch (status) {
      case 'in-stock': return 'success'
      case 'low-stock': return 'warning'
      case 'out-of-stock': return 'danger'
      case 'overstock': return 'info'
      default: return 'secondary'
    }
  }

  // Get stock status text
  const getStatusText = (status: ProductStock['stockStatus']) => {
    switch (status) {
      case 'in-stock': return 'Còn hàng'
      case 'low-stock': return 'Sắp hết'
      case 'out-of-stock': return 'Hết hàng'
      case 'overstock': return 'Tồn nhiều'
      default: return 'Không xác định'
    }
  }

  // Calculate stock percentage
  const getStockPercentage = (current: number, min: number, max?: number) => {
    if (!max || max <= min) return 100
    const percentage = ((current - min) / (max - min)) * 100
    return Math.max(0, Math.min(100, percentage))
  }

  // Handle stock adjustment
  const handleStockAdjustment = async () => {
    if (!selectedStock || !adjustmentQuantity || !adjustmentReason.trim()) {
      return
    }

    const adjustmentData: StockAdjustment = {
      productId: selectedStock.productId,
      adjustmentType,
      quantity: parseInt(adjustmentQuantity),
      reason: adjustmentReason.trim(),
      notes: adjustmentNotes.trim() || undefined
    }

    const success = await adjustStock(selectedStock.productId, adjustmentData)
    if (success) {
      setShowAdjustModal(false)
      resetAdjustmentForm()
    }
  }

  // Handle reorder point setting
  const handleSetReorderPoint = async () => {
    if (!selectedStock || !minStockLevel) {
      return
    }

    const reorderData: ReorderPointUpdate = {
      minStockLevel: parseInt(minStockLevel),
      maxStockLevel: maxStockLevel ? parseInt(maxStockLevel) : undefined
    }

    const success = await setReorderPoint(selectedStock.productId, reorderData)
    if (success) {
      setShowReorderModal(false)
      resetReorderForm()
    }
  }

  // Handle view history
  const handleViewHistory = async (stock: ProductStock) => {
    setSelectedStock(stock)
    await fetchStockHistory(stock.productId)
    setShowHistoryModal(true)
  }

  // Reset forms
  const resetAdjustmentForm = () => {
    setAdjustmentType('increase')
    setAdjustmentQuantity('')
    setAdjustmentReason('')
    setAdjustmentNotes('')
  }

  const resetReorderForm = () => {
    setMinStockLevel('')
    setMaxStockLevel('')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📦 Quản lý Tồn kho</h2>
          <p className="text-gray-600">Theo dõi và quản lý mức tồn kho sản phẩm</p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => {
              fetchAllStock()
              fetchLowStockProducts()
            }}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Lỗi" message={error} onClose={clearError} />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Tổng sản phẩm</div>
          <div className="text-2xl font-bold text-blue-600">{stocks.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Còn hàng</div>
          <div className="text-2xl font-bold text-green-600">
            {stocks.filter(s => s.stockStatus === 'in-stock').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Sắp hết</div>
          <div className="text-2xl font-bold text-yellow-600">
            {stocks.filter(s => s.stockStatus === 'low-stock').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Hết hàng</div>
          <div className="text-2xl font-bold text-red-600">
            {stocks.filter(s => s.stockStatus === 'out-of-stock').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Tổng giá trị</div>
          <div className="text-2xl font-bold text-purple-600">
            {stocks.reduce((sum, stock) => sum + (stock.totalValue || 0), 0).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
              notation: 'compact'
            })}
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as typeof statusFilter)}
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'in-stock', label: 'Còn hàng' },
                { value: 'low-stock', label: 'Sắp hết' },
                { value: 'out-of-stock', label: 'Hết hàng' },
                { value: 'overstock', label: 'Tồn nhiều' }
              ]}
              placeholder="Lọc theo trạng thái"
            />
          </div>
          
          <div>
            <Select
              value={sortBy as string}
              onChange={(value) => setSortBy(value as keyof ProductStock)}
              options={[
                { value: 'productName', label: 'Tên sản phẩm' },
                { value: 'currentStock', label: 'Tồn kho hiện tại' },
                { value: 'totalValue', label: 'Tổng giá trị' },
                { value: 'lastUpdated', label: 'Cập nhật gần nhất' }
              ]}
              placeholder="Sắp xếp theo"
            />
          </div>
          
          <div>
            <Select
              value={sortOrder}
              onChange={(value) => setSortOrder(value as 'asc' | 'desc')}
              options={[
                { value: 'asc', label: 'Tăng dần' },
                { value: 'desc', label: 'Giảm dần' }
              ]}
              placeholder="Thứ tự"
            />
          </div>
        </div>
      </Card>

      {/* Stock Table */}
      <Card>
        {filteredAndSortedStocks.length === 0 ? (
          loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Đang tải thông tin tồn kho...</div>
            </div>
          ) : (
            <EmptyState
              title="Không có sản phẩm nào"
              description="Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại"
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá trị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cập nhật
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedStocks.map(stock => (
                  <tr key={stock.productId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{stock.productName}</div>
                        <div className="text-sm text-gray-500">
                          SKU: {stock.sku} 
                          {stock.category && <span className="ml-2">• {stock.category}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{stock.currentStock}</span>
                          {stock.unit && <span className="text-gray-500">{stock.unit}</span>}
                        </div>
                        {stock.minStockLevel && (
                          <div>
                            <Progress 
                              value={getStockPercentage(stock.currentStock, stock.minStockLevel, stock.maxStockLevel)}
                              variant={stock.stockStatus === 'low-stock' ? 'warning' : 'success'}
                              size="sm"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              Min: {stock.minStockLevel}
                              {stock.maxStockLevel && ` • Max: ${stock.maxStockLevel}`}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(stock.stockStatus)} size="sm">
                        {getStatusText(stock.stockStatus)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-green-600">
                        {stock.totalValue?.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }) || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(stock.lastUpdated).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedStock(stock)
                            setShowAdjustModal(true)
                          }}
                        >
                          Điều chỉnh
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedStock(stock)
                            setMinStockLevel(stock.minStockLevel?.toString() || '')
                            setMaxStockLevel(stock.maxStockLevel?.toString() || '')
                            setShowReorderModal(true)
                          }}
                        >
                          Đặt lại
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewHistory(stock)}
                        >
                          Lịch sử
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Stock Adjustment Modal */}
      <GenericModal
        isOpen={showAdjustModal}
        onClose={() => {
          setShowAdjustModal(false)
          resetAdjustmentForm()
        }}
        title={`Điều chỉnh tồn kho - ${selectedStock?.productName}`}
        showFooter={true}
        footerContent={
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAdjustModal(false)
                resetAdjustmentForm()
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleStockAdjustment}
              loading={adjusting}
              disabled={!adjustmentQuantity || !adjustmentReason.trim()}
            >
              Điều chỉnh
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại điều chỉnh
            </label>
            <Select
              value={adjustmentType}
              onChange={(value) => setAdjustmentType(value as typeof adjustmentType)}
              options={[
                { value: 'increase', label: 'Tăng tồn kho' },
                { value: 'decrease', label: 'Giảm tồn kho' },
                { value: 'set', label: 'Đặt mức tồn kho' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng
            </label>
            <Input
              type="number"
              value={adjustmentQuantity}
              onChange={(e) => setAdjustmentQuantity(e.target.value)}
              placeholder="Nhập số lượng..."
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do *
            </label>
            <Select
              value={adjustmentReason}
              onChange={setAdjustmentReason}
              options={[
                { value: 'inventory-count', label: 'Kiểm kê tồn kho' },
                { value: 'damaged', label: 'Hàng hỏng' },
                { value: 'expired', label: 'Hết hạn sử dụng' },
                { value: 'lost', label: 'Mất hàng' },
                { value: 'found', label: 'Tìm thấy hàng' },
                { value: 'correction', label: 'Điều chỉnh sai sót' },
                { value: 'other', label: 'Khác' }
              ]}
              placeholder="Chọn lý do điều chỉnh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <Input
              value={adjustmentNotes}
              onChange={(e) => setAdjustmentNotes(e.target.value)}
              placeholder="Ghi chú thêm (tùy chọn)..."
            />
          </div>

          {selectedStock && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm">
                <strong>Tồn kho hiện tại:</strong> {selectedStock.currentStock} {selectedStock.unit}
              </div>
              {adjustmentQuantity && adjustmentType && (
                <div className="text-sm mt-1">
                  <strong>Tồn kho sau điều chỉnh:</strong>{' '}
                  {adjustmentType === 'increase' && selectedStock.currentStock + parseInt(adjustmentQuantity)}
                  {adjustmentType === 'decrease' && Math.max(0, selectedStock.currentStock - parseInt(adjustmentQuantity))}
                  {adjustmentType === 'set' && parseInt(adjustmentQuantity)}
                  {' '}{selectedStock.unit}
                </div>
              )}
            </div>
          )}
        </div>
      </GenericModal>

      {/* Reorder Point Modal */}
      <GenericModal
        isOpen={showReorderModal}
        onClose={() => {
          setShowReorderModal(false)
          resetReorderForm()
        }}
        title={`Thiết lập điểm đặt hàng - ${selectedStock?.productName}`}
        showFooter={true}
        footerContent={
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowReorderModal(false)
                resetReorderForm()
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSetReorderPoint}
              loading={updating}
              disabled={!minStockLevel}
            >
              Cập nhật
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức tồn kho tối thiểu *
            </label>
            <Input
              type="number"
              value={minStockLevel}
              onChange={(e) => setMinStockLevel(e.target.value)}
              placeholder="Nhập mức tồn kho tối thiểu..."
              min="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Hệ thống sẽ cảnh báo khi tồn kho dưới mức này
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức tồn kho tối đa
            </label>
            <Input
              type="number"
              value={maxStockLevel}
              onChange={(e) => setMaxStockLevel(e.target.value)}
              placeholder="Nhập mức tồn kho tối đa (tùy chọn)..."
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hệ thống sẽ cảnh báo khi tồn kho vượt mức này
            </p>
          </div>
        </div>
      </GenericModal>

      {/* Stock History Modal */}
      <GenericModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title={`Lịch sử tồn kho - ${selectedStock?.productName}`}
        showFooter={false}
        size="lg"
      >
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Đang tải lịch sử...</div>
            </div>
          ) : stockHistory.length === 0 ? (
            <EmptyState
              title="Chưa có lịch sử"
              description="Sản phẩm này chưa có lịch sử xuất nhập kho"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lý do</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockHistory.map(history => (
                    <tr key={history.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(history.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-2">
                        <Badge 
                          variant={
                            history.type === 'receive' ? 'success' : 
                            history.type === 'issue' ? 'warning' : 
                            'info'
                          } 
                          size="sm"
                        >
                          {history.type === 'receive' ? 'Nhập' : 
                           history.type === 'issue' ? 'Xuất' : 
                           history.type === 'adjust' ? 'Điều chỉnh' : 
                           'Chuyển'}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {history.type === 'issue' || history.type === 'adjust' && history.quantity < 0 ? '-' : '+'}
                        {Math.abs(history.quantity)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {history.previousStock} → <strong>{history.newStock}</strong>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {history.reason || 'N/A'}
                        {history.notes && (
                          <div className="text-xs text-gray-400 mt-1">{history.notes}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </GenericModal>
    </div>
  )
}

export default StockTable
