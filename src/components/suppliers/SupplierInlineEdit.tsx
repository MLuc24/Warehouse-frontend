import React from 'react';
import { Building2 } from 'lucide-react';
import { GenericInlineEdit } from '@/components/common';
import type { FormField } from '@/components/common';
import type { Supplier } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

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
  const { suppliers: supplierPermissions } = usePermissions();

  // Override permissions based on user role
  const effectiveCanEdit = canEdit && supplierPermissions.canEdit;
  const effectiveCanDelete = canDelete && supplierPermissions.canDelete;
  const effectiveIsReadOnly = isReadOnly || !supplierPermissions.canEdit;
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
      placeholder: 'Nhập email liên hệ'
    },
    {
      name: 'phoneNumber',
      label: 'Số điện thoại',
      type: 'tel',
      required: false,
      placeholder: 'Nhập số điện thoại'
    },
    {
      name: 'taxCode',
      label: 'Mã số thuế',
      type: 'text',
      required: false,
      placeholder: 'Nhập mã số thuế'
    },
    {
      name: 'address',
      label: 'Địa chỉ',
      type: 'textarea',
      required: false,
      placeholder: 'Nhập địa chỉ chi tiết của nhà cung cấp',
      rows: 3
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
      title={supplier.supplierName} // Chỉ hiển thị tên, không có "Chỉnh sửa"
      titleIcon={<Building2 className="w-5 h-5" />}
      fields={supplierFields}
      onSave={onSave}
      onDelete={onDelete}
      onReactivate={onReactivate}
      onCancel={onCancel}
      getItemId={(item) => item.supplierId}
      canEdit={effectiveCanEdit}
      canDelete={effectiveCanDelete}
      isReadOnly={effectiveIsReadOnly}
      isActive={(item) => item.status === 'Active'}
      deleteConfirmTitle="Xác nhận xóa nhà cung cấp"
      deleteConfirmMessage="Bạn có chắc chắn muốn xóa nhà cung cấp này? Hành động này không thể hoàn tác."
      reactivateButtonText="Kích hoạt lại nhà cung cấp"
      getAdditionalInfo={(item) => [
        { label: "ID", value: `#${item.supplierId}` },
        { label: "Số sản phẩm", value: `${item.totalProducts} sản phẩm` },
        { label: "Phiếu nhập", value: `${item.totalReceipts} phiếu` },
        { label: "Tổng giá trị", value: item.totalPurchaseValue ? `${item.totalPurchaseValue.toLocaleString('vi-VN')} VNĐ` : "Chưa có" },
        { label: "Ngày tạo", value: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : "Chưa có" },
        { label: "Trạng thái", value: item.status === 'Active' ? 'Đang hoạt động' : 'Hết hạn' }
      ]}
    />
  );
};
