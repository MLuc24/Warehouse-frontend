import React from 'react';
import { Building2 } from 'lucide-react';
import { GenericInlineEdit } from '@/components/common';
import type { FormField } from '@/components/common';
import type { Supplier } from '@/types';

interface SupplierInlineEditProps {
  supplier: Supplier;
  onSave: (data: Partial<Supplier>) => Promise<void>;
  onDelete: (id: number | string) => Promise<void>;
  onReactivate?: (id: number | string) => Promise<void>;
  onCancel: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  isReadOnly?: boolean;
}

/**
 * Supplier Inline Edit Component
 * Wraps GenericInlineEdit with supplier-specific configuration
 */
export const SupplierInlineEdit: React.FC<SupplierInlineEditProps> = ({
  supplier,
  onSave,
  onDelete,
  onReactivate,
  onCancel,
  canEdit = true,
  canDelete = true,
  isReadOnly = false
}) => {
  const supplierFields: FormField[] = [
    {
      name: 'supplierName',
      label: 'Tên nhà cung cấp',
      type: 'text',
      required: true,
      placeholder: 'Nhập tên nhà cung cấp'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: false,
      placeholder: 'Nhập email'
    },
    {
      name: 'phoneNumber',
      label: 'Số điện thoại',
      type: 'tel',
      required: false,
      placeholder: 'Nhập số điện thoại'
    },
    {
      name: 'address',
      label: 'Địa chỉ',
      type: 'textarea',
      required: false,
      placeholder: 'Nhập địa chỉ'
    },
    {
      name: 'taxCode',
      label: 'Mã số thuế',
      type: 'text',
      required: false,
      placeholder: 'Nhập mã số thuế'
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: true,
      options: [
        { value: 'Active', label: 'Hoạt động' },
        { value: 'Expired', label: 'Hết hạn' }
      ]
    }
  ];

  return (
    <GenericInlineEdit
      item={supplier}
      title="Chỉnh sửa nhà cung cấp"
      titleIcon={<Building2 className="w-5 h-5" />}
      fields={supplierFields}
      onSave={onSave}
      onDelete={onDelete}
      onReactivate={onReactivate}
      onCancel={onCancel}
      getItemId={(item) => item.supplierId}
      canEdit={canEdit}
      canDelete={canDelete}
      isReadOnly={isReadOnly}
      isActive={(item) => item.status === 'Active'}
      deleteConfirmTitle="Xác nhận xóa nhà cung cấp"
      deleteConfirmMessage="Bạn có chắc chắn muốn xóa nhà cung cấp này? Hành động này không thể hoàn tác."
      reactivateButtonText="Kích hoạt lại nhà cung cấp"
    />
  );
};
