import React, { useState } from 'react'
import { AlertTriangle, Calendar, Package, RefreshCw } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { ExpiryTable } from './ExpiryTable'
import { ExpiryAlerts } from './ExpiryAlerts'
import { EditExpiryModal } from './EditExpiryModal'
import { useExpiry } from '@/hooks/useExpiry'
import type { ProductExpiryDto } from '@/types/expiry'

export const ExpiryManagement: React.FC = () => {
  const [activeView, setActiveView] = useState<'table' | 'alerts'>('table')
  const [selectedProduct, setSelectedProduct] = useState<ProductExpiryDto | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const { 
    fetchExpiryInfo, 
    fetchExpiryAlerts,
    fetchExpiryReport,
    loading 
  } = useExpiry()

  const handleEditExpiry = (product: ProductExpiryDto) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleRefreshData = async () => {
    try {
      await Promise.all([
        fetchExpiryInfo(),
        fetchExpiryAlerts(),
        fetchExpiryReport()
      ])
    } catch (error) {
      console.error('Error refreshing expiry data:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý hạn sử dụng</h2>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý hạn sử dụng sản phẩm
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefreshData}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setActiveView('table')}
          variant={activeView === 'table' ? 'primary' : 'outline'}
          size="sm"
        >
          <Package className="w-4 h-4 mr-2" />
          Danh sách sản phẩm
        </Button>
        
        <Button
          onClick={() => setActiveView('alerts')}
          variant={activeView === 'alerts' ? 'primary' : 'outline'}
          size="sm"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Cảnh báo
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <div className="p-6">
          {activeView === 'table' ? (
            <ExpiryTable onEditExpiry={handleEditExpiry} />
          ) : (
            <ExpiryAlerts />
          )}
        </div>
      </Card>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-lg p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Sản phẩm hết hạn</h3>
                <p className="text-xs text-gray-500">Cần xử lý ngay</p>
              </div>
            </div>
            <div className="mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => {/* TODO: Filter expired products */}}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Sắp hết hạn</h3>
                <p className="text-xs text-gray-500">Trong 7 ngày tới</p>
              </div>
            </div>
            <div className="mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => {/* TODO: Filter expiring soon products */}}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Báo cáo tổng hợp</h3>
                <p className="text-xs text-gray-500">Phân tích chi tiết</p>
              </div>
            </div>
            <div className="mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => {/* TODO: Show detailed report */}}
              >
                Xem báo cáo
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <EditExpiryModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
      />
    </div>
  )
}
