import React, { useState } from 'react'
import { Card } from '@/components/ui'
import { useProduct } from '@/hooks/useProduct'
// Import reorganized CRUD components from local directories
import { ProductList } from './list'
import { ProductInline } from './inline'
import type { Product } from '@/types'

/**
 * Product Tab Content - Enhanced Logic & Features
 * 
 * IMPROVEMENTS từ version cũ:
 * 
 * 1. ENHANCED SEARCH & FILTERING:
 *    - Proper pagination với currentPage, totalPages, pageSize
 *    - Status filtering (all/active/inactive)
 *    - Sorting với sortBy và sortOrder
 *    - Search parameters được truyền đúng cách
 * 
 * 2. ADVANCED CRUD OPERATIONS:
 *    - Enhanced validation với trim() và null checks
 *    - Better error handling với try/catch
 *    - canDeleteProduct() và hasInventoryMovements() validation
 *    - reactivateProduct() functionality
 *    - Bulk delete operations
 * 
 * 3. IMPROVED STATE MANAGEMENT:
 *    - Separate loading states: creating, updating, deleting
 *    - Better pagination handling với handlePageChange
 *    - Status filter state management
 *    - Sort state management
 *    - Selected products for bulk operations
 * 
 * 4. CONSISTENT WITH OTHER TABS:
 *    - Same logic pattern as CategoryTable, StockTable, PricingManagement
 *    - Same parameter structure cho fetchProducts()
 *    - Same error handling approach
 *    - Same validation patterns
 * 
 * 5. BETTER USER EXPERIENCE:
 *    - Loading states cho từng operation
 *    - Confirmation dialogs cho delete operations
 *    - Better feedback messages
 *    - Auto refresh sau CRUD operations với đúng parameters
 */
export const ProductTabContent: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortBy, setSortBy] = useState<'productName' | 'sku' | 'createdAt' | 'updatedAt'>('productName')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [pageSize] = useState(20) // Fixed page size like other tabs
  
  const {
    products,
    totalCount,
    totalPages,
    loading,
    creating,
    updating,
    deleting,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    reactivateProduct,
    canDeleteProduct,
    hasInventoryMovements,
    clearError
  } = useProduct()

  // Handlers for original CRUD components
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
  }

  // Enhanced update with better validation
  const handleSaveInlineEdit = async (data: Partial<Product>) => {
    if (!selectedProduct || !data.sku?.trim() || !data.productName?.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc.')
      return
    }

    try {
      const updateData = {
        sku: data.sku.trim(),
        productName: data.productName.trim(),
        description: data.description?.trim(),
        supplierId: data.supplierId,
        unit: data.unit?.trim(),
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        imageUrl: data.imageUrl?.trim(),
        status: data.status
      }
      
      const updatedProduct = await updateProduct(selectedProduct.productId, updateData)
      if (updatedProduct) {
        setSelectedProduct(null)
        // No need to refresh - hook automatically updates the list
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  // Enhanced delete with validation - consistent with other tabs
  const handleDeleteProduct = async (id: number | string) => {
    const productId = Number(id)
    
    try {
      // Check if product can be deleted
      const canDelete = await canDeleteProduct(productId)
      if (!canDelete) {
        alert('Không thể xóa sản phẩm này vì có liên kết với các đơn hàng hoặc giao dịch khác.')
        return
      }

      // Check for inventory movements
      const hasMovements = await hasInventoryMovements(productId)
      if (hasMovements) {
        const confirmDelete = window.confirm(
          'Sản phẩm này có lịch sử xuất nhập kho. Bạn có chắc chắn muốn xóa? Thao tác này chỉ vô hiệu hóa sản phẩm, không xóa hoàn toàn.'
        )
        if (!confirmDelete) return
      }

      const success = await deleteProduct(productId)
      if (success) {
        setSelectedProduct(null)
        // Refresh current page with current filters
        const searchParams = {
          keyword: searchTerm || undefined,
          page: currentPage,
          pageSize,
          sortBy,
          sortOrder,
          status: statusFilter === 'all' ? undefined : statusFilter === 'active'
        }
        fetchProducts(searchParams)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  // Enhanced reactivate product - new feature consistent with other tabs
  const handleReactivateProduct = async (id: number) => {
    try {
      const success = await reactivateProduct(id)
      if (success) {
        // Refresh current page
        const searchParams = {
          keyword: searchTerm || undefined,
          page: currentPage,
          pageSize,
          sortBy,
          sortOrder,
          status: statusFilter === 'all' ? undefined : statusFilter === 'active'
        }
        fetchProducts(searchParams)
      }
    } catch (error) {
      console.error('Error reactivating product:', error)
    }
  }

  const handleCancelInlineEdit = () => {
    setSelectedProduct(null)
  }

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term)
  }

  // Enhanced search with proper parameters - consistent with other tabs
  const handleSearch = (term: string) => {
    const searchParams = {
      keyword: term,
      page: 1, // Reset to first page when searching
      pageSize,
      sortBy,
      sortOrder,
      status: statusFilter === 'all' ? undefined : statusFilter === 'active'
    }
    setCurrentPage(1)
    fetchProducts(searchParams)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    const searchParams = {
      page: currentPage,
      pageSize,
      sortBy,
      sortOrder,
      status: statusFilter === 'all' ? undefined : statusFilter === 'active'
    }
    fetchProducts(searchParams)
  }

  // Enhanced pagination handling - consistent with other tabs
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const searchParams = {
      keyword: searchTerm || undefined,
      page,
      pageSize,
      sortBy,
      sortOrder,
      status: statusFilter === 'all' ? undefined : statusFilter === 'active'
    }
    fetchProducts(searchParams)
  }

  const handleShowCreate = () => {
    setIsCreateMode(true)
    setSelectedProduct(null) // Clear any selected product
  }

  // Enhanced create with better error handling
  const handleCreateProduct = async (productData: Partial<Product>) => {
    if (!productData.sku?.trim() || !productData.productName?.trim()) {
      alert('Vui lòng nhập đầy đủ mã SKU và tên sản phẩm.')
      return
    }

    try {
      const createData = {
        sku: productData.sku.trim(),
        productName: productData.productName.trim(),
        description: productData.description?.trim(),
        supplierId: productData.supplierId,
        unit: productData.unit?.trim(),
        purchasePrice: productData.purchasePrice,
        sellingPrice: productData.sellingPrice,
        imageUrl: productData.imageUrl?.trim(),
        status: productData.status ?? true
      }
      
      const newProduct = await createProduct(createData)
      if (newProduct) {
        setIsCreateMode(false)
        // Refresh to show new product (go to first page if needed)
        setCurrentPage(1)
        const searchParams = {
          keyword: searchTerm || undefined,
          page: 1,
          pageSize,
          sortBy,
          sortOrder,
          status: statusFilter === 'all' ? undefined : statusFilter === 'active'
        }
        fetchProducts(searchParams)
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleCancelCreate = () => {
    setIsCreateMode(false)
  }

  // Bulk operations - consistent with other tabs
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để xóa.')
      return
    }

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`
    )
    if (!confirmDelete) return

    try {
      const deletePromises = selectedProducts.map(id => deleteProduct(id))
      await Promise.all(deletePromises)
      
      setSelectedProducts([])
      // Refresh current page
      const searchParams = {
        keyword: searchTerm || undefined,
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
        status: statusFilter === 'all' ? undefined : statusFilter === 'active'
      }
      fetchProducts(searchParams)
    } catch (error) {
      console.error('Error bulk deleting products:', error)
    }
  }

  // Enhanced error handling
  const handleClearError = () => {
    clearError()
  }

  // Filter handling - consistent with other tabs
  const handleStatusFilterChange = (newStatus: 'all' | 'active' | 'inactive') => {
    setStatusFilter(newStatus)
    setCurrentPage(1) // Reset to first page
    const searchParams = {
      keyword: searchTerm || undefined,
      page: 1,
      pageSize,
      sortBy,
      sortOrder,
      status: newStatus === 'all' ? undefined : newStatus === 'active'
    }
    fetchProducts(searchParams)
  }

  // Sort handling - consistent with other tabs
  const handleSortChange = (newSortBy: typeof sortBy, newSortOrder: typeof sortOrder) => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    const searchParams = {
      keyword: searchTerm || undefined,
      page: currentPage,
      pageSize,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      status: statusFilter === 'all' ? undefined : statusFilter === 'active'
    }
    fetchProducts(searchParams)
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-700">Lỗi: {error}</p>
        </Card>
      )}

      {/* Main Content Area */}
      <div className="relative">
        {/* Product List - Enhanced with pagination and error handling */}
        <ProductList
          products={products}
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
          onShowCreate={handleShowCreate}
          loading={loading || creating || updating || deleting}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          permissions={{
            products: {
              canCreate: true
            }
          }}
        />

        {/* Product Inline Edit - Enhanced with better loading states */}
        {isCreateMode && (
          <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-10">
            <ProductInline
              mode="create"
              onSave={handleCreateProduct}
              onCancel={handleCancelCreate}
              isSubmitting={creating}
            />
          </div>
        )}

        {/* Inline Edit - Enhanced with better loading states */}
        {selectedProduct && !isCreateMode && (
          <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-10">
            <ProductInline
              product={selectedProduct}
              onSave={handleSaveInlineEdit}
              onDelete={handleDeleteProduct}
              onCancel={handleCancelInlineEdit}
              isSubmitting={updating || deleting}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductTabContent
