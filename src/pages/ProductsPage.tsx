import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [showImportExport, setShowImportExport] = useState(false)

  // Get active tab from URL params, default to 'all-products'
  const activeTab = searchParams.get('tab') || 'all-products'

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
    // Update URL params to persist tab state
    setSearchParams({ tab: tabId })
    console.log('Active tab:', tabId)
  }

  const TABS = [
    { id: 'all-products', label: '📦 All Products', description: 'Quản lý tất cả sản phẩm' },
    { id: 'analytics', label: '📊 Analytics & Reports', description: 'Báo cáo và phân tích' },
    { id: 'categories', label: '📋 Categories', description: 'Quản lý danh mục' },
    { id: 'stock', label: '📦 Stock', description: 'Quản lý tồn kho' },
    { id: 'pricing', label: '💰 Pricing', description: 'Quản lý giá cả' },
    { id: 'expiry', label: '⏰ Expiry', description: 'Quản lý hạn sử dụng' },
    { id: 'settings', label: '⚙️ Settings', description: 'Cài đặt hệ thống' }
  ]

  // Validate and get active tab
  const validTabIds = TABS.map(tab => tab.id)
  const currentTab = validTabIds.includes(activeTab) ? activeTab : 'all-products'

  // Redirect to valid tab if invalid tab is in URL
  useEffect(() => {
    if (!validTabIds.includes(activeTab)) {
      setSearchParams({ tab: 'all-products' })
    }
  }, [activeTab, validTabIds, setSearchParams])

  return (
    <Layout 
      headerContent={
        <ProductPageHeader
          tabs={TABS}
          activeTab={currentTab}
          onTabClick={handleTabChange}
        />
      }
    >
      <ProductMasterLayout
        activeTab={currentTab}
        showImportExport={showImportExport}
        onCloseImportExport={() => setShowImportExport(false)}
      >
        {/* Tab Content Rendering */}
        {currentTab === 'all-products' && <ProductTabContent />}
        {/* Other tabs will show ComingSoonPlaceholder automatically */}
      </ProductMasterLayout>
    </Layout>
  )
}
