import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { ProductMasterLayout, ProductTabContent } from '@/features/products'
import { useProduct } from '@/hooks/useProduct'

/**
 * Products Page - Master Layout với Tabs approach
 * Phase 1: Master Layout + All Products Tab (Tuần 1)
 * Phase 2: Enhanced All Products features (Tuần 2-3)
 * Phase 3: Categories & Stock Management (Tuần 4-5)
 */
export const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all-products')
  const [quickStats, setQuickStats] = useState({
    total: 0,
    active: 0,
    lowStock: 0,
    categories: 0
  })

  const { products, fetchProducts } = useProduct()

  // Fetch initial data and stats
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchProducts()
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    loadInitialData()
  }, [fetchProducts])

  // Update stats when products change
  useEffect(() => {
    if (products.length > 0) {
      const total = products.length
      const active = products.filter(p => p.status).length
      const lowStock = products.filter(p => p.currentStock < 10).length
      
      setQuickStats({
        total,
        active,
        lowStock,
        categories: 12 // TODO: Fetch from categories API
      })
    }
  }, [products])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    console.log('Active tab:', tabId)
  }

  return (
    <Layout>
      <ProductMasterLayout
        quickStats={quickStats}
        onTabChange={handleTabChange}
        activeTab={activeTab}
      >
        {/* Tab Content Rendering */}
        {activeTab === 'all-products' && <ProductTabContent />}
        {/* Other tabs will show ComingSoonPlaceholder automatically */}
      </ProductMasterLayout>
    </Layout>
  )
}
