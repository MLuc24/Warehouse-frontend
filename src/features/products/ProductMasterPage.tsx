import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { CategoryTable } from './category'
import { StockTable } from './stock'
import { PricingManagement } from './pricing'
import { ExpiryManagement } from './expire'
import { AnalyticsManagement } from './dashboard/AnalyticsManagement'
import { SettingsManagement } from './SettingsManagement'

interface ProductMasterPageProps {
  children?: React.ReactNode
}

/**
 * Product Master Page Component
 * Chỉ xử lý content rendering, Header được xử lý bởi Layout
 */
export const ProductMasterPage: React.FC<ProductMasterPageProps> = ({
  children
}) => {
  const [searchParams] = useSearchParams()

  // Get active tab from URL params, default to 'all-products'
  const activeTab = searchParams.get('tab') || 'all-products'

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
    <>
      {/* Main Content */}
      <div className="space-y-6">
        <Card className="min-h-[calc(100vh-200px)]">
          <div className="p-4">
            {renderTabContent()}
          </div>
        </Card>
      </div>
    </>
  )
}

export default ProductMasterPage
