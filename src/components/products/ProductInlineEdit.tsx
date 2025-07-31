import React from 'react';
import { Package } from 'lucide-react';
import { GenericInlineEdit } from '@/components/common';
import type { FormField } from '@/components/common';
import type { Product } from '@/types';

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
  const productFields: FormField[] = [
    {
      name: 'sku',
      label: 'Mã sản phẩm (SKU)',
      type: 'text',
      required: true,
      placeholder: 'Nhập mã sản phẩm'
    },
    {
      name: 'productName',
      label: 'Tên sản phẩm',
      type: 'text',
      required: true,
      placeholder: 'Nhập tên sản phẩm'
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      required: false,
      placeholder: 'Nhập mô tả sản phẩm'
    },
    {
      name: 'unit',
      label: 'Đơn vị tính',
      type: 'text',
      required: false,
      placeholder: 'Nhập đơn vị tính (VD: cái, kg, hộp)'
    },
    {
      name: 'purchasePrice',
      label: 'Giá mua',
      type: 'number',
      required: false,
      placeholder: 'Nhập giá mua'
    },
    {
      name: 'sellingPrice',
      label: 'Giá bán',
      type: 'number',
      required: false,
      placeholder: 'Nhập giá bán'
    },
    {
      name: 'imageUrl',
      label: 'URL hình ảnh',
      type: 'url',
      required: false,
      placeholder: 'Nhập URL hình ảnh sản phẩm'
    }
  ];

  return (
    <GenericInlineEdit
      item={product}
      title="Chỉnh sửa sản phẩm"
      titleIcon={<Package className="w-5 h-5" />}
      fields={productFields}
      onSave={onSave}
      onDelete={onDelete}
      onReactivate={onReactivate}
      onCancel={onCancel}
      getItemId={(item) => item.productId}
      canEdit={canEdit}
      canDelete={canDelete}
      isReadOnly={isReadOnly}
      isActive={(item) => item.status === true}
      deleteConfirmTitle="Xác nhận xóa sản phẩm"
      deleteConfirmMessage="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
      reactivateButtonText="Kích hoạt lại sản phẩm"
    />
  );
};
