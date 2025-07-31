import React, { useState } from 'react';
import { Button } from '@/components/ui';
import type { Supplier } from '@/types';

interface SupplierInlineEditProps {
  supplier: Supplier;
  onSave: (data: Partial<Supplier>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onCancel: () => void;
  permissions?: {
    suppliers: {
      canEdit: boolean;
      canDelete: boolean;
    };
    isReadOnly: boolean;
  };
}

/**
 * Supplier Inline Edit Component
 * Provides inline editing functionality for supplier details
 */
export const SupplierInlineEdit: React.FC<SupplierInlineEditProps> = ({
  supplier,
  onSave,
  onDelete,
  onCancel,
  permissions
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
      {/* Header với styling đẹp hơn */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {permissions?.isReadOnly ? 'Xem thông tin nhà cung cấp' : 'Chỉnh sửa nhà cung cấp'}
            </h3>
            <p className="text-gray-600">
              {permissions?.isReadOnly 
                ? 'Xem chi tiết thông tin nhà cung cấp' 
                : 'Cập nhật thông tin nhà cung cấp hoặc xóa nhà cung cấp khỏi hệ thống'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form Content với styling cải tiến */}
      <div className="mb-8">
        {permissions?.isReadOnly && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-yellow-800 font-medium">
                Bạn chỉ có quyền xem thông tin. Không thể chỉnh sửa hoặc xóa nhà cung cấp.
              </p>
            </div>
          </div>
        )}
        
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
              className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                errors.supplierName 
                  ? 'border-red-300 bg-red-50 focus:border-red-400' 
                  : permissions?.isReadOnly
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 bg-white focus:border-blue-400 hover:border-gray-400'
              }`}
              placeholder="Nhập tên nhà cung cấp"
              disabled={isSubmitting || permissions?.isReadOnly}
              readOnly={permissions?.isReadOnly}
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
              className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                errors.email 
                  ? 'border-red-300 bg-red-50 focus:border-red-400' 
                  : permissions?.isReadOnly
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 bg-white focus:border-blue-400 hover:border-gray-400'
              }`}
              placeholder="Nhập email"
              disabled={isSubmitting || permissions?.isReadOnly}
              readOnly={permissions?.isReadOnly}
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
              className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                errors.phoneNumber 
                  ? 'border-red-300 bg-red-50 focus:border-red-400' 
                  : permissions?.isReadOnly
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 bg-white focus:border-blue-400 hover:border-gray-400'
              }`}
              placeholder="Nhập số điện thoại"
              disabled={isSubmitting || permissions?.isReadOnly}
              readOnly={permissions?.isReadOnly}
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
              className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                errors.address 
                  ? 'border-red-300 bg-red-50 focus:border-red-400' 
                  : permissions?.isReadOnly
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 bg-white focus:border-blue-400 hover:border-gray-400'
              }`}
              placeholder="Nhập địa chỉ"
              disabled={isSubmitting || permissions?.isReadOnly}
              readOnly={permissions?.isReadOnly}
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

        {/* Supplier Info Section với styling đẹp hơn */}
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thông tin bổ sung
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">ID nhà cung cấp</div>
              <div className="text-lg font-bold text-gray-900">#{supplier.supplierId}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Ngày tạo</div>
              <div className="text-lg font-bold text-gray-900">
                {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Trạng thái</div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  supplier.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-lg font-bold ${
                  supplier.status === 'Active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {supplier.status === 'Active' ? 'Hoạt động' : 'Hết hạn'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Lần cập nhật cuối: {new Date().toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons với styling đẹp hơn */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t-2 border-gray-200">
        <div>
          {permissions?.suppliers.canDelete && supplier.status === 'Active' && (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-all duration-200 hover:shadow-md flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isSubmitting ? 'Đang chuyển...' : 'Chuyển sang hết hạn'}
            </Button>
          )}
          {supplier.status === 'Expired' && (
            <div className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nhà cung cấp đã hết hạn
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={onCancel}
            variant="secondary"
            disabled={isSubmitting}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách
          </Button>
          {permissions?.suppliers.canEdit && (
            <Button
              onClick={handleSave}
              variant="primary"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition-all duration-200 hover:shadow-md flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal với styling đẹp hơn */}
      {showDeleteConfirm && permissions?.suppliers.canDelete && supplier.status === 'Active' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  Chuyển sang hết hạn
                </h4>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Bạn có chắc chắn muốn chuyển nhà cung cấp <strong className="text-gray-900">{supplier.supplierName}</strong> 
                sang trạng thái <strong className="text-red-600">"Hết hạn"</strong>? 
                Nhà cung cấp này sẽ không hiển thị trong danh sách chọn khi thêm sản phẩm.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="secondary"
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  disabled={isSubmitting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
                >
                  {isSubmitting ? 'Đang chuyển...' : 'Chuyển sang hết hạn'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierInlineEdit;
