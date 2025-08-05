import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { ProductMasterPage, ProductList } from '@/features/products'
import { useProduct } from '@/hooks/useProduct'
import type { Product } from '@/types'

/**
 * Products Page - Sử dụng Layout với sidebar và product tabs trong header
 */
export const ProductsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { products, loading, fetchProducts } = useProduct()

  // Fetch initial data without any filters
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchProducts({})
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    loadInitialData()
  }, [fetchProducts])

  return (
    <Layout showProductTabs={true}>
      <ProductMasterPage>
        {/* Content cho tab "All Products" */}
        <ProductList
          products={products || []}
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
          loading={loading}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={(term: string) => fetchProducts({ keyword: term })}
          onClearSearch={() => {
            setSearchTerm('')
            fetchProducts({})
          }}
        />
      </ProductMasterPage>
    </Layout>
  )
}
