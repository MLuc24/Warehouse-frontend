import React, { useState, useMemo } from 'react';
import { GenericList, ExportButtons } from '@/components/common';
import { useProductExport } from '@/hooks';
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
 * Shows list of products with click to select functionality
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
  // State for filtering and sorting
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateSort, setDateSort] = useState<DateSort>('newest');
  const [purchasePriceSort, setPurchasePriceSort] = useState<PriceSort>('none');
  const [sellingPriceSort, setSellingPriceSort] = useState<PriceSort>('none');

  // Filter and sort products based on current filters
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (statusFilter === 'active') return product.status === true;
        if (statusFilter === 'inactive') return product.status === false;
        return true;
      });
    }

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
  const { exportOptions, canExport } = useProductExport({
    products: filteredAndSortedProducts,
    title: 'Danh sách sản phẩm',
    filename: 'danh-sach-san-pham'
  });

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

  // Define table columns
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
              ID: {product.productId}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'sku',
      label: 'SKU',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
          {product.sku}
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
      key: 'purchasePrice',
      label: 'Giá mua',
      sortable: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="text-sm text-gray-900 whitespace-nowrap">
          {product.purchasePrice ? (
            <span className="font-medium text-blue-600">
              {product.purchasePrice.toLocaleString('vi-VN')} ₫
            </span>
          ) : (
            <span className="text-gray-400">Chưa có giá</span>
          )}
        </div>
      )
    },
    {
      key: 'sellingPrice',
      label: 'Giá bán',
      sortable: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="text-sm text-gray-900 whitespace-nowrap">
          {product.sellingPrice ? (
            <span className="font-medium text-green-600">
              {product.sellingPrice.toLocaleString('vi-VN')} ₫
            </span>
          ) : (
            <span className="text-gray-400">Chưa có giá</span>
          )}
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
            <span className="font-semibold">{product.currentStock}</span>
            {product.unit && <span className="text-gray-500 ml-1">{product.unit}</span>}
          </div>
          {product.currentStock < 10 && (
            <svg className="w-4 h-4 text-red-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>
      )
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
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      sortable: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="text-sm text-gray-900 whitespace-nowrap">
          {product.createdAt 
            ? new Date(product.createdAt).toLocaleDateString('vi-VN')
            : (
              <span className="text-gray-400 italic">N/A</span>
            )
          }
        </div>
      )
    },
    {
      key: 'description',
      label: 'Mô tả',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      render: (product: Product) => (
        <div className="text-sm text-gray-900 max-w-xs">
          {product.description ? (
            <span className="truncate" title={product.description}>
              {product.description}
            </span>
          ) : (
            <span className="text-gray-400 italic">Không có mô tả</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <ExportButtons
          exportOptions={exportOptions}
          disabled={!canExport || loading}
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
