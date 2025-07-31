import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, LoadingSpinner } from '@/components/ui';
import { Layout } from '@/components/layout';
import { useSupplier } from '@/hooks/useSupplier';
import { ROUTES } from '@/constants';
import type { CreateSupplier } from '@/types';

type FormData = CreateSupplier;

interface FormErrors {
  supplierName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  taxCode?: string;
}

export const CreateSupplierPage: React.FC = () => {
  const navigate = useNavigate();
  const { createSupplier, creating, error, clearError } = useSupplier();
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    supplierName: '',
    address: '',
    phoneNumber: '',
    email: '',
    taxCode: '',
  });

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Tên nhà cung cấp là bắt buộc';
    } else if (formData.supplierName.length > 200) {
      newErrors.supplierName = 'Tên nhà cung cấp không được vượt quá 200 ký tự';
    }

    // Optional field validations
    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Địa chỉ không được vượt quá 500 ký tự';
    }

    if (formData.phoneNumber) {
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
      } else if (formData.phoneNumber.length > 20) {
        newErrors.phoneNumber = 'Số điện thoại không được vượt quá 20 ký tự';
      }
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      } else if (formData.email.length > 100) {
        newErrors.email = 'Email không được vượt quá 100 ký tự';
      }
    }

    if (formData.taxCode && formData.taxCode.length > 20) {
      newErrors.taxCode = 'Mã số thuế không được vượt quá 20 ký tự';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  }, [formErrors, error, clearError]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create clean data object (remove empty strings)
    const cleanData: CreateSupplier = {
      supplierName: formData.supplierName.trim(),
      address: formData.address?.trim() || undefined,
      phoneNumber: formData.phoneNumber?.trim() || undefined,
      email: formData.email?.trim() || undefined,
      taxCode: formData.taxCode?.trim() || undefined,
    };

    const result = await createSupplier(cleanData);
    if (result) {
      // Success - navigate back to suppliers list
      navigate(ROUTES.SUPPLIERS.LIST);
    }
  }, [formData, validateForm, createSupplier, navigate]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate(ROUTES.SUPPLIERS.LIST);
  }, [navigate]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thêm nhà cung cấp mới</h1>
            <p className="text-gray-600 mt-1">Nhập thông tin để tạo nhà cung cấp mới</p>
          </div>
        </div>

        {/* Global Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{error}</p>
              <Button onClick={clearError} variant="outline" size="sm" className="ml-auto">
                ✕
              </Button>
            </div>
          </Card>
        )}

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Supplier Name - Required */}
              <div className="md:col-span-2">
                <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên nhà cung cấp <span className="text-red-500">*</span>
                </label>
                <Input
                  id="supplierName"
                  type="text"
                  value={formData.supplierName}
                  onChange={handleInputChange('supplierName')}
                  error={formErrors.supplierName}
                  placeholder="Nhập tên nhà cung cấp"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  placeholder="Nhập địa chỉ nhà cung cấp"
                  className={`
                    block w-full px-3 py-2 border rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    sm:text-sm transition-colors
                    ${formErrors.address 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <Input
                  id="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                  error={formErrors.phoneNumber}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={formErrors.email}
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              {/* Tax Code */}
              <div className="md:col-span-2">
                <label htmlFor="taxCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Mã số thuế
                </label>
                <Input
                  id="taxCode"
                  type="text"
                  value={formData.taxCode}
                  onChange={handleInputChange('taxCode')}
                  error={formErrors.taxCode}
                  placeholder="Nhập mã số thuế"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={creating}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="relative min-w-[140px]"
              >
                {creating && (
                  <LoadingSpinner size="sm" className="mr-2" />
                )}
                {creating ? 'Đang tạo...' : 'Tạo nhà cung cấp'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateSupplierPage;
