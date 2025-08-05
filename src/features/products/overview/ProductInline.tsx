import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { GenericInline } from '@/components/common';
import type { FormField } from '@/components/common';
import type { Product, Supplier } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';
import { useSupplier } from '@/hooks';

interface ProductInlineProps {
  product?: Product; // Optional for create mode
  onSave: (data: Partial<Product>) => Promise<void>;
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
 * Product Inline Edit Component
 * Handles both creating and editing products with GenericInline
 */
export const ProductInline: React.FC<ProductInlineProps> = ({
  product,
  onSave,
  onDelete,
  onReactivate,
  onCancel,
  canEdit = true,
  canDelete = true,
  isReadOnly = false,
  mode = product ? 'edit' : 'create',
  isSubmitting = false
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
        return undefined;
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
        return undefined;
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
        return undefined;
      }
    },
    {
      name: 'supplierId',
      label: 'Nhà cung cấp',
      type: 'select',
      required: true,
      options: suppliers.map(supplier => ({
        label: supplier.supplierName,
        value: String(supplier.supplierId)
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
        return undefined;
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
        return undefined;
      }
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
        return undefined;
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
        return undefined;
      }
    }
  ];

  // Add status field only in edit mode
  if (mode === 'edit') {
    productFields.push({
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: true,
      options: [
        { value: 'true', label: 'Hoạt động' },
        { value: 'false', label: 'Ngừng kinh doanh' }
      ]
    });
  }

  // Handle save with data transformation for create mode
  const handleSave = async (formData: Record<string, unknown>) => {
    if (mode === 'create') {
      // Transform data to match Product type
      const productData: Partial<Product> = {
        productName: String(formData.productName || ''),
        sku: String(formData.sku || ''),
        unit: String(formData.unit || ''),
        supplierId: Number(formData.supplierId),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        description: formData.description ? String(formData.description) : undefined,
        imageUrl: formData.imageUrl ? String(formData.imageUrl) : undefined
      };
      await onSave(productData);
    } else {
      await onSave(formData as Partial<Product>);
    }
  };

  // Determine title and icon based on mode
  const title = mode === 'create' ? 'Thêm sản phẩm mới' : product?.productName || 'Chỉnh sửa sản phẩm';
  const description = mode === 'create' ? 'Điền thông tin để thêm sản phẩm mới vào hệ thống' : undefined;

  // Initial data for create mode  
  const initialData = mode === 'create' ? {
    productName: '',
    sku: '',
    unit: '',
    supplierId: '',
    purchasePrice: '',
    sellingPrice: '',
    description: '',
    imageUrl: ''
  } : undefined;

  return (
    <GenericInline
      mode={mode}
      item={product}
      title={title}
      description={description}
      titleIcon={
        mode === 'create' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ) : (
          <Package className="w-5 h-5" />
        )
      }
      fields={productFields}
      initialData={initialData}
      onSave={handleSave}
      onDelete={mode === 'edit' && onDelete ? onDelete : (() => Promise.resolve())}
      onReactivate={onReactivate}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      getItemId={mode === 'edit' && product ? (item: unknown) => (item as Product).productId : () => 0}
      canEdit={mode === 'create' ? true : effectiveCanEdit}
      canDelete={mode === 'create' ? false : effectiveCanDelete}
      isReadOnly={mode === 'create' ? false : effectiveIsReadOnly}
      isActive={mode === 'edit' ? (item: unknown) => (item as Product).status === true : undefined}
      deleteConfirmTitle="Xác nhận xóa sản phẩm"
      deleteConfirmMessage="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
      reactivateButtonText="Kích hoạt lại sản phẩm"
      layout="double"
      getAdditionalInfo={mode === 'edit' ? (item: unknown) => {
        const productItem = item as Product;
        return [
          { label: "ID", value: `#${productItem.productId}` },
          { label: "Mã SKU", value: productItem.sku },
          { label: "Nhà cung cấp", value: productItem.supplierName || "Chưa có" },
          { label: "Tồn kho", value: `${productItem.currentStock} ${productItem.unit || ''}` },
          { label: "Tổng nhập", value: `${productItem.totalReceived} ${productItem.unit || ''}` },
          { label: "Tổng xuất", value: `${productItem.totalIssued} ${productItem.unit || ''}` },
          { label: "Giá trị tồn", value: productItem.totalValue ? `${productItem.totalValue.toLocaleString('vi-VN')} VNĐ` : "Chưa có" },
          { label: "Ngày tạo", value: productItem.createdAt ? new Date(productItem.createdAt).toLocaleDateString('vi-VN') : "Chưa có" },
          { label: "Trạng thái", value: productItem.status ? 'Đang kinh doanh' : 'Ngừng kinh doanh' }
        ];
      } : undefined}
    />
  );
};
