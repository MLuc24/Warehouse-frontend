import React, { useState, useEffect } from 'react';
import type { WarehouseFormData, Warehouse } from '@/types';

interface WarehouseFormProps {
  warehouse?: Warehouse | null;
  onSubmit: (data: WarehouseFormData) => Promise<{ success: boolean; message: string }>;
  onCancel: () => void;
  loading?: boolean;
}

export const WarehouseForm: React.FC<WarehouseFormProps> = ({
  warehouse,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<WarehouseFormData>({
    warehouseName: '',
    address: '',
    contactPhone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load warehouse data for editing
  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouseId: warehouse.warehouseId,
        warehouseName: warehouse.warehouseName,
        address: warehouse.address,
        contactPhone: warehouse.contactPhone || ''
      });
    }
  }, [warehouse]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.warehouseName.trim()) {
      newErrors.warehouseName = 'Tên kho hàng không được để trống';
    } else if (formData.warehouseName.length > 100) {
      newErrors.warehouseName = 'Tên kho hàng không được vượt quá 100 ký tự';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    } else if (formData.address.length > 500) {
      newErrors.address = 'Địa chỉ không được vượt quá 500 ký tự';
    }

    if (formData.contactPhone) {
      const phoneRegex = /^(\+84|84|0)[3|5|7|8|9]([0-9]{8})$/;
      if (!phoneRegex.test(formData.contactPhone)) {
        newErrors.contactPhone = 'Số điện thoại không đúng định dạng';
      } else if (formData.contactPhone.length > 20) {
        newErrors.contactPhone = 'Số điện thoại không được vượt quá 20 ký tự';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        // Success will be handled by parent component
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof WarehouseFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const isFormLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Warehouse Name */}
      <div>
        <label htmlFor="warehouseName" className="block text-sm font-medium text-gray-700 mb-2">
          Tên kho hàng *
        </label>
        <input
          type="text"
          id="warehouseName"
          value={formData.warehouseName}
          onChange={handleInputChange('warehouseName')}
          disabled={isFormLoading}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.warehouseName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Nhập tên kho hàng"
        />
        {errors.warehouseName && (
          <p className="mt-1 text-sm text-red-600">{errors.warehouseName}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Địa chỉ *
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={handleInputChange('address')}
          disabled={isFormLoading}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Nhập địa chỉ kho hàng"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* Contact Phone */}
      <div>
        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
          Số điện thoại liên hệ
        </label>
        <input
          type="tel"
          id="contactPhone"
          value={formData.contactPhone}
          onChange={handleInputChange('contactPhone')}
          disabled={isFormLoading}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.contactPhone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ví dụ: 0912345678"
        />
        {errors.contactPhone && (
          <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isFormLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isFormLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isFormLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {warehouse ? 'Đang cập nhật...' : 'Đang tạo...'}
            </span>
          ) : (
            warehouse ? 'Cập nhật' : 'Tạo mới'
          )}
        </button>
      </div>
    </form>
  );
};

export default WarehouseForm;
