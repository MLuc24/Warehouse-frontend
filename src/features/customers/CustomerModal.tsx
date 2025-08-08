import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { GenericModal } from '@/components/common';
import { Save, X, Mail, Phone, MapPin, User, Star, Building2, AlertCircle } from 'lucide-react';
import type { Customer, CreateCustomer, UpdateCustomer } from '@/types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer; // undefined for create mode
  onSave: (data: CreateCustomer | UpdateCustomer) => void;
  isLoading?: boolean;
}

/**
 * Customer Modal Component
 * Used for both creating new customers and editing existing ones
 * Uses GenericModal for consistent modal behavior
 */
export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
  onSave,
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

  // Update form data when customer prop changes
  React.useEffect(() => {
    if (customer) {
      setFormData({
        customerName: customer.customerName || '',
        customerType: customer.customerType || 'Regular',
        email: customer.email || '',
        phoneNumber: customer.phoneNumber || '',
        address: customer.address || '',
        status: customer.status || 'Active'
      });
    } else {
      // Reset form for create mode
      setFormData({
        customerName: '',
        customerType: 'Regular',
        email: '',
        phoneNumber: '',
        address: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [customer]);

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

    // Phone number validation (if provided)
    if (formData.phoneNumber && !/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare data based on mode
    if (isEditMode && customer) {
      const updateData: UpdateCustomer = {
        customerName: formData.customerName,
        customerType: formData.customerType,
        email: formData.email || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        address: formData.address || undefined,
        status: formData.status
      };
      onSave(updateData);
    } else {
      const createData: CreateCustomer = {
        customerName: formData.customerName,
        customerType: formData.customerType,
        email: formData.email || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        address: formData.address || undefined
      };
      onSave(createData);
    }
  };

  // Customer type options with enhanced display
  const customerTypeOptions = [
    { value: 'Regular', label: 'Khách hàng thường' },
    { value: 'VIP', label: 'Khách hàng VIP' },
    { value: 'Wholesale', label: 'Khách hàng doanh nghiệp' }
  ];

  // Status options (only for edit mode)
  const statusOptions = [
    { value: 'Active', label: 'Đang hoạt động' },
    { value: 'Inactive', label: 'Tạm ngưng hoạt động' }
  ];

  // Helper function to get customer type icon and color
  const getCustomerTypeDisplay = (type: string) => {
    switch (type) {
      case 'VIP':
        return { icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
      case 'Wholesale':
        return { icon: Building2, color: 'text-purple-600', bgColor: 'bg-purple-50' };
      default:
        return { icon: User, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    }
  };

  const modalTitle = isEditMode ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm khách hàng mới';
  const typeDisplay = getCustomerTypeDisplay(formData.customerType);
  const ModalIcon = typeDisplay.icon;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="3xl"
      maxHeight={true}
      icon={<ModalIcon className="w-5 h-5" />}
      variant="default"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên khách hàng 
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                placeholder="Nhập tên đầy đủ của khách hàng"
                error={errors.customerName}
                disabled={isLoading}
                className="text-base"
              />
              {errors.customerName && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.customerName}
                </div>
              )}
            </div>

            {/* Customer Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại khách hàng
              </label>
              <Select
                value={formData.customerType}
                onChange={(value: string) => handleChange('customerType', value)}
                options={customerTypeOptions}
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Chọn loại phù hợp để áp dụng chính sách giá
              </p>
            </div>

            {/* Status (only for edit mode) */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái hoạt động
                </label>
                <Select
                  value={formData.status}
                  onChange={(value: string) => handleChange('status', value)}
                  options={statusOptions}
                  disabled={isLoading}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Khách hàng tạm ngưng sẽ không thể đặt hàng
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Phone className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Thông tin liên hệ</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Địa chỉ email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="customer@example.com"
                error={errors.email}
                disabled={isLoading}
                className="text-base"
              />
              {errors.email && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Email sẽ được sử dụng để gửi thông báo đơn hàng
              </p>
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
                placeholder="0123 456 789"
                error={errors.phoneNumber}
                disabled={isLoading}
                className="text-base"
              />
              {errors.phoneNumber && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phoneNumber}
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Số điện thoại để liên hệ xác nhận đơn hàng
              </p>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Địa chỉ giao hàng
              </label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                disabled={isLoading}
                className="text-base"
              />
              <p className="mt-1 text-sm text-gray-500">
                Địa chỉ chính để giao hàng cho khách hàng
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section for Edit Mode */}
        {isEditMode && customer && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-full ${typeDisplay.bgColor} mr-3`}>
                <ModalIcon className={`w-5 h-5 ${typeDisplay.color}`} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Xem trước thông tin</h4>
                <p className="text-sm text-gray-600">Kiểm tra lại thông tin trước khi lưu</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Tên:</span>
                <span className="ml-2 text-gray-900">{formData.customerName || 'Chưa nhập'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Loại:</span>
                <span className="ml-2 text-gray-900">
                  {customerTypeOptions.find(opt => opt.value === formData.customerType)?.label}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{formData.email || 'Chưa nhập'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Điện thoại:</span>
                <span className="ml-2 text-gray-900">{formData.phoneNumber || 'Chưa nhập'}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Địa chỉ:</span>
                <span className="ml-2 text-gray-900">{formData.address || 'Chưa nhập'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Trường bắt buộc
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-6"
            >
              <X className="w-4 h-4 mr-2" />
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              className="px-6"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Cập nhật thông tin' : 'Thêm khách hàng'}
            </Button>
          </div>
        </div>
      </form>
    </GenericModal>
  );
};

export default CustomerModal;
