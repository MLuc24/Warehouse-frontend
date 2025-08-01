import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { GenericInlineEdit } from '@/components/common';
import type { FormField } from '@/components/common';
import type { Product, Supplier } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';
import { useSupplier } from '@/hooks';

interface ProductInlineEditProps {
  product: Product;
  onSave: (data: Partial<Product>) => Promise<void>;
  onDelete: (id: number | string) => Promise<void>;
  onReactivate?: (id: number | string) => Promise<void>;
  onCancel: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  isReadOnly?: boolean;
}

/**
 * Product Inline Edit Component
 * Wraps GenericInlineEdit with product-specific configuration
 */
export const ProductInlineEdit: React.FC<ProductInlineEditProps> = ({
  product,
  onSave,
  onDelete,
  onReactivate,
  onCancel,
  canEdit = true,
  canDelete = true,
  isReadOnly = false
}) => {
  const { products: productPermissions } = usePermissions();
  const { getActiveSuppliers } = useSupplier();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Load suppliers on mount
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const activeSuppliers = await getActiveSuppliers();
        setSuppliers(activeSuppliers);
      } catch (error) {
        console.error('Error loading suppliers:', error);
      }
    };
    loadSuppliers();
  }, [getActiveSuppliers]);

  // Override permissions based on user role - Products: tất cả role đều có toàn quyền
  const effectiveCanEdit = canEdit && productPermissions.canEdit;
  const effectiveCanDelete = canDelete && productPermissions.canDelete;
  const effectiveIsReadOnly = isReadOnly;
  const productFields: FormField[] = [
    {
      name: 'productName',
      label: 'Tên sản phẩm',
      type: 'text',
      required: true,
      placeholder: 'Nhập tên sản phẩm',
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue.length < 2) {
          return 'Tên sản phẩm phải có ít nhất 2 ký tự';
        }
        if (strValue.length > 200) {
          return 'Tên sản phẩm không được vượt quá 200 ký tự';
        }
        return null;
      }
    },
    {
      name: 'sku',
      label: 'Mã sản phẩm (SKU)',
      type: 'text',
      required: true,
      placeholder: 'Nhập mã sản phẩm duy nhất',
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue.length < 2) {
          return 'Mã SKU phải có ít nhất 2 ký tự';
        }
        if (strValue.length > 50) {
          return 'Mã SKU không được vượt quá 50 ký tự';
        }
        return null;
      }
    },
    {
      name: 'unit',
      label: 'Đơn vị tính',
      type: 'unit',
      required: true,
      description: 'Chọn đơn vị tính phù hợp cho sản phẩm',
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue.length > 50) {
          return 'Đơn vị tính không được vượt quá 50 ký tự';
        }
        return null;
      }
    },
    {
      name: 'supplierId',
      label: 'Nhà cung cấp',
      type: 'select',
      required: true,
      options: suppliers.map(supplier => ({
        label: supplier.supplierName,
        value: supplier.supplierId
      })),
      description: 'Chọn nhà cung cấp cho sản phẩm này'
    },
    {
      name: 'purchasePrice',
      label: 'Giá mua',
      type: 'number',
      required: true,
      placeholder: 'Nhập giá mua (VND)',
      validation: (value: unknown) => {
        if (!value || value === '') {
          return 'Giá mua là bắt buộc';
        }
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          return 'Giá mua phải là số dương lớn hơn 0';
        }
        return null;
      }
    },
    {
      name: 'sellingPrice',
      label: 'Giá bán',
      type: 'number',
      required: true,
      placeholder: 'Nhập giá bán (VND)',
      validation: (value: unknown) => {
        if (!value || value === '') {
          return 'Giá bán là bắt buộc';
        }
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          return 'Giá bán phải là số dương lớn hơn 0';
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
        { value: 'true', label: 'Hoạt động' },
        { value: 'false', label: 'Ngừng kinh doanh' }
      ]
    },
    {
      name: 'description',
      label: 'Mô tả sản phẩm',
      type: 'textarea',
      required: false,
      placeholder: 'Nhập mô tả chi tiết về sản phẩm',
      rows: 3,
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue.length > 1000) {
          return 'Mô tả không được vượt quá 1000 ký tự';
        }
        return null;
      }
    },
    {
      name: 'imageUrl',
      label: 'Hình ảnh sản phẩm',
      type: 'image',
      required: false,
      placeholder: 'Tải ảnh lên hoặc nhập URL hình ảnh',
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue && strValue.length > 1000) {
          return 'URL hình ảnh không được vượt quá 1000 ký tự';
        }
        return null;
      }
    }
  ];

  return (
    <GenericInlineEdit
      item={product}
      title={product.productName} // Chỉ hiển thị tên, không có "Chỉnh sửa"
      titleIcon={<Package className="w-5 h-5" />}
      fields={productFields}
      onSave={onSave}
      onDelete={onDelete}
      onReactivate={onReactivate}
      onCancel={onCancel}
      getItemId={(item) => item.productId}
      canEdit={effectiveCanEdit}
      canDelete={effectiveCanDelete}
      isReadOnly={effectiveIsReadOnly}
      isActive={(item) => item.status === true}
      deleteConfirmTitle="Xác nhận xóa sản phẩm"
      deleteConfirmMessage="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
      reactivateButtonText="Kích hoạt lại sản phẩm"
      getAdditionalInfo={(item) => [
        { label: "ID", value: `#${item.productId}` },
        { label: "Mã SKU", value: item.sku },
        { label: "Nhà cung cấp", value: item.supplierName || "Chưa có" },
        { label: "Tồn kho", value: `${item.currentStock} ${item.unit || ''}` },
        { label: "Tổng nhập", value: `${item.totalReceived} ${item.unit || ''}` },
        { label: "Tổng xuất", value: `${item.totalIssued} ${item.unit || ''}` },
        { label: "Giá trị tồn", value: item.totalValue ? `${item.totalValue.toLocaleString('vi-VN')} VNĐ` : "Chưa có" },
        { label: "Ngày tạo", value: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : "Chưa có" },
        { label: "Trạng thái", value: item.status ? 'Đang kinh doanh' : 'Ngừng kinh doanh' }
      ]}
    />
  );
};
