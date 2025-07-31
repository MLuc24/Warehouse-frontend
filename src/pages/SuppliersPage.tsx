import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui';
import { Pagination } from '@/components/common';
import { Layout } from '@/components/layout';
import { SupplierSearchBar } from '@/components/suppliers';
import { SupplierList } from '@/components/suppliers/SupplierList';
import { SupplierInlineEdit } from '@/components/suppliers/SupplierInlineEdit';
import { useSupplier } from '@/hooks/useSupplier';
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
    deleteSupplier
  } = useSupplier();

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

        {/* Search Bar with enhanced styling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <SupplierSearchBar
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            loading={loading}
            disabled={isSubmitting}
          />
        </div>

        {/* Main Content Area with enhanced styling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          <div className="p-6">
            {/* Show either the supplier list or the inline edit form */}
            {selectedSupplier ? (
              <SupplierInlineEdit
                supplier={selectedSupplier}
                onSave={handleUpdateSupplier}
                onDelete={handleDeleteSupplier}
                onCancel={handleCancelEdit}
              />
            ) : showCreateForm ? (
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

// Create Supplier Form Component
interface CreateSupplierFormProps {
  onSave: (data: Partial<Supplier>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const CreateSupplierForm: React.FC<CreateSupplierFormProps> = ({
  onSave,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation rules
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Tên nhà cung cấp là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;
    await onSave(formData);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Thêm nhà cung cấp mới
        </h3>
        <p className="text-sm text-gray-600">
          Điền thông tin để thêm nhà cung cấp mới vào hệ thống
        </p>
      </div>

      {/* Form Content */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên nhà cung cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.supplierName}
              onChange={(e) => handleInputChange('supplierName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.supplierName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tên nhà cung cấp"
              disabled={isSubmitting}
            />
            {errors.supplierName && (
              <p className="mt-1 text-sm text-red-600">{errors.supplierName}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số điện thoại"
              disabled={isSubmitting}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập địa chỉ"
              disabled={isSubmitting}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
        >
          ← Quay lại danh sách
        </Button>
        <Button
          onClick={handleSave}
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang tạo...' : 'Thêm nhà cung cấp'}
        </Button>
      </div>
    </div>
  );
};

export default SuppliersPage;
