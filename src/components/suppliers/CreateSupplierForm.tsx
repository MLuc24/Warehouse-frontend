import React, { useState } from 'react';
import { Button } from '@/components/ui';
import type { Supplier } from '@/types';

interface CreateSupplierFormProps {
  onSave: (data: Partial<Supplier>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

/**
 * Create Supplier Form Component
 * Provides form functionality for creating new suppliers
 */
export const CreateSupplierForm: React.FC<CreateSupplierFormProps> = ({
  onSave,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    email: '',
    phoneNumber: '',
    address: '',
    taxCode: ''
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

    if (formData.taxCode && !/^[0-9]{10,13}$/.test(formData.taxCode.replace(/\s/g, ''))) {
      newErrors.taxCode = 'Mã số thuế không hợp lệ (10-13 chữ số)';
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

          {/* Tax Code Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Mã số thuế
            </label>
            <input
              type="text"
              value={formData.taxCode}
              onChange={(e) => handleInputChange('taxCode', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 ${
                errors.taxCode 
                  ? 'border-red-300 bg-red-50 focus:border-red-400' 
                  : 'border-gray-300 bg-white focus:border-green-400 hover:border-gray-400'
              }`}
              placeholder="Nhập mã số thuế"
              disabled={isSubmitting}
            />
            {errors.taxCode && (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.taxCode}
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

export default CreateSupplierForm;
