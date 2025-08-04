import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { ProductMasterLayout, ProductTabContent } from '@/features/products'
import { ProductPageHeader } from '@/features/products/ProductPageHeader'
import { useProduct } from '@/hooks/useProduct'

/**
 * Products Page - Master Layout với Tabs approach
 * Phase 1: Master Layout + All Products Tab (Tuần 1)
 * Phase 2: Enhanced All Products features (Tuần 2-3)
 * Phase 3: Categories & Stock Management (Tuần 4-5)
 */
export const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all-products')
  const [showImportExport, setShowImportExport] = useState(false)

  const { fetchProducts } = useProduct()

  // Fetch initial data without any filters - explicit empty params to avoid backend default filters
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Explicitly pass empty object to ensure no filters are applied
        await fetchProducts({})
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    loadInitialData()
  }, [fetchProducts])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    console.log('Active tab:', tabId)
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

  return (
    <Layout 
      headerContent={
        <ProductPageHeader
          tabs={TABS}
          activeTab={activeTab}
          onTabClick={handleTabChange}
        />
      }
    >
      <ProductMasterLayout
        activeTab={activeTab}
        showImportExport={showImportExport}
        onCloseImportExport={() => setShowImportExport(false)}
      >
        {/* Tab Content Rendering */}
        {activeTab === 'all-products' && <ProductTabContent />}
        {/* Other tabs will show ComingSoonPlaceholder automatically */}
      </ProductMasterLayout>
    </Layout>
  )
}
