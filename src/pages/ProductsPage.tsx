import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Pagination } from '@/components/common';
import { Layout } from '@/components/layout';
import { ProductList, ProductInlineEdit, CreateProductForm } from '@/components/products';
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
    totalCount,
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
    setSelectedProduct(null); // Close inline edit when clearing search
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedProduct(null); // Close inline edit when changing page
  }, []);

  // Handle product selection for inline editing
  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setShowCreateForm(false); // Close create form when selecting product
  }, []);

  // Handle update product
  const handleUpdateProduct = useCallback(async (data: Partial<Product>) => {
    if (!selectedProduct) return;
    
    // Convert string values to proper types
    const processedData = {
      ...data,
      // Convert status from string to boolean if it exists
      status: data.status !== undefined 
        ? (String(data.status) === 'true')
        : undefined,
      // Convert numeric fields from string to number if they exist and are strings
      purchasePrice: data.purchasePrice !== undefined && String(data.purchasePrice) !== '' 
        ? Number(data.purchasePrice) 
        : data.purchasePrice,
      sellingPrice: data.sellingPrice !== undefined && String(data.sellingPrice) !== '' 
        ? Number(data.sellingPrice) 
        : data.sellingPrice,
      supplierId: data.supplierId !== undefined && String(data.supplierId) !== '' 
        ? Number(data.supplierId) 
        : data.supplierId,
      // Convert empty string to undefined for ImageUrl to avoid validation error
      imageUrl: data.imageUrl !== undefined && String(data.imageUrl).trim() !== '' 
        ? String(data.imageUrl).trim()
        : undefined,
      // Convert empty string to undefined for optional text fields
      description: data.description !== undefined && String(data.description).trim() !== '' 
        ? String(data.description).trim()
        : undefined,
      unit: data.unit !== undefined && String(data.unit).trim() !== '' 
        ? String(data.unit).trim()
        : undefined,
    };
    
    // Convert to UpdateProduct format and filter out undefined/empty values
    const updateData: UpdateProduct = {
      sku: processedData.sku || selectedProduct.sku,
      productName: processedData.productName || selectedProduct.productName,
      // Only include optional fields if they have values
      ...(processedData.description !== undefined && { description: processedData.description }),
      ...(processedData.supplierId !== undefined && { supplierId: processedData.supplierId }),
      ...(processedData.unit !== undefined && { unit: processedData.unit }),
      ...(processedData.purchasePrice !== undefined && { purchasePrice: processedData.purchasePrice }),
      ...(processedData.sellingPrice !== undefined && { sellingPrice: processedData.sellingPrice }),
      ...(processedData.imageUrl !== undefined && { imageUrl: processedData.imageUrl }),
      ...(processedData.status !== undefined && { status: processedData.status })
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
    } catch (error) {
      console.error('Error reactivating product:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }, [reactivateProduct, fetchProducts, searchConfig]);

  // Handle create product
  const handleCreateProduct = useCallback(async (data: Partial<Product>) => {
    // Convert to CreateProduct format
    const createData: CreateProduct = {
      sku: data.sku || '',
      productName: data.productName || '',
      description: data.description,
      supplierId: data.supplierId,
      unit: data.unit,
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      imageUrl: data.imageUrl,
      status: data.status
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
    setSelectedProduct(null); // Close inline edit when showing create form
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Main Content */}
          <div className="relative">
            {selectedProduct ? (
              <ProductInlineEdit
                product={selectedProduct}
                onSave={permissions.products.canEdit ? handleUpdateProduct : async () => {}}
                onDelete={permissions.products.canDelete ? handleDeleteProduct : async () => {}}
                onReactivate={permissions.products.canDelete ? handleReactivateProduct : undefined}
                onCancel={handleCancelEdit}
                canEdit={permissions.products.canEdit}
                canDelete={permissions.products.canDelete}
                isReadOnly={permissions.isReadOnly}
              />
            ) : showCreateForm && permissions.products.canCreate ? (
              <CreateProductForm
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
                permissions={permissions}
              />
            )}
          </div>

          {/* Pagination - Only show when not in edit mode and have data */}
          {!selectedProduct && !showCreateForm && products.length > 0 && totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
