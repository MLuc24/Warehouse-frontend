import React, { useState, useEffect } from 'react'
import { AlertTriangle, Package } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { ExpiryTable } from './ExpiryTable'
import { ExpiryAlerts } from './ExpiryAlerts'
import { EditExpiryModal } from './EditExpiryModal'
import { expiryService } from '@/services/expiry'
import type { ProductExpiryDto, ExpiryAlertDto } from '@/types/expiry'

export const ExpiryManagement: React.FC = () => {
  const [activeView, setActiveView] = useState<'table' | 'alerts'>('table')
  const [selectedProduct, setSelectedProduct] = useState<ProductExpiryDto | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // State management similar to pricing
  const [expiryData, setExpiryData] = useState<ProductExpiryDto[]>([])
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlertDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial data - similar to pricing pattern
  const fetchExpiryData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await expiryService.getExpiryInfo()
      setExpiryData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu hạn sử dụng')
    } finally {
      setLoading(false)
    }
  }

  const fetchAlertsData = async () => {
    try {
      const data = await expiryService.getExpiryAlerts()
      setExpiryAlerts(data)
    } catch (err) {
      console.error('Error fetching alerts:', err)
    }
  }

  useEffect(() => {
    fetchExpiryData()
    fetchAlertsData()
  }, [])

  const handleEditExpiry = (product: ProductExpiryDto) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedProduct(null)
    // Refresh data after closing modal (like pricing does)
    fetchExpiryData()
    fetchAlertsData()
  }

  const handleRefresh = () => {
    fetchExpiryData()
    fetchAlertsData()
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
            <ExpiryTable 
              expiryData={expiryData}
              loading={loading}
              error={error}
              onEditExpiry={handleEditExpiry}
              onRefresh={handleRefresh}
            />
          ) : (
            <ExpiryAlerts 
              alerts={expiryAlerts}
              loading={loading}
            />
          )}
        </div>
      </Card>

      {/* Edit Modal */}
      <EditExpiryModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
      />
    </div>
  )
}
