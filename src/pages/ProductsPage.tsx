import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout';
import { ProductMasterPage, ProductList, ProductInline } from '@/features/products';
import { useProduct, usePermissions } from '@/hooks';
import type { Product, ProductSearch, CreateProduct, UpdateProduct } from '@/types';

/**
 * Products Page - Refactored with Inline Editing
 * Features: Click to edit inline, overlay-style editing over the table
 */
export const ProductsPage: React.FC = () => {
  // Product management hook
  const {
    products,
    loading,
    totalPages,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    reactivateProduct
  } = useProduct();

  // Permissions hook
  const permissions = usePermissions();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pageSize = 10;

  // Search configuration with useMemo to prevent re-renders
  const searchConfig: ProductSearch = useMemo(() => ({
    keyword: searchTerm,
    page: currentPage,
    pageSize
  }), [searchTerm, currentPage, pageSize]);

  // Fetch products on component mount and when search params change
  useEffect(() => {
    fetchProducts(searchConfig);
  }, [searchConfig, fetchProducts]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedProduct(null); // Close inline edit when searching
  }, []);

  // Handle search term change - now triggers immediate search
  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedProduct(null); // Close inline edit when searching
  }, []);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
    setSelectedProduct(null);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedProduct(null); // Close inline edit when changing page
  }, []);

  // Handle product selection for inline editing
  const handleSelectProduct = useCallback((product: Product) => {
    if (selectedProduct?.productId === product.productId) {
      setSelectedProduct(null); // Deselect if already selected
    } else {
      setSelectedProduct(product);
      setShowCreateForm(false); // Close create form if open
    }
  }, [selectedProduct]);

  // Handle product update
  const handleUpdateProduct = useCallback(async (data: Partial<Product>) => {
    if (!selectedProduct) return;
    
    // Convert to UpdateProduct format
    const updateData: UpdateProduct = {
      productName: data.productName || selectedProduct.productName,
      sku: data.sku || selectedProduct.sku,
      supplierId: data.supplierId,
      categoryId: data.categoryId, // 🔥 FIXED: Add missing categoryId
      unit: data.unit || selectedProduct.unit,
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      minStockLevel: data.minStockLevel, // 🔥 FIXED: Add missing minStockLevel
      maxStockLevel: data.maxStockLevel, // 🔥 FIXED: Add missing maxStockLevel
      expiryDate: data.expiryDate, // 🔥 FIXED: Add missing expiryDate
      storageType: data.storageType, // 🔥 FIXED: Add missing storageType
      isPerishable: data.isPerishable, // 🔥 FIXED: Add missing isPerishable
      description: data.description,
      imageUrl: data.imageUrl,
      status: data.status
    };
    
    setIsSubmitting(true);
    try {
      await updateProduct(selectedProduct.productId, updateData);
      setSelectedProduct(null); // Close inline edit after successful update
      await fetchProducts(searchConfig); // Refresh data
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedProduct, updateProduct, fetchProducts, searchConfig]);

  // Handle product deletion
  const handleDeleteProduct = useCallback(async (id: number | string) => {
    setIsSubmitting(true);
    try {
      const productId = typeof id === 'string' ? parseInt(id) : id;
      await deleteProduct(productId);
      setSelectedProduct(null); // Close inline edit after successful deletion
      await fetchProducts(searchConfig); // Refresh data
    } finally {
      setIsSubmitting(false);
    }
  }, [deleteProduct, fetchProducts, searchConfig]);

  // Handle product reactivation
  const handleReactivateProduct = useCallback(async (id: number | string) => {
    setIsSubmitting(true);
    try {
      const productId = typeof id === 'string' ? parseInt(id) : id;
      await reactivateProduct(productId);
      setSelectedProduct(null); // Close inline edit after successful reactivation
      await fetchProducts(searchConfig); // Refresh data
    } finally {
      setIsSubmitting(false);
    }
  }, [reactivateProduct, fetchProducts, searchConfig]);

  // Handle create product
  const handleCreateProduct = useCallback(async (data: Partial<Product>) => {
    // Convert to CreateProduct format
    const createData: CreateProduct = {
      productName: data.productName || '',
      sku: data.sku || '',
      supplierId: data.supplierId,
      categoryId: data.categoryId, // 🔥 FIXED: Add missing categoryId
      unit: data.unit || '',
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      minStockLevel: data.minStockLevel, // 🔥 FIXED: Add missing minStockLevel
      maxStockLevel: data.maxStockLevel, // 🔥 FIXED: Add missing maxStockLevel
      expiryDate: data.expiryDate, // 🔥 FIXED: Add missing expiryDate
      storageType: data.storageType, // 🔥 FIXED: Add missing storageType
      isPerishable: data.isPerishable, // 🔥 FIXED: Add missing isPerishable
      description: data.description,
      imageUrl: data.imageUrl
    };
    
    setIsSubmitting(true);
    try {
      await createProduct(createData);
      setShowCreateForm(false); // Close create form after successful creation
      await fetchProducts(searchConfig); // Refresh data
    } finally {
      setIsSubmitting(false);
    }
  }, [createProduct, fetchProducts, searchConfig]);

  // Handle cancel inline edit
  const handleCancelEdit = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // Handle cancel create
  const handleCancelCreate = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  // Show create form
  const handleShowCreate = useCallback(() => {
    setShowCreateForm(true);
    setSelectedProduct(null); // Close inline edit if open
  }, []);

  return (
    <Layout showProductTabs={true}>
      <ProductMasterPage>
        <div className="space-y-8">
          {/* Page Header with enhanced styling */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Quản lý sản phẩm
              </h1>
              <p className="text-sm text-gray-600">
                Quản lý thông tin sản phẩm và theo dõi tồn kho
              </p>
            </div>
          </div>

          {/* Main Content Area with enhanced styling */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
            <div className="p-6">
              {/* Show either the product list or the inline edit form */}
              {selectedProduct ? (
                <ProductInline
                  product={selectedProduct}
                  onSave={permissions.products.canEdit ? handleUpdateProduct : async () => {}}
                  onDelete={permissions.products.canDelete ? handleDeleteProduct : async () => {}}
                  onReactivate={permissions.products.canDelete ? handleReactivateProduct : undefined}
                  onCancel={handleCancelEdit}
                />
              ) : showCreateForm && permissions.products.canCreate ? (
                <ProductInline
                  mode="create"
                  onSave={handleCreateProduct}
                  onCancel={handleCancelCreate}
                  isSubmitting={isSubmitting}
                />
              ) : (
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
                  totalPages={totalPages}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  permissions={permissions}
                />
              )}

              {/* Remove duplicate pagination - it's already handled in ProductList */}
            </div>
          </div>
        </div>
      </ProductMasterPage>
    </Layout>
  );
};

export default ProductsPage;
