import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Pagination } from '@/components/common';
import { Layout } from '@/components/layout';
import { SupplierList, SupplierInlineEdit, CreateSupplierForm } from '@/components/suppliers';
import { useSupplier, usePermissions } from '@/hooks';
import type { Supplier, SupplierSearch, CreateSupplier, UpdateSupplier } from '@/types';

/**
 * Suppliers Page - Refactored with Inline Editing
 * Features: Click to edit inline, overlay-style editing over the table
 */
export const SuppliersPage: React.FC = () => {
  // Supplier management hook
  const {
    suppliers,
    loading,
    totalCount,
    totalPages,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    reactivateSupplier
  } = useSupplier();

  // Permissions hook
  const permissions = usePermissions();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pageSize = 10;

  // Search configuration with useMemo to prevent re-renders
  const searchConfig: SupplierSearch = useMemo(() => ({
    keyword: searchTerm,
    page: currentPage,
    pageSize
  }), [searchTerm, currentPage, pageSize]);

  // Fetch suppliers on component mount and when search params change
  useEffect(() => {
    fetchSuppliers(searchConfig);
  }, [searchConfig, fetchSuppliers]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedSupplier(null); // Close inline edit when searching
  }, []);

  // Handle search term change - now triggers immediate search
  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedSupplier(null); // Close inline edit when searching
  }, []);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
    setSelectedSupplier(null);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedSupplier(null); // Close inline edit when changing page
  }, []);

  // Handle supplier selection for inline editing
  const handleSelectSupplier = useCallback((supplier: Supplier) => {
    if (selectedSupplier?.supplierId === supplier.supplierId) {
      setSelectedSupplier(null); // Deselect if already selected
    } else {
      setSelectedSupplier(supplier);
      setShowCreateForm(false); // Close create form if open
    }
  }, [selectedSupplier]);

  // Handle supplier update
  const handleUpdateSupplier = useCallback(async (data: Partial<Supplier>) => {
    if (!selectedSupplier) return;
    
    // Convert to UpdateSupplier format
    const updateData: UpdateSupplier = {
      supplierName: data.supplierName || selectedSupplier.supplierName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      taxCode: data.taxCode
    };
    
    setIsSubmitting(true);
    try {
      await updateSupplier(selectedSupplier.supplierId, updateData);
      setSelectedSupplier(null); // Close inline edit after successful update
      await fetchSuppliers(searchConfig); // Refresh data
    } catch (error) {
      console.error('Error updating supplier:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedSupplier, updateSupplier, fetchSuppliers, searchConfig]);

  // Handle supplier deletion
  const handleDeleteSupplier = useCallback(async (id: number) => {
    setIsSubmitting(true);
    try {
      await deleteSupplier(id);
      setSelectedSupplier(null); // Close inline edit after successful deletion
      await fetchSuppliers(searchConfig); // Refresh data
    } catch (error) {
      console.error('Error deleting supplier:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }, [deleteSupplier, fetchSuppliers, searchConfig]);

  // Handle supplier reactivation
  const handleReactivateSupplier = useCallback(async (id: number) => {
    setIsSubmitting(true);
    try {
      await reactivateSupplier(id);
      setSelectedSupplier(null); // Close inline edit after successful reactivation
      await fetchSuppliers(searchConfig); // Refresh data
    } catch (error) {
      console.error('Error reactivating supplier:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }, [reactivateSupplier, fetchSuppliers, searchConfig]);

  // Handle create supplier
  const handleCreateSupplier = useCallback(async (data: Partial<Supplier>) => {
    // Convert to CreateSupplier format
    const createData: CreateSupplier = {
      supplierName: data.supplierName || '',
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      taxCode: data.taxCode
    };
    
    setIsSubmitting(true);
    try {
      await createSupplier(createData);
      setShowCreateForm(false); // Close create form after successful creation
      await fetchSuppliers(searchConfig); // Refresh data
    } catch (error) {
      console.error('Error creating supplier:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }, [createSupplier, fetchSuppliers, searchConfig]);

  // Handle cancel inline edit
  const handleCancelEdit = useCallback(() => {
    setSelectedSupplier(null);
  }, []);

  // Handle cancel create
  const handleCancelCreate = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  // Show create form
  const handleShowCreate = useCallback(() => {
    setShowCreateForm(true);
    setSelectedSupplier(null); // Close inline edit if open
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header with enhanced styling */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Quản lý nhà cung cấp
            </h1>
            <p className="text-sm text-gray-600">
              Quản lý thông tin nhà cung cấp và theo dõi hoạt động kinh doanh
            </p>
          </div>
        </div>

        {/* Main Content Area with enhanced styling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          <div className="p-6">
            {/* Show either the supplier list or the inline edit form */}
            {selectedSupplier ? (
              <SupplierInlineEdit
                supplier={selectedSupplier}
                onSave={permissions.suppliers.canEdit ? handleUpdateSupplier : async () => {}}
                onDelete={permissions.suppliers.canDelete ? handleDeleteSupplier : async () => {}}
                onReactivate={permissions.suppliers.canDelete ? handleReactivateSupplier : undefined}
                onCancel={handleCancelEdit}
                permissions={permissions}
              />
            ) : showCreateForm && permissions.suppliers.canCreate ? (
              <CreateSupplierForm
                onSave={handleCreateSupplier}
                onCancel={handleCancelCreate}
                isSubmitting={isSubmitting}
              />
            ) : (
              <SupplierList
                suppliers={suppliers}
                selectedSupplier={selectedSupplier}
                onSelectSupplier={handleSelectSupplier}
                onShowCreate={handleShowCreate}
                loading={loading}
                searchTerm={searchTerm}
                onSearchTermChange={handleSearchTermChange}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
                permissions={permissions}
              />
            )}

            {/* Pagination inside the same card */}
            {totalPages > 1 && !selectedSupplier && !showCreateForm && (
              <div className="mt-6 pt-6 border-t border-gray-200">
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
      </div>
    </Layout>
  );
};

export default SuppliersPage;
