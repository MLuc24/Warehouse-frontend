import React, { useState, useEffect, useMemo } from 'react'
import { Card, Button } from '@/components/ui'
import { Plus, Download, Package, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react'
import { useStock } from '@/hooks'
import { StockFilters } from './StockFilters'
import { StockList } from './StockList'
import { StockAdjustmentModal } from './StockAdjustmentModal'
import { StockLevelsModal } from './StockLevelsModal'
import { StockHistoryModal } from './StockHistoryModal'
import type { ProductStock, StockAdjustment, StockLevelsUpdate } from '@/types'

/**
 * Stock Table Component - Refactored thành modules
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
    stockHistory,
    loading,
    loadingHistory,
    updating,
    adjusting,
    error,
    fetchAllStock,
    fetchLowStockProducts,
    fetchStockHistory,
    adjustStock,
    setStockLevels,
    clearError
  } = useStock()

  // Modal states
  const [selectedStock, setSelectedStock] = useState<ProductStock | null>(null)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [showReorderModal, setShowReorderModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock'>('all')
  const [sortBy, setSortBy] = useState<keyof ProductStock>('productName')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Load data on mount
  useEffect(() => {
    fetchAllStock()
    fetchLowStockProducts()
  }, [fetchAllStock, fetchLowStockProducts])

  // Filter and sort stocks
  const filteredAndSortedStocks = useMemo(() => {
    const result = stocks.filter(stock => {
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

  // Handlers
  const handleAdjustStock = (stock: ProductStock) => {
    setSelectedStock(stock)
    setShowAdjustModal(true)
  }

  const handleSetStockLevels = (stock: ProductStock) => {
    setSelectedStock(stock)
    setShowReorderModal(true)
  }

  const handleViewHistory = (stock: ProductStock) => {
    setSelectedStock(stock)
    setShowHistoryModal(true)
  }

  const handleStockAdjustment = async (adjustmentData: StockAdjustment) => {
    if (!selectedStock) return false
    const success = await adjustStock(selectedStock.productId, adjustmentData)
    return success
  }

  const handleStockLevelsUpdate = async (stockLevelsData: StockLevelsUpdate) => {
    if (!selectedStock) return false
    const success = await setStockLevels(selectedStock.productId, stockLevelsData)
    return success
  }

  // Sort handling
  const handleSort = (field: keyof ProductStock) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleRefresh = () => {
    fetchAllStock()
    fetchLowStockProducts()
    if (error) clearError()
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="overflow-hidden border-0 shadow-lg">
        {/* Header Background */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Quản lý tồn kho
                </h1>
                <p className="text-blue-100 text-sm">
                  Theo dõi và điều chỉnh tồn kho sản phẩm real-time
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
              
              <Button 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nhập kho mới
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="bg-gradient-to-b from-gray-50 to-white px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{filteredAndSortedStocks.length}</div>
                  <div className="text-sm text-gray-600">Tổng sản phẩm</div>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {filteredAndSortedStocks.filter(s => s.stockStatus === 'in-stock').length}
                  </div>
                  <div className="text-sm text-gray-600">Còn hàng</div>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {filteredAndSortedStocks.filter(s => s.stockStatus === 'low-stock').length}
                  </div>
                  <div className="text-sm text-gray-600">Sắp hết</div>
                </div>
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {filteredAndSortedStocks.filter(s => s.stockStatus === 'out-of-stock').length}
                  </div>
                  <div className="text-sm text-gray-600">Hết hàng</div>
                </div>
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-red-700">Lỗi: {error}</p>
            <Button variant="outline" size="sm" onClick={clearError}>
              Đóng
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-6">
        <StockFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onRefresh={handleRefresh}
          loading={loading}
        />
      </Card>

      {/* Stock List */}
      <Card className="p-6">
        <StockList
          stocks={filteredAndSortedStocks}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onAdjustStock={handleAdjustStock}
          onSetStockLevels={handleSetStockLevels}
          onViewHistory={handleViewHistory}
        />
      </Card>

      {/* Modals */}
      <StockAdjustmentModal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        stock={selectedStock}
        onAdjust={handleStockAdjustment}
        adjusting={adjusting}
      />

      <StockLevelsModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        stock={selectedStock}
        onUpdate={handleStockLevelsUpdate}
        updating={updating}
      />

      <StockHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        stock={selectedStock}
        stockHistory={stockHistory}
        onFetchHistory={fetchStockHistory}
        loading={loadingHistory}
      />
    </div>
  )
}
