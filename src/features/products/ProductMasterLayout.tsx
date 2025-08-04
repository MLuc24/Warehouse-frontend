import React, { useState } from 'react'
import { Card } from '@/components/ui'
import { ProductHeader } from './ProductHeader'
import { ProductTabNavigation } from './ProductTabNavigation'
import { CategoryTable } from './CategoryTable'
import { StockTable } from './StockTable'
import { PricingManagement } from './PricingManagement'
import { ExpiryManagement } from './ExpiryManagement'
import { AnalyticsManagement } from './AnalyticsManagement'
import { SettingsManagement } from './SettingsManagement'
import { ImportExportModal } from './ImportExportModal'
import { exportImportService } from '@/services/exportImport'

interface ProductMasterLayoutProps {
  quickStats: {
    total: number
    active: number
    lowStock: number
    categories: number
  }
  onTabChange?: (tabId: string) => void
  activeTab?: string
  children?: React.ReactNode
}

const TABS = [
  { id: 'all-products', label: '📦 All Products', description: 'Quản lý tất cả sản phẩm' },
  { id: 'analytics', label: '📊 Analytics & Reports', description: 'Báo cáo và phân tích' },
  { id: 'categories', label: '📋 Categories', description: 'Quản lý danh mục' },
  { id: 'stock', label: '📦 Stock Management', description: 'Quản lý tồn kho' },
  { id: 'pricing', label: '💰 Pricing', description: 'Quản lý giá cả' },
  { id: 'expiry', label: '⏰ Expiry Management', description: 'Quản lý hạn sử dụng' },
  { id: 'settings', label: '⚙️ Settings', description: 'Cài đặt hệ thống' }
]

export const ProductMasterLayout: React.FC<ProductMasterLayoutProps> = ({
  quickStats,
  onTabChange,
  activeTab = 'all-products',
  children
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab)
  const [showImportExport, setShowImportExport] = useState(false)

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  const renderTabContent = () => {
    if (currentTab === 'all-products') {
      return children
    }
    
    // Render specific tab content
    if (currentTab === 'categories') {
      return <CategoryTable />
    }
    
    if (currentTab === 'stock') {
      return <StockTable />
    }
    
    if (currentTab === 'pricing') {
      return <PricingManagement />
    }
    
    if (currentTab === 'expiry') {
      return <ExpiryManagement />
    }
    
    if (currentTab === 'analytics') {
      return <AnalyticsManagement />
    }
    
    if (currentTab === 'settings') {
      return <SettingsManagement />
    }

    return children
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section với Quick Stats */}
      <ProductHeader 
        quickStats={quickStats} 
        onImportExportClick={() => setShowImportExport(true)}
        onAddProductClick={() => {
          // Handle add product - would typically open a form modal
          console.log('Add product clicked')
        }}
      />

      {/* Main Content Card */}
      <Card className="min-h-[600px]">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <ProductTabNavigation
            tabs={TABS}
            activeTab={currentTab}
            onTabClick={handleTabClick}
          />
        </div>

        {/* Tab Content Area */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </Card>

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
        title="Sản phẩm"
        data={[]} // Would pass actual product data
        exportFields={exportImportService.getProductExportFields()}
        onImportComplete={(result) => {
          console.log('Import completed:', result)
          // Handle import result - refresh data, show notifications, etc.
        }}
      />
    </div>
  )
}

export default ProductMasterLayout
