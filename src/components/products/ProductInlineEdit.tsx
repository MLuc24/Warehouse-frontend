import React from 'react';
import { Package } from 'lucide-react';
import { GenericInlineEdit } from '@/components/common';
import type { FormField } from '@/components/common';
import type { Product } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

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
      placeholder: 'Nhập tên sản phẩm'
    },
    {
      name: 'sku',
      label: 'Mã sản phẩm (SKU)',
      type: 'text',
      required: true,
      placeholder: 'Nhập mã sản phẩm duy nhất'
    },
    {
      name: 'unit',
      label: 'Đơn vị tính',
      type: 'unit',
      required: false,
      description: 'Chọn đơn vị tính phù hợp cho sản phẩm'
    },
    {
      name: 'purchasePrice',
      label: 'Giá mua',
      type: 'number',
      required: false,
      placeholder: 'Nhập giá mua (VND)'
    },
    {
      name: 'sellingPrice',
      label: 'Giá bán',
      type: 'number',
      required: false,
      placeholder: 'Nhập giá bán (VND)'
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
      rows: 3
    },
    {
      name: 'imageUrl',
      label: 'Hình ảnh sản phẩm',
      type: 'image',
      required: false,
      placeholder: 'Tải ảnh lên hoặc nhập URL hình ảnh'
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
