import React, { useState } from 'react'
import { Card } from '@/components/ui'
import { ProductHeader } from './ProductHeader'
import { ProductTabNavigation } from './ProductTabNavigation'
import { ComingSoonPlaceholder } from './ComingSoonPlaceholder'
import { CategoryTable } from './CategoryTable'
import { StockTable } from './StockTable'

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
  { id: 'analytics', label: '📊 Analytics & Reports', description: 'Báo cáo và phân tích', isPlaceholder: true },
  { id: 'categories', label: '📋 Categories', description: 'Quản lý danh mục' },
  { id: 'stock', label: '📦 Stock Management', description: 'Quản lý tồn kho' },
  { id: 'pricing', label: '💰 Pricing', description: 'Quản lý giá cả', isPlaceholder: true },
  { id: 'expiry', label: '⏰ Expiry Management', description: 'Quản lý hạn sử dụng', isPlaceholder: true },
  { id: 'settings', label: '⚙️ Settings', description: 'Cài đặt sản phẩm', isPlaceholder: true }
]

export const ProductMasterLayout: React.FC<ProductMasterLayoutProps> = ({
  quickStats,
  onTabChange,
  activeTab = 'all-products',
  children
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  const renderTabContent = () => {
    const currentTabInfo = TABS.find(tab => tab.id === currentTab)
    
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
    
    if (currentTabInfo?.isPlaceholder) {
      return (
        <ComingSoonPlaceholder
          title={currentTabInfo.label}
          description={currentTabInfo.description}
          expectedWeeks={getExpectedWeeks(currentTab)}
        />
      )
    }

    return children
  }

  const getExpectedWeeks = (tabId: string): number => {
    const weekMap: Record<string, number> = {
      'analytics': 8,
      'categories': 4,
      'stock': 5,
      'pricing': 6,
      'expiry': 7,
      'settings': 10
    }
    return weekMap[tabId] || 10
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section với Quick Stats */}
      <ProductHeader quickStats={quickStats} />

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
    </div>
  )
}

export default ProductMasterLayout
