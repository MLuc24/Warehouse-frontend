import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { GenericInline } from '@/components/common';
import type { FormField } from '@/components/common';
import type { Product, Supplier } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';
import { useSupplier } from '@/hooks';
import { categoryApi } from '@/services/category';

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
  const [categories, setCategories] = useState<Array<{value: string, label: string}>>([]);

  // Load suppliers and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [activeSuppliers, categoryOptions] = await Promise.all([
          getActiveSuppliers(),
          categoryApi.getForDropdown()
        ]);
        setSuppliers(activeSuppliers);
        setCategories(categoryOptions);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
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
      name: 'categoryId',
      label: 'Danh mục sản phẩm',
      type: 'select',
      required: true,
      options: categories,
      description: 'Chọn danh mục phù hợp cho sản phẩm này'
    },
    {
      name: 'minStockLevel',
      label: 'Mức tồn kho tối thiểu',
      type: 'number',
      required: false,
      placeholder: 'Nhập số lượng tồn kho tối thiểu',
      description: 'Hệ thống sẽ cảnh báo khi tồn kho dưới mức này',
      validation: (value: unknown) => {
        if (value && value !== '') {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            return 'Mức tồn kho tối thiểu phải là số không âm';
          }
        }
        return undefined;
      }
    },
    {
      name: 'maxStockLevel',
      label: 'Mức tồn kho tối đa',
      type: 'number',
      required: false,
      placeholder: 'Nhập số lượng tồn kho tối đa',
      description: 'Mức tồn kho tối đa khuyến nghị',
      validation: (value: unknown) => {
        if (value && value !== '') {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            return 'Mức tồn kho tối đa phải là số không âm';
          }
        }
        return undefined;
      }
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
      name: 'expiryDate',
      label: 'Hạn sử dụng',
      type: 'date',
      required: false,
      placeholder: 'Chọn ngày hết hạn',
      description: 'Ngày hết hạn của sản phẩm',
      validation: (value: unknown) => {
        // Allow null, undefined, or empty string for optional field
        if (value === null || value === undefined || value === '') {
          return undefined;
        }
        
        const dateValue = new Date(String(value));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (isNaN(dateValue.getTime())) {
          return 'Ngày hết hạn không hợp lệ';
        }
        
        if (dateValue <= today) {
          return 'Ngày hết hạn phải sau ngày hiện tại';
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
      name: 'storageType',
      label: 'Loại bảo quản',
      type: 'select',
      required: false,
      options: [
        { value: 'Khô', label: 'Khô' },
        { value: 'Lạnh', label: 'Lạnh' },
        { value: 'Đông lạnh', label: 'Đông lạnh' },
        { value: 'Thường', label: 'Thường' }
      ],
      description: 'Chọn loại bảo quản phù hợp'
    },
    {
      name: 'isPerishable',
      label: 'Hàng dễ hỏng',
      type: 'select',
      required: false,
      options: [
        { value: 'true', label: 'Có' },
        { value: 'false', label: 'Không' }
      ],
      description: 'Sản phẩm có dễ hỏng không?'
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
    try {
      console.log('Raw form data:', formData); // Debug log
      
      // Helper function to safely convert to number, allowing 0 as valid value
      const safeNumberConvert = (value: unknown): number | undefined => {
        const strValue = String(value || '').trim();
        if (strValue === '') return undefined;
        const numValue = Number(strValue);
        return isNaN(numValue) ? undefined : numValue;
      };

      // Helper function to safely convert to string, allowing empty string
      const safeStringConvert = (value: unknown): string | undefined => {
        if (value === null || value === undefined) return undefined;
        const strValue = String(value).trim();
        return strValue === '' ? undefined : strValue;
      };
      
      if (mode === 'create') {
        // Transform data to match Product type
        const productData: Partial<Product> = {
          productName: String(formData.productName || ''),
          sku: String(formData.sku || ''),
          unit: String(formData.unit || ''),
          supplierId: safeNumberConvert(formData.supplierId),
          categoryId: safeNumberConvert(formData.categoryId),
          purchasePrice: safeNumberConvert(formData.purchasePrice),
          sellingPrice: safeNumberConvert(formData.sellingPrice),
          minStockLevel: safeNumberConvert(formData.minStockLevel),
          maxStockLevel: safeNumberConvert(formData.maxStockLevel),
          expiryDate: safeStringConvert(formData.expiryDate),
          storageType: safeStringConvert(formData.storageType), // 🔥 FIXED: Add missing storageType
          isPerishable: formData.isPerishable === 'true', // 🔥 FIXED: Add missing isPerishable
          description: safeStringConvert(formData.description),
          imageUrl: safeStringConvert(formData.imageUrl)
        };
        
        console.log('Transformed product data (create):', productData); // Debug log
        await onSave(productData);
      } else {
        // For edit mode, also transform the data properly
        const productData: Partial<Product> = {
          productName: String(formData.productName || ''),
          sku: String(formData.sku || ''),
          unit: String(formData.unit || ''),
          supplierId: safeNumberConvert(formData.supplierId),
          categoryId: safeNumberConvert(formData.categoryId),
          purchasePrice: safeNumberConvert(formData.purchasePrice),
          sellingPrice: safeNumberConvert(formData.sellingPrice),
          minStockLevel: safeNumberConvert(formData.minStockLevel),
          maxStockLevel: safeNumberConvert(formData.maxStockLevel),
          expiryDate: safeStringConvert(formData.expiryDate),
          storageType: safeStringConvert(formData.storageType), // 🔥 FIXED: Add missing storageType
          isPerishable: formData.isPerishable === 'true', // 🔥 FIXED: Add missing isPerishable
          description: safeStringConvert(formData.description),
          imageUrl: safeStringConvert(formData.imageUrl),
          status: formData.status === 'true' // Convert string to boolean directly
        };
        
        console.log('Transformed product data (edit):', productData); // Debug log
        await onSave(productData);
      }
      
      console.log('Save completed successfully'); // Debug log
      
    } catch (error) {
      console.error('Error in handleSave:', error); // Debug log
      throw error; // Re-throw để GenericInline có thể handle
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
    categoryId: '',
    purchasePrice: '',
    sellingPrice: '',
    minStockLevel: '',
    maxStockLevel: '',
    expiryDate: '',
    description: '',
    imageUrl: ''
  } : product ? {
    productName: product.productName || '',
    sku: product.sku || '',
    unit: product.unit || '',
    supplierId: product.supplierId ? String(product.supplierId) : '',
    categoryId: product.categoryId ? String(product.categoryId) : '',
    purchasePrice: product.purchasePrice ? String(product.purchasePrice) : '',
    sellingPrice: product.sellingPrice ? String(product.sellingPrice) : '',
    minStockLevel: product.minStockLevel !== undefined ? String(product.minStockLevel) : '',
    maxStockLevel: product.maxStockLevel !== undefined ? String(product.maxStockLevel) : '',
    expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : '', // Format date for input
    description: product.description || '',
    imageUrl: product.imageUrl || '',
    status: product.status !== undefined ? String(product.status) : 'true'
  } : undefined;

  return (
    <>
      {mode === 'create' ? (
        <GenericInline
          mode="create"
          title={title}
          description={description}
          titleIcon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
          fields={productFields}
          initialData={initialData}
          onSave={handleSave}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          layout="double"
        />
      ) : product ? (
        <GenericInline
          mode="edit"
          item={product}
          title={title}
          description={description}
          titleIcon={<Package className="w-5 h-5" />}
          fields={productFields}
          initialData={initialData}
          onSave={handleSave}
          onDelete={onDelete || (() => Promise.resolve())}
          onReactivate={onReactivate}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          getItemId={(item: Product) => item.productId}
          canEdit={effectiveCanEdit}
          canDelete={effectiveCanDelete}
          isReadOnly={effectiveIsReadOnly}
          isActive={(item: Product) => item.status === true}
          deleteConfirmTitle="Xác nhận xóa sản phẩm"
          deleteConfirmMessage="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
          reactivateButtonText="Kích hoạt lại sản phẩm"
          layout="double"
          getAdditionalInfo={(item: Product) => [
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
      ) : null}
    </>
  );
};
