import React, { useState, useMemo } from 'react';
import { GenericList, ExportButtons } from '@/components/common';
import { ExportService, type ExportOptions } from '@/utils';
import type { Product } from '@/types';

type StatusFilter = 'all' | 'active' | 'inactive';
type DateSort = 'newest' | 'oldest';
type PriceSort = 'highest' | 'lowest' | 'none';

interface ProductListProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  onShowCreate?: () => void;
  loading: boolean;
  // Search props
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  // Permission props
  permissions?: {
    products: {
      canCreate: boolean;
    };
  };
}

/**
 * Enhanced Product List Component using GenericList
 * Optimized for overview with essential product information
 */
export const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onShowCreate,
  loading,
  // Search props
  searchTerm,
  onSearchTermChange,
  onSearch,
  onClearSearch,
  // Pagination props
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  // Permission props
  permissions
}) => {
  // State for filtering and sorting - No default filtering, show ALL products initially
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateSort, setDateSort] = useState<DateSort>('newest');
  const [purchasePriceSort, setPurchasePriceSort] = useState<PriceSort>('none');
  const [sellingPriceSort, setSellingPriceSort] = useState<PriceSort>('none');

  // Filter and sort products - Default behavior: show ALL products without any filtering
  const filteredAndSortedProducts = useMemo(() => {
    // Start with all products - NO FILTERING BY DEFAULT
    let filtered = [...products];

    // Only apply status filter if user explicitly selects something other than 'all'
    if (statusFilter === 'active') {
      filtered = filtered.filter(product => product.status === true);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(product => product.status === false);
    }
    // When statusFilter is 'all' (default), show ALL products without filtering

    // Apply sorting
    filtered.sort((a, b) => {
      // Priority 1: Purchase price sorting
      if (purchasePriceSort !== 'none') {
        const priceA = a.purchasePrice || 0;
        const priceB = b.purchasePrice || 0;
        if (purchasePriceSort === 'highest') {
          if (priceA !== priceB) return priceB - priceA;
        } else {
          if (priceA !== priceB) return priceA - priceB;
        }
      }

      // Priority 2: Selling price sorting
      if (sellingPriceSort !== 'none') {
        const priceA = a.sellingPrice || 0;
        const priceB = b.sellingPrice || 0;
        if (sellingPriceSort === 'highest') {
          if (priceA !== priceB) return priceB - priceA;
        } else {
          if (priceA !== priceB) return priceA - priceB;
        }
      }

      // Priority 3: Date sorting
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      if (dateSort === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return filtered;
  }, [products, statusFilter, dateSort, purchasePriceSort, sellingPriceSort]);

  // Export functionality
  const exportOptions: ExportOptions = useMemo(() => {
    const columns = [
      { key: 'productId', header: 'ID', width: 10 },
      { key: 'sku', header: 'Mã SKU', width: 20 },
      { key: 'productName', header: 'Tên sản phẩm', width: 30 },
      { key: 'supplierName', header: 'Nhà cung cấp', width: 25, formatter: (value: unknown) => String(value || 'Chưa có') },
      { key: 'unit', header: 'Đơn vị tính', width: 15, formatter: (value: unknown) => String(value || '') },
      { key: 'purchasePrice', header: 'Giá mua', width: 20, formatter: (value: unknown) => typeof value === 'number' ? ExportService.formatCurrency(value) : '' },
      { key: 'sellingPrice', header: 'Giá bán', width: 20, formatter: (value: unknown) => typeof value === 'number' ? ExportService.formatCurrency(value) : '' },
      { key: 'currentStock', header: 'Tồn kho', width: 15, formatter: (value: unknown) => typeof value === 'number' ? value.toString() : '0' },
      { key: 'status', header: 'Trạng thái', width: 15, formatter: (value: unknown) => ExportService.formatStatus(value as boolean | string) }
    ];

    const totalProducts = filteredAndSortedProducts.length;
    const activeProducts = filteredAndSortedProducts.filter(p => p.status).length;
    const inactiveProducts = totalProducts - activeProducts;
    const totalStock = filteredAndSortedProducts.reduce((sum, p) => sum + (p.currentStock || 0), 0);

    const summaryData = {
      'Tổng số sản phẩm': totalProducts,
      'Sản phẩm đang hoạt động': activeProducts,
      'Sản phẩm ngừng hoạt động': inactiveProducts,
      'Tổng tồn kho': totalStock
    };

    return {
      filename: 'danh-sach-san-pham',
      title: 'Danh sách sản phẩm',
      columns,
      data: filteredAndSortedProducts as unknown as Record<string, unknown>[],
      showSummary: true,
      summaryData
    };
  }, [filteredAndSortedProducts]);

  // Handle column header click
  const handleColumnHeaderClick = (column: { key: string; label: string }) => {
    if (column.key === 'status') {
      // Toggle status filter
      const nextStatus = statusFilter === 'all' ? 'active' : statusFilter === 'active' ? 'inactive' : 'all';
      setStatusFilter(nextStatus);
    } else if (column.key === 'createdAt') {
      // Toggle date sort
      const nextSort = dateSort === 'newest' ? 'oldest' : 'newest';
      setDateSort(nextSort);
    } else if (column.key === 'purchasePrice') {
      // Reset other price sort and toggle purchase price sort
      setSellingPriceSort('none');
      const nextSort = purchasePriceSort === 'none' ? 'highest' : purchasePriceSort === 'highest' ? 'lowest' : 'none';
      setPurchasePriceSort(nextSort);
    } else if (column.key === 'sellingPrice') {
      // Reset other price sort and toggle selling price sort
      setPurchasePriceSort('none');
      const nextSort = sellingPriceSort === 'none' ? 'highest' : sellingPriceSort === 'highest' ? 'lowest' : 'none';
      setSellingPriceSort(nextSort);
    }
  };

  // Define table columns - optimized for overview with essential information
  const columns = [
    {
      key: 'product',
      label: 'Sản phẩm',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.productName}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {product.productName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">
              {product.productName}
            </div>
            <div className="text-xs text-gray-500">
              SKU: {product.sku}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Danh mục',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 713 12V7a4 4 0 014-4z" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="text-sm text-gray-900 whitespace-nowrap">
          {product.categoryName ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {product.categoryName}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              Chưa phân loại
            </span>
          )}
        </div>
      )
    },
    {
      key: 'supplier',
      label: 'Nhà cung cấp',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="text-sm text-gray-900 whitespace-nowrap">
          {product.supplierName || 'Chưa có nhà cung cấp'}
        </div>
      )
    },
    {
      key: 'pricing',
      label: 'Giá bán',
      sortable: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="text-sm text-gray-900 whitespace-nowrap">
          <div className="space-y-1">
            {product.sellingPrice ? (
              <div className="font-medium text-green-600">
                {product.sellingPrice.toLocaleString('vi-VN')} ₫
              </div>
            ) : (
              <div className="text-gray-400">Chưa có giá</div>
            )}
            {product.purchasePrice && (
              <div className="text-xs text-gray-500">
                Giá mua: {product.purchasePrice.toLocaleString('vi-VN')} ₫
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Tồn kho',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="flex items-center whitespace-nowrap">
          <div className="text-sm text-gray-900">
            <div className="font-semibold">
              {product.currentStock}
              {product.unit && <span className="text-gray-500 ml-1">{product.unit}</span>}
            </div>
            <div className="text-xs text-gray-500">
              {product.minStockLevel !== undefined && product.maxStockLevel !== undefined ? (
                <>Min: {product.minStockLevel} | Max: {product.maxStockLevel}</>
              ) : (
                <>Min: N/A | Max: N/A</>
              )}
            </div>
          </div>
          {product.minStockLevel !== undefined && product.currentStock < product.minStockLevel && (
            <svg className="w-4 h-4 text-red-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>
      )
    },
    {
      key: 'expiry',
      label: 'Hạn sử dụng',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      render: (product: Product) => {
        if (!product.expiryDate) {
          return (
            <div className="text-sm text-gray-900 whitespace-nowrap">
              <div className="text-xs text-gray-500 font-medium">
                Không có HSD
              </div>
              <div className="text-xs text-gray-400">
                Chưa có dữ liệu
              </div>
            </div>
          );
        }

        const expiryDate = new Date(product.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let statusColor = 'text-green-600';
        let statusText = 'Còn hạn';
        
        if (daysUntilExpiry < 0) {
          statusColor = 'text-red-600';
          statusText = 'Đã hết hạn';
        } else if (daysUntilExpiry <= 7) {
          statusColor = 'text-orange-600';
          statusText = 'Sắp hết hạn';
        } else if (daysUntilExpiry <= 30) {
          statusColor = 'text-yellow-600';
          statusText = 'Cần chú ý';
        }

        return (
          <div className="text-sm text-gray-900 whitespace-nowrap">
            <div className={`text-xs font-medium ${statusColor}`}>
              {expiryDate.toLocaleDateString('vi-VN')}
            </div>
            <div className={`text-xs ${statusColor}`}>
              {statusText} ({daysUntilExpiry > 0 ? `${daysUntilExpiry} ngày` : `${Math.abs(daysUntilExpiry)} ngày trước`})
            </div>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      filterable: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      render: (product: Product) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
          product.status
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {product.status ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <ExportButtons 
          exportOptions={exportOptions}
          disabled={loading || filteredAndSortedProducts.length === 0}
        />
      </div>
      
      <GenericList<Product>
        // Data props
        items={filteredAndSortedProducts}
        selectedItem={selectedProduct}
        onSelectItem={onSelectProduct}
        loading={loading}
        
        // Header props
        title="Quản lý Sản phẩm"
        totalCount={products.length}
        headerIcon={
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
        onShowCreate={onShowCreate}
        createButtonText="Thêm"
        
        // Search props
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        searchPlaceholder="Tìm kiếm theo tên, SKU, nhà cung cấp..."
        
        // Pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        
        // Table props
        columns={columns}
        getItemKey={(product) => product.productId}
        isItemSelected={(product, selected) => selected?.productId === product.productId}
        
        // Column interactions
        onColumnHeaderClick={handleColumnHeaderClick}
        
        // Permission props
        permissions={{
          canCreate: permissions?.products.canCreate ?? false
        }}
        
        // Empty state props
        emptyStateIcon={
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
        emptyStateMessage="Chưa có sản phẩm nào được tạo"
        emptySearchMessage={(term) => `Không tìm thấy sản phẩm nào với từ khóa "${term}"`}
        emptyFilterMessage={(filter) => `Không có sản phẩm nào với trạng thái "${filter}"`}
      />
    </div>
  );
};

export default ProductList;
