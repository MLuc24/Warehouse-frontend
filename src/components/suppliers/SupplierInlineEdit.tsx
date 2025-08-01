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
      placeholder: 'Nhập tên nhà cung cấp',
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
      required: true,
      placeholder: 'Nhập email liên hệ',
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
      required: true,
      placeholder: 'Nhập số điện thoại',
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue && !/^[0-9]{10,11}$/.test(strValue.replace(/\s/g, ''))) {
          return 'Số điện thoại không hợp lệ (10-11 chữ số)';
        }
        return null;
      }
    },
    {
      name: 'address',
      label: 'Địa chỉ',
      type: 'textarea',
      required: true,
      placeholder: 'Nhập địa chỉ chi tiết của nhà cung cấp',
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
      required: false,
      placeholder: 'Nhập mã số thuế (tùy chọn)',
      description: '10-13 chữ số',
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue && !/^[0-9]{10,13}$/.test(strValue.replace(/\s/g, ''))) {
          return 'Mã số thuế không hợp lệ (10-13 chữ số)';
        }
        return null;
      }
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
