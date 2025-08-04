import React, { useState } from 'react'
import { Card } from '@/components/ui'
import { useProduct } from '@/hooks/useProduct'
// Import reorganized CRUD components from local directories
import { ProductList } from './list'
import { ProductInline } from './inline'
import type { Product } from '@/types'

/**
 * Product Tab Content - Sử dụng các CRUD components ban đầu
 * Chỉ sử dụng ProductList + ProductInlineEdit từ components/products
 */
export const ProductTabContent: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProduct()

  // Handlers for original CRUD components
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleSaveInlineEdit = async (data: Partial<Product>) => {
    if (updateProduct && selectedProduct && data.sku && data.productName) {
      // Convert to UpdateProduct format
      const updateData = {
        sku: data.sku,
        productName: data.productName,
        description: data.description,
        supplierId: data.supplierId,
        unit: data.unit,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        imageUrl: data.imageUrl,
        status: data.status
      }
      await updateProduct(selectedProduct.productId, updateData)
      fetchProducts() // Refresh list
    }
  }

  const handleDeleteProduct = async (id: number | string) => {
    if (deleteProduct) {
      await deleteProduct(Number(id))
      setSelectedProduct(null)
      fetchProducts() // Refresh list
    }
  }

  const handleCancelInlineEdit = () => {
    setSelectedProduct(null)
  }

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term)
  }

  const handleSearch = (term: string) => {
    fetchProducts({ keyword: term })
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    fetchProducts()
  }

  const handleShowCreate = () => {
    setIsCreateMode(true)
    setSelectedProduct(null) // Clear any selected product
  }

  const handleCreateProduct = async (productData: Partial<Product>) => {
    if (createProduct && productData.sku && productData.productName) {
      // Convert to CreateProduct format
      const createData = {
        sku: productData.sku,
        productName: productData.productName,
        description: productData.description,
        supplierId: productData.supplierId,
        unit: productData.unit,
        purchasePrice: productData.purchasePrice,
        sellingPrice: productData.sellingPrice,
        imageUrl: productData.imageUrl,
        status: productData.status
      }
      await createProduct(createData)
      setIsCreateMode(false)
      fetchProducts() // Refresh list
    }
  }

  const handleCancelCreate = () => {
    setIsCreateMode(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-2 text-blue-700">
          <span>📋</span>
          <span className="font-medium">Product Management - Original CRUD Components</span>
        </div>
        <p className="mt-2 text-sm text-blue-600">
          Sử dụng ProductList + ProductInlineEdit từ components/products
        </p>
        <div className="mt-2 text-xs text-blue-500 space-y-1">
          <p>• <strong>Thêm sản phẩm:</strong> Click nút "Thêm" → Form overlay lên danh sách</p>
          <p>• <strong>Chọn sản phẩm:</strong> Click vào sản phẩm → Inline edit overlay lên danh sách</p>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-700">Lỗi: {error}</p>
        </Card>
      )}

      {/* Main Content Area */}
      <div className="relative">
        {/* Product List - Original CRUD Component */}
        <ProductList
          products={products}
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
          onShowCreate={handleShowCreate}
          loading={loading}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          permissions={{
            products: {
              canCreate: true
            }
          }}
        />

        {/* Product Inline Edit - Overlay when creating */}
        {isCreateMode && (
          <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-10">
            <ProductInline
              mode="create"
              onSave={handleCreateProduct}
              onCancel={handleCancelCreate}
              isSubmitting={loading}
            />
          </div>
        )}

        {/* Inline Edit - Overlay when a product is selected */}
        {selectedProduct && !isCreateMode && (
          <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-10">
            <ProductInline
              product={selectedProduct}
              onSave={handleSaveInlineEdit}
              onDelete={handleDeleteProduct}
              onCancel={handleCancelInlineEdit}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductTabContent
