import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { Save, X, Mail, Phone, MapPin, User } from 'lucide-react';
import type { Customer, CreateCustomer, UpdateCustomer } from '@/types';

interface CustomerInlineProps {
  customer?: Customer; // undefined for create mode
  onSave: (data: CreateCustomer | UpdateCustomer) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Inline Customer Form Component
 * Used for both creating new customers and editing existing ones
 * Provides a compact form interface for customer management
 */
export const CustomerInline: React.FC<CustomerInlineProps> = ({
  customer,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const isEditMode = !!customer;
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: customer?.customerName || '',
    customerType: customer?.customerType || 'Regular',
    email: customer?.email || '',
    phoneNumber: customer?.phoneNumber || '',
    address: customer?.address || '',
    status: customer?.status || 'Active'
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Tên khách hàng là bắt buộc';
    }

    // Email validation (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Phone validation (if provided)
    if (formData.phoneNumber && !/^[\d+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const submitData = isEditMode 
      ? { customerId: customer.customerId, ...formData } as UpdateCustomer
      : formData as CreateCustomer;

    onSave(submitData);
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Customer type options
  const customerTypeOptions = [
    { value: 'Regular', label: 'Khách hàng thường' },
    { value: 'VIP', label: 'Khách hàng VIP' },
    { value: 'Wholesale', label: 'Khách hàng bán sỉ' }
  ];

  // Status options
  const statusOptions = [
    { value: 'Active', label: 'Hoạt động' },
    { value: 'Inactive', label: 'Không hoạt động' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {isEditMode ? `Chỉnh sửa khách hàng: ${customer.customerName}` : 'Thêm khách hàng mới'}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="submit"
              form="customer-form"
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
          </div>
        </div>
      </div>

      <form id="customer-form" onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Customer Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Tên khách hàng *
            </label>
            <Input
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              placeholder="Nhập tên khách hàng"
              error={errors.customerName}
              disabled={isLoading}
            />
          </div>

          {/* Customer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại khách hàng
            </label>
            <Select
              value={formData.customerType}
              onChange={(value) => handleChange('customerType', value)}
              options={customerTypeOptions}
              disabled={isLoading}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <Select
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              options={statusOptions}
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@example.com"
              error={errors.email}
              disabled={isLoading}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Số điện thoại
            </label>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="0123456789"
              error={errors.phoneNumber}
              disabled={isLoading}
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Địa chỉ
            </label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Nhập địa chỉ khách hàng"
              disabled={isLoading}
            />
          </div>

        </div>

        {/* Form Actions - Hidden, controlled by header buttons */}
        <div className="hidden">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerInline;
