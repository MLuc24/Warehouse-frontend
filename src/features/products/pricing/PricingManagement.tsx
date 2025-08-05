import React, { useState, useEffect } from 'react'
import { Plus, Upload, Download, Settings } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { PricingTable } from './PricingTable'
import { BulkPriceUpdate } from './BulkPriceUpdate'
import { PriceHistoryModal } from './PriceHistoryModal'
import { EditPriceModal } from './EditPriceModal'
import { PricingAnalytics } from './PricingAnalytics'
import { usePricing } from '@/hooks/usePricing'
import type { ProductPricingDto } from '@/types/pricing'

export const PricingManagement: React.FC = () => {
  const { pricingData, loading, error, fetchAllPricing } = usePricing()
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [activeView, setActiveView] = useState<'table' | 'analytics'>('table')
  
  // Modal states
  const [showBulkUpdate, setShowBulkUpdate] = useState(false)
  const [showEditPrice, setShowEditPrice] = useState(false)
  const [showPriceHistory, setShowPriceHistory] = useState(false)
  
  // Selected items for modals
  const [selectedProduct, setSelectedProduct] = useState<ProductPricingDto | null>(null)
  const [historyProductId, setHistoryProductId] = useState<number | null>(null)
  const [historyProductName, setHistoryProductName] = useState<string>('')

  const selectedProductNames = selectedProductIds
    .map(id => pricingData.find(p => p.productId === id)?.productName)
    .filter(Boolean) as string[]

  // Load initial data
  useEffect(() => {
    fetchAllPricing()
  }, [fetchAllPricing])

  const handleEditPrice = (product: ProductPricingDto) => {
    setSelectedProduct(product)
    setShowEditPrice(true)
  }

  const handleViewHistory = (productId: number) => {
    const product = pricingData.find(p => p.productId === productId)
    if (product) {
      setHistoryProductId(productId)
      setHistoryProductName(product.productName)
      setShowPriceHistory(true)
    }
  }

  const handleBulkUpdateSuccess = () => {
    setSelectedProductIds([])
    // Refresh data after successful bulk update
    fetchAllPricing()
  }

  const handleEditSuccess = () => {
    // Refresh data after successful edit
    fetchAllPricing()
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý giá sản phẩm</h1>
          <p className="text-gray-600">Quản lý giá mua, giá bán và phân tích lợi nhuận</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('table')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Bảng giá
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'analytics'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Phân tích
            </button>
          </div>

          {/* Action Buttons */}
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {activeView === 'table' && selectedProductIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="info">
                {selectedProductIds.length} sản phẩm được chọn
              </Badge>
              <span className="text-sm text-blue-700">
                Bạn có thể thực hiện các thao tác hàng loạt với các sản phẩm đã chọn
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowBulkUpdate(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Cập nhật giá hàng loạt
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProductIds([])}
              >
                Bỏ chọn
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeView === 'table' ? (
        <PricingTable
          pricingData={pricingData}
          loading={loading}
          error={error}
          onRefresh={fetchAllPricing}
          onEditPrice={handleEditPrice}
          onViewHistory={handleViewHistory}
          selectedItems={selectedProductIds}
          onSelectionChange={setSelectedProductIds}
        />
      ) : (
        <PricingAnalytics />
      )}

      {/* Modals */}
      {showBulkUpdate && (
        <BulkPriceUpdate
          selectedProductIds={selectedProductIds}
          selectedProductNames={selectedProductNames}
          onClose={() => setShowBulkUpdate(false)}
          onSuccess={handleBulkUpdateSuccess}
        />
      )}

      {showEditPrice && selectedProduct && (
        <EditPriceModal
          product={selectedProduct}
          onClose={() => {
            setShowEditPrice(false)
            setSelectedProduct(null)
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {showPriceHistory && historyProductId && (
        <PriceHistoryModal
          productId={historyProductId}
          productName={historyProductName}
          onClose={() => {
            setShowPriceHistory(false)
            setHistoryProductId(null)
            setHistoryProductName('')
          }}
        />
      )}
    </div>
  )
}
