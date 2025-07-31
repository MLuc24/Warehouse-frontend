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
    
    // Convert to UpdateProduct format
    const updateData: UpdateProduct = {
      sku: data.sku || selectedProduct.sku,
      productName: data.productName || selectedProduct.productName,
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
      await updateProduct(selectedProduct.productId, updateData);
      setSelectedProduct(null); // Close inline edit after successful update
      await fetchProducts(searchConfig); // Refresh data
    } catch (error) {
      console.error('Error updating product:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedProduct, updateProduct, fetchProducts, searchConfig]);

  // Handle product deletion
  const handleDeleteProduct = useCallback(async (id: number) => {
    setIsSubmitting(true);
    try {
      await deleteProduct(id);
      setSelectedProduct(null); // Close inline edit after successful deletion
      await fetchProducts(searchConfig); // Refresh data
    } catch (error) {
      console.error('Error deleting product:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }, [deleteProduct, fetchProducts, searchConfig]);

  // Handle product reactivation
  const handleReactivateProduct = useCallback(async (id: number) => {
    setIsSubmitting(true);
    try {
      await reactivateProduct(id);
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
    } catch (error) {
      console.error('Error creating product:', error);
      // You might want to show an error message to the user here
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
                permissions={permissions}
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
