import { useMemo } from 'react';
import type { Supplier } from '@/types';
import { ExportService } from '@/utils';
import type { ExportColumn, ExportOptions } from '@/utils';

interface UseSupplierExportProps {
  suppliers: Supplier[];
  title?: string;
  filename?: string;
}

export const useSupplierExport = ({ 
  suppliers, 
  title = 'Danh sách nhà cung cấp',
  filename = 'danh-sach-nha-cung-cap'
}: UseSupplierExportProps) => {
  const exportOptions: ExportOptions = useMemo(() => {
    const columns: ExportColumn[] = [
      {
        key: 'supplierId',
        header: 'ID',
        width: 10
      },
      {
        key: 'supplierName',
        header: 'Tên nhà cung cấp',
        width: 30
      },
      {
        key: 'email',
        header: 'Email',
        width: 25,
        formatter: (value) => String(value || '')
      },
      {
        key: 'phoneNumber',
        header: 'Số điện thoại',
        width: 20,
        formatter: (value) => String(value || '')
      },
      {
        key: 'address',
        header: 'Địa chỉ',
        width: 35,
        formatter: (value) => String(value || '')
      },
      {
        key: 'taxCode',
        header: 'Mã số thuế',
        width: 20,
        formatter: (value) => String(value || '')
      },
      {
        key: 'totalProducts',
        header: 'Số sản phẩm',
        width: 15,
        formatter: (value) => typeof value === 'number' ? value.toString() : '0'
      },
      {
        key: 'totalReceipts',
        header: 'Số phiếu nhập',
        width: 15,
        formatter: (value) => typeof value === 'number' ? value.toString() : '0'
      },
      {
        key: 'totalPurchaseValue',
        header: 'Tổng giá trị mua',
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
        formatter: (value) => ExportService.formatStatus(value as string)
      },
      {
        key: 'createdAt',
        header: 'Ngày tạo',
        width: 20,
        formatter: (value) => ExportService.formatDate(value as string)
      }
    ];

    // Tính toán thống kê
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;
    const expiredSuppliers = totalSuppliers - activeSuppliers;
    const totalProducts = suppliers.reduce((sum, s) => sum + (s.totalProducts || 0), 0);
    const totalReceipts = suppliers.reduce((sum, s) => sum + (s.totalReceipts || 0), 0);
    const totalPurchaseValue = suppliers.reduce((sum, s) => sum + (s.totalPurchaseValue || 0), 0);

    const summaryData = {
      'Tổng số nhà cung cấp': totalSuppliers,
      'Nhà cung cấp hoạt động': activeSuppliers,
      'Nhà cung cấp hết hạn': expiredSuppliers,
      'Tổng số sản phẩm': totalProducts,
      'Tổng số phiếu nhập': totalReceipts,
      'Tổng giá trị mua hàng': ExportService.formatCurrency(totalPurchaseValue)
    };

    return {
      filename,
      title,
      columns,
      data: suppliers as unknown as Record<string, unknown>[],
      showSummary: true,
      summaryData
    };
  }, [suppliers, title, filename]);

  return {
    exportOptions,
    canExport: suppliers.length > 0
  };
};
