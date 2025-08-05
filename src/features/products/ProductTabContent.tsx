import React, { useState } from 'react'
import { useProduct } from '@/hooks/useProduct'
import type { Product } from '@/types'

/**
 * Product Tab Content - Simple implementation
 */
export const ProductTabContent: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    products,
    loading,
    error,
    fetchProducts,
    deleteProduct
  } = useProduct()

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id)
      fetchProducts({})
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    fetchProducts({ keyword: term })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Management</h2>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={() => handleSearch(searchTerm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Products List */}
      {!loading && products && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Products ({products.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product.productId} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{product.productName}</h4>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.productId)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal placeholder */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit Product</h3>
            <p>Editing: {selectedProduct.productName}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}