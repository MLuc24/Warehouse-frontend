import React, { useState, useEffect } from 'react';
import { Input, Textarea, Button } from '@/components/ui';
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

    // Warehouse name validation
    if (!formData.warehouseName.trim()) {
      newErrors.warehouseName = 'Tên kho hàng không được để trống';
    } else if (formData.warehouseName.length < 2) {
      newErrors.warehouseName = 'Tên kho hàng phải có ít nhất 2 ký tự';
    } else if (formData.warehouseName.length > 100) {
      newErrors.warehouseName = 'Tên kho hàng không được vượt quá 100 ký tự';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
    } else if (formData.address.length > 500) {
      newErrors.address = 'Địa chỉ không được vượt quá 500 ký tự';
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.contactPhone) {
      const phoneRegex = /^(\+84|84|0)[3|5|7|8|9]([0-9]{8})$/;
      if (!phoneRegex.test(formData.contactPhone.replace(/\s/g, ''))) {
        newErrors.contactPhone = 'Số điện thoại không đúng định dạng (VD: 0912345678)';
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
      {/* Form Header */}
      <div className="text-center pb-6 border-b border-gray-200">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          {warehouse ? 'Chỉnh sửa thông tin kho hàng' : 'Tạo kho hàng mới'}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {warehouse 
            ? 'Cập nhật thông tin kho hàng hiện tại của bạn' 
            : 'Nhập đầy đủ thông tin để tạo kho hàng mới trong hệ thống'
          }
        </p>
      </div>

      {/* Warehouse Name */}
      <Input
        label="Tên kho hàng"
        id="warehouseName"
        type="text"
        value={formData.warehouseName}
        onChange={handleInputChange('warehouseName')}
        disabled={isFormLoading}
        error={errors.warehouseName}
        placeholder="Nhập tên kho hàng"
        required
      />

      {/* Address */}
      <Textarea
        label="Địa chỉ"
        id="address"
        value={formData.address}
        onChange={handleInputChange('address')}
        disabled={isFormLoading}
        error={errors.address}
        placeholder="Nhập địa chỉ kho hàng"
        rows={3}
        required
      />

      {/* Contact Phone */}
      <Input
        label="Số điện thoại liên hệ"
        id="contactPhone"
        type="tel"
        value={formData.contactPhone}
        onChange={handleInputChange('contactPhone')}
        disabled={isFormLoading}
        error={errors.contactPhone}
        placeholder="Ví dụ: 0912345678"
        helperText="Số điện thoại để liên hệ với kho hàng (không bắt buộc)"
      />

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isFormLoading}
          variant="secondary"
          size="md"
          className="w-full sm:w-auto min-w-24"
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          disabled={isFormLoading}
          variant="primary"
          size="md"
          loading={isFormLoading}
          className="w-full sm:w-auto min-w-32"
        >
          {warehouse ? 'Cập nhật kho hàng' : 'Tạo kho hàng'}
        </Button>
      </div>
    </form>
  );
};

export default WarehouseForm;
