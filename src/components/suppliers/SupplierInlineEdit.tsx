import React, { useState } from 'react';
import { Button } from '@/components/ui';
import type { Supplier } from '@/types';

interface SupplierInlineEditProps {
  supplier: Supplier;
  onSave: (data: Partial<Supplier>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onCancel: () => void;
}

/**
 * Supplier Inline Edit Component
 * Provides inline editing functionality for supplier details
 */
export const SupplierInlineEdit: React.FC<SupplierInlineEditProps> = ({
  supplier,
  onSave,
  onDelete,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    supplierName: supplier.supplierName,
    email: supplier.email || '',
    phoneNumber: supplier.phoneNumber || '',
    address: supplier.address || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving supplier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(supplier.supplierId);
    } catch (error) {
      console.error('Error deleting supplier:', error);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chỉnh sửa nhà cung cấp
        </h3>
        <p className="text-sm text-gray-600">
          Cập nhật thông tin nhà cung cấp hoặc xóa nhà cung cấp khỏi hệ thống
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

        {/* Supplier Info Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin bổ sung</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-700">ID:</span> {supplier.supplierId}
            </div>
            <div>
              <span className="font-medium text-gray-700">Ngày tạo:</span>{' '}
              {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Tổng sản phẩm:</span> {supplier.totalProducts}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="danger"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xóa...' : 'Xóa nhà cung cấp'}
          </Button>
        </div>
        
        <div className="flex space-x-3">
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
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận xóa
            </h4>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa nhà cung cấp <strong>{supplier.supplierName}</strong>? 
              Thao tác này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="secondary"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierInlineEdit;
