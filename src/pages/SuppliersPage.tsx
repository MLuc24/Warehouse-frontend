import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui';
import { Pagination } from '@/components/common';
import { Layout } from '@/components/layout';
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
                searchTerm={searchTerm}
                onSearchTermChange={handleSearchTermChange}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
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
      {/* Header với styling đẹp hơn */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thêm nhà cung cấp mới
            </h3>
            <p className="text-gray-600">
              Điền thông tin để thêm nhà cung cấp mới vào hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Form Content với styling cải tiến */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Tên nhà cung cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.supplierName}
              onChange={(e) => handleInputChange('supplierName', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 ${
                errors.supplierName 
                  ? 'border-red-300 bg-red-50 focus:border-red-400' 
                  : 'border-gray-300 bg-white focus:border-green-400 hover:border-gray-400'
              }`}
              placeholder="Nhập tên nhà cung cấp"
              disabled={isSubmitting}
            />
            {errors.supplierName && (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.supplierName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 ${
                errors.email 
                  ? 'border-red-300 bg-red-50 focus:border-red-400' 
                  : 'border-gray-300 bg-white focus:border-green-400 hover:border-gray-400'
              }`}
              placeholder="Nhập email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 ${
                errors.phoneNumber 
                  ? 'border-red-300 bg-red-50 focus:border-red-400' 
                  : 'border-gray-300 bg-white focus:border-green-400 hover:border-gray-400'
              }`}
              placeholder="Nhập số điện thoại"
              disabled={isSubmitting}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 ${
                errors.address 
                  ? 'border-red-300 bg-red-50 focus:border-red-400' 
                  : 'border-gray-300 bg-white focus:border-green-400 hover:border-gray-400'
              }`}
              placeholder="Nhập địa chỉ"
              disabled={isSubmitting}
            />
            {errors.address && (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.address}
              </p>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Mẹo nhập liệu
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Tên nhà cung cấp nên rõ ràng và dễ nhận biết</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Email sẽ được sử dụng cho liên lạc và thông báo</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Số điện thoại phải có 10-11 chữ số</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Địa chỉ chi tiết giúp giao hàng chính xác</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons với styling đẹp hơn */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8 border-t-2 border-gray-200">
        <Button
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách
        </Button>
        <Button
          onClick={handleSave}
          variant="primary"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {isSubmitting ? 'Đang tạo...' : 'Thêm nhà cung cấp'}
        </Button>
      </div>
    </div>
  );
};

export default SuppliersPage;
