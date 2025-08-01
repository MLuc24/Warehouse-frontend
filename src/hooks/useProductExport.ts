import { useMemo } from 'react';
import type { Product } from '@/types';
import { ExportService } from '@/utils';
import type { ExportColumn, ExportOptions } from '@/utils';

interface UseProductExportProps {
  products: Product[];
  title?: string;
  filename?: string;
}

export const useProductExport = ({ 
  products, 
  title = 'Danh sách sản phẩm',
  filename = 'danh-sach-san-pham'
}: UseProductExportProps) => {
  const exportOptions: ExportOptions = useMemo(() => {
    const columns: ExportColumn[] = [
      {
        key: 'productId',
        header: 'ID',
        width: 10
      },
      {
        key: 'sku',
        header: 'Mã SKU',
        width: 20
      },
      {
        key: 'productName',
        header: 'Tên sản phẩm',
        width: 30
      },
      {
        key: 'supplierName',
        header: 'Nhà cung cấp',
        width: 25,
        formatter: (value) => String(value || 'Chưa có')
      },
      {
        key: 'unit',
        header: 'Đơn vị tính',
        width: 15,
        formatter: (value) => String(value || '')
      },
      {
        key: 'purchasePrice',
        header: 'Giá mua',
        width: 20,
        formatter: (value) => {
          if (typeof value === 'number') {
            return ExportService.formatCurrency(value);
          }
          return '';
        }
      },
      {
        key: 'sellingPrice',
        header: 'Giá bán',
        width: 20,
        formatter: (value) => {
          if (typeof value === 'number') {
            return ExportService.formatCurrency(value);
          }
          return '';
        }
      },
      {
        key: 'currentStock',
        header: 'Tồn kho',
        width: 15,
        formatter: (value) => typeof value === 'number' ? value.toString() : '0'
      },
      {
        key: 'totalValue',
        header: 'Tổng giá trị',
        width: 20,
        formatter: (value) => {
          if (typeof value === 'number') {
            return ExportService.formatCurrency(value);
          }
          return '';
        }
      },
      {
        key: 'status',
        header: 'Trạng thái',
        width: 15,
        formatter: (value) => ExportService.formatStatus(value as boolean | string)
      },
      {
        key: 'createdAt',
        header: 'Ngày tạo',
        width: 20,
        formatter: (value) => ExportService.formatDate(value as string)
      }
    ];

    // Tính toán thống kê
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status).length;
    const inactiveProducts = totalProducts - activeProducts;
    const totalStock = products.reduce((sum, p) => sum + (p.currentStock || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + (p.totalValue || 0), 0);

    const summaryData = {
      'Tổng số sản phẩm': totalProducts,
      'Sản phẩm đang hoạt động': activeProducts,
      'Sản phẩm ngừng hoạt động': inactiveProducts,
      'Tổng tồn kho': totalStock,
      'Tổng giá trị': ExportService.formatCurrency(totalValue)
    };

    return {
      filename,
      title,
      columns,
      data: products as unknown as Record<string, unknown>[],
      showSummary: true,
      summaryData
    };
  }, [products, title, filename]);

  return {
    exportOptions,
    canExport: products.length > 0
  };
};
