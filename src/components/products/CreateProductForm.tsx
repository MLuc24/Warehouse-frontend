import React, { useState, useEffect } from 'react';
import { GenericForm } from '@/components/common';
import type { FormField } from '@/components/common';
import { useSupplier } from '@/hooks';
import type { Product, Supplier } from '@/types';

interface CreateProductFormProps {
  onSave: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

/**
 * Enhanced Create Product Form Component using GenericForm
 * Provides form functionality for creating new products
 */
export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  onSave,
  onCancel,
  isSubmitting
}) => {
  // Get suppliers for dropdown
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

  // Define form fields
  const formFields: FormField[] = [
    {
      name: 'sku',
      label: 'Mã SKU',
      type: 'text',
      placeholder: 'Nhập mã SKU',
      required: true,
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue.length > 50) {
          return 'Mã SKU không được vượt quá 50 ký tự';
        }
        return null;
      }
    },
    {
      name: 'productName',
      label: 'Tên sản phẩm',
      type: 'text',
      placeholder: 'Nhập tên sản phẩm',
      required: true,
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue.length > 200) {
          return 'Tên sản phẩm không được vượt quá 200 ký tự';
        }
        return null;
      }
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      placeholder: 'Nhập mô tả sản phẩm (tùy chọn)',
      rows: 4,
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue.length > 1000) {
          return 'Mô tả không được vượt quá 1000 ký tự';
        }
        return null;
      }
    },
    {
      name: 'supplierId',
      label: 'Nhà cung cấp',
      type: 'select',
      options: suppliers.map(supplier => ({
        label: supplier.supplierName,
        value: supplier.supplierId
      })),
      description: 'Chọn nhà cung cấp cho sản phẩm này'
    },
    {
      name: 'unit',
      label: 'Đơn vị tính',
      type: 'unit',
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
      name: 'purchasePrice',
      label: 'Giá mua',
      type: 'number',
      placeholder: 'Nhập giá mua',
      validation: (value: unknown) => {
        if (value && value !== '') {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            return 'Giá mua phải là số dương';
          }
        }
        return null;
      }
    },
    {
      name: 'sellingPrice',
      label: 'Giá bán',
      type: 'number',
      placeholder: 'Nhập giá bán',
      validation: (value: unknown) => {
        if (value && value !== '') {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            return 'Giá bán phải là số dương';
          }
        }
        return null;
      }
    },
    {
      name: 'imageUrl',
      label: 'Hình ảnh sản phẩm',
      type: 'image',
      description: 'Tải ảnh lên Cloudinary hoặc nhập URL hình ảnh sản phẩm',
      validation: (value: unknown) => {
        const strValue = String(value || '');
        if (strValue && strValue.length > 1000) {
          return 'URL hình ảnh không được vượt quá 1000 ký tự';
        }
        return null;
      }
    },
    {
      name: 'status',
      label: 'Kích hoạt sản phẩm',
      type: 'checkbox'
    }
  ];

  // Handle save with data transformation
  const handleSave = async (formData: Record<string, unknown>) => {
    // Transform data to match Product type
    const productData: Partial<Product> = {
      sku: String(formData.sku || ''),
      productName: String(formData.productName || ''),
      description: formData.description ? String(formData.description) : undefined,
      supplierId: formData.supplierId ? Number(formData.supplierId) : undefined,
      unit: formData.unit ? String(formData.unit) : undefined,
      purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : undefined,
      sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice) : undefined,
      imageUrl: formData.imageUrl ? String(formData.imageUrl) : undefined,
      status: Boolean(formData.status)
    };

    await onSave(productData);
  };

  return (
    <GenericForm
      title="Thêm sản phẩm mới"
      description="Điền thông tin để thêm sản phẩm mới vào hệ thống"
      titleIcon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }
      fields={formFields}
      initialData={{
        sku: '',
        productName: '',
        description: '',
        supplierId: '',
        unit: '',
        purchasePrice: '',
        sellingPrice: '',
        imageUrl: '',
        status: true
      }}
      onSave={handleSave}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      submitButtonText="Tạo sản phẩm"
      cancelButtonText="Hủy"
      layout="double"
    />
  );
};

export default CreateProductForm;
