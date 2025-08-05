import React from 'react'
import { Card } from '@/components/ui'
import { CategoryTable } from './category'
import { StockTable } from './stock'
import { PricingManagement } from './pricing'
import { ExpiryManagement } from './expire'
import { AnalyticsManagement } from './AnalyticsManagement'
import { SettingsManagement } from './SettingsManagement'
import { ImportExportModal } from './ImportExportModal'
import { exportImportService } from '@/services/exportImport'

interface ProductMasterLayoutProps {
  activeTab?: string
  children?: React.ReactNode
  showImportExport?: boolean
  onCloseImportExport?: () => void
}

export const ProductMasterLayout: React.FC<ProductMasterLayoutProps> = ({
  activeTab = 'all-products',
  children,
  showImportExport = false,
  onCloseImportExport
}) => {
  const renderTabContent = () => {
    if (activeTab === 'all-products') {
      return children
    }
    
    // Render specific tab content
    if (activeTab === 'categories') {
      return <CategoryTable />
    }
    
    if (activeTab === 'stock') {
      return <StockTable />
    }
    
    if (activeTab === 'pricing') {
      return <PricingManagement />
    }
    
    if (activeTab === 'expiry') {
      return <ExpiryManagement />
    }
    
    if (activeTab === 'analytics') {
      return <AnalyticsManagement />
    }
    
    if (activeTab === 'settings') {
      return <SettingsManagement />
    }

    return children
  }

  return (
    <div className="space-y-6">
      {/* Main Content Card */}
      <Card className="min-h-[600px]">
        {/* Tab Content Area */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </Card>

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={showImportExport}
        onClose={onCloseImportExport || (() => {})}
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
