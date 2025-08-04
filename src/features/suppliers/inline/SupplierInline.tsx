import React from 'react';
import { Building2 } from 'lucide-react';
import { GenericInline } from '@/components/common';
import type { FormField } from '@/components/common';
import type { Supplier } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

interface SupplierInlineProps {
  supplier?: Supplier; // Optional for create mode
  onSave: (data: Partial<Supplier>) => Promise<void>;
  onDelete?: (id: number | string) => Promise<void>;
  onReactivate?: (id: number | string) => Promise<void>;
  onCancel: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  isReadOnly?: boolean;
  mode?: 'edit' | 'create'; // Add mode prop
  isSubmitting?: boolean; // Add submitting state
}

/**
 * Supplier Inline Edit Component
 * Handles both creating and editing suppliers with GenericInline
 */
export const SupplierInline: React.FC<SupplierInlineProps> = ({
  supplier,
  onSave,
  onDelete,
  onReactivate,
  onCancel,
  canEdit = true,
  canDelete = true,
  isReadOnly = false,
  mode = supplier ? 'edit' : 'create',
  isSubmitting = false
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
        return undefined;
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
        return undefined;
      }
    },
    {
      name: 'phoneNumber',
      label: 'Số điện thoại',
      type: 'text',
      required: true,
      placeholder: 'Nhập số điện thoại',
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue && !/^[0-9]{10,11}$/.test(strValue.replace(/\s/g, ''))) {
          return 'Số điện thoại không hợp lệ (10-11 chữ số)';
        }
        return undefined;
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
        return undefined;
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
        return undefined;
      }
    }
  ];

  // Add status field only in edit mode
  if (mode === 'edit') {
    supplierFields.push({
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: true,
      options: [
        { value: 'Active', label: 'Hoạt động' },
        { value: 'Expired', label: 'Hết hạn' }
      ]
    });
  }

  // Handle save with data transformation for create mode
  const handleSave = async (formData: Record<string, unknown>) => {
    if (mode === 'create') {
      // Transform data to match Supplier type
      const supplierData: Partial<Supplier> = {
        supplierName: String(formData.supplierName || ''),
        email: String(formData.email || ''),
        phoneNumber: String(formData.phoneNumber || ''),
        address: String(formData.address || ''),
        taxCode: formData.taxCode ? String(formData.taxCode) : undefined
      };
      await onSave(supplierData);
    } else {
      await onSave(formData as Partial<Supplier>);
    }
  };

  // Determine title and icon based on mode
  const title = mode === 'create' ? 'Thêm nhà cung cấp mới' : supplier?.supplierName || 'Chỉnh sửa nhà cung cấp';
  const description = mode === 'create' ? 'Điền thông tin để thêm nhà cung cấp mới vào hệ thống' : undefined;

  // Initial data for create mode  
  const initialData = mode === 'create' ? {
    supplierName: '',
    email: '',
    phoneNumber: '',
    address: '',
    taxCode: ''
  } : undefined;

  return (
    <GenericInline
      mode={mode}
      item={supplier}
      title={title}
      description={description}
      titleIcon={
        mode === 'create' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ) : (
          <Building2 className="w-5 h-5" />
        )
      }
      fields={supplierFields}
      initialData={initialData}
      onSave={handleSave}
      onDelete={mode === 'edit' && onDelete ? onDelete : (() => Promise.resolve())}
      onReactivate={onReactivate}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      getItemId={mode === 'edit' && supplier ? (item: unknown) => (item as Supplier).supplierId : () => 0}
      canEdit={mode === 'create' ? true : effectiveCanEdit}
      canDelete={mode === 'create' ? false : effectiveCanDelete}
      isReadOnly={mode === 'create' ? false : effectiveIsReadOnly}
      isActive={mode === 'edit' ? (item: unknown) => (item as Supplier).status === 'Active' : undefined}
      deleteConfirmTitle="Xác nhận xóa nhà cung cấp"
      deleteConfirmMessage="Bạn có chắc chắn muốn xóa nhà cung cấp này? Hành động này không thể hoàn tác."
      reactivateButtonText="Kích hoạt lại nhà cung cấp"
      layout="double"
      getAdditionalInfo={mode === 'edit' ? (item: unknown) => {
        const supplierItem = item as Supplier;
        return [
          { label: "ID", value: `#${supplierItem.supplierId}` },
          { label: "Số sản phẩm", value: `${supplierItem.totalProducts} sản phẩm` },
          { label: "Phiếu nhập", value: `${supplierItem.totalReceipts} phiếu` },
          { label: "Tổng giá trị", value: supplierItem.totalPurchaseValue ? `${supplierItem.totalPurchaseValue.toLocaleString('vi-VN')} VNĐ` : "Chưa có" },
          { label: "Ngày tạo", value: supplierItem.createdAt ? new Date(supplierItem.createdAt).toLocaleDateString('vi-VN') : "Chưa có" },
          { label: "Trạng thái", value: supplierItem.status === 'Active' ? 'Đang hoạt động' : 'Hết hạn' }
        ];
      } : undefined}
    />
  );
};
