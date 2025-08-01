import React from 'react';
import { GenericForm } from '@/components/common';
import type { FormField } from '@/components/common';
import type { Supplier } from '@/types';

interface CreateSupplierFormProps {
  onSave: (data: Partial<Supplier>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

/**
 * Enhanced Create Supplier Form Component using GenericForm
 * Provides form functionality for creating new suppliers
 */
export const CreateSupplierForm: React.FC<CreateSupplierFormProps> = ({
  onSave,
  onCancel,
  isSubmitting
}) => {
  // Define form fields
  const formFields: FormField[] = [
    {
      name: 'supplierName',
      label: 'Tên nhà cung cấp',
      type: 'text',
      placeholder: 'Nhập tên nhà cung cấp',
      required: true,
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue.length < 2) {
          return 'Tên nhà cung cấp phải có ít nhất 2 ký tự';
        }
        if (strValue.length > 200) {
          return 'Tên nhà cung cấp không được vượt quá 200 ký tự';
        }
        return null;
      }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Nhập email',
      required: true,
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue)) {
          return 'Email không hợp lệ';
        }
        return null;
      }
    },
    {
      name: 'phoneNumber',
      label: 'Số điện thoại',
      type: 'tel',
      placeholder: 'Nhập số điện thoại',
      required: true,
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue && !/^[0-9]{10,11}$/.test(strValue.replace(/\s/g, ''))) {
          return 'Số điện thoại không hợp lệ';
        }
        return null;
      }
    },
    {
      name: 'address',
      label: 'Địa chỉ',
      type: 'textarea',
      placeholder: 'Nhập địa chỉ',
      required: true,
      rows: 3,
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue.length < 10) {
          return 'Địa chỉ phải có ít nhất 10 ký tự';
        }
        if (strValue.length > 500) {
          return 'Địa chỉ không được vượt quá 500 ký tự';
        }
        return null;
      }
    },
    {
      name: 'taxCode',
      label: 'Mã số thuế',
      type: 'text',
      placeholder: 'Nhập mã số thuế (tùy chọn)',
      description: '10-13 chữ số',
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue && !/^[0-9]{10,13}$/.test(strValue.replace(/\s/g, ''))) {
          return 'Mã số thuế không hợp lệ (10-13 chữ số)';
        }
        return null;
      }
    }
  ];

  // Handle save with data transformation
  const handleSave = async (formData: Record<string, unknown>) => {
    // Transform data to match Supplier type
    const supplierData: Partial<Supplier> = {
      supplierName: String(formData.supplierName || ''),
      email: String(formData.email || ''),
      phoneNumber: String(formData.phoneNumber || ''),
      address: String(formData.address || ''),
      taxCode: formData.taxCode ? String(formData.taxCode) : undefined
    };

    await onSave(supplierData);
  };

  return (
    <GenericForm
      title="Thêm nhà cung cấp mới"
      description="Điền thông tin để thêm nhà cung cấp mới vào hệ thống"
      titleIcon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }
      fields={formFields}
      initialData={{
        supplierName: '',
        email: '',
        phoneNumber: '',
        address: '',
        taxCode: ''
      }}
      onSave={handleSave}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      submitButtonText="Tạo nhà cung cấp"
      cancelButtonText="Hủy"
      layout="double"
    />
  );
};

export default CreateSupplierForm;
