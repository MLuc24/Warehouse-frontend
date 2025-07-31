import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Input, LoadingSpinner } from '@/components/ui';
import { Layout } from '@/components/layout';
import { useSupplier } from '@/hooks/useSupplier';
import { ROUTES } from '@/constants';
import type { SupplierSearch } from '@/types';

export const SuppliersPage: React.FC = () => {
  const {
    suppliers,
    totalCount,
    currentPage,
    totalPages,
    loading,
    error,
    fetchSuppliers,
    clearError
  } = useSupplier();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchParams, setSearchParams] = useState<SupplierSearch>({
    page: 1,
    pageSize: 10
  });

  // Fetch suppliers on component mount and when searchParams change
  useEffect(() => {
    fetchSuppliers(searchParams);
  }, [fetchSuppliers, searchParams]);

  // Handle search
  const handleSearch = useCallback(() => {
    const newSearchParams: SupplierSearch = {
      ...searchParams,
      keyword: searchKeyword.trim() || undefined,
      page: 1
    };
    setSearchParams(newSearchParams);
  }, [searchKeyword, searchParams]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  // Handle key press for search
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchKeyword('');
    setSearchParams(prev => ({
      ...prev,
      keyword: undefined,
      page: 1
    }));
  }, []);

  // Early return for error state
  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">{error}</p>
          </div>
          <Button onClick={clearError} variant="outline">
            Thử lại
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nhà cung cấp</h1>
            <p className="text-gray-600 mt-1">
              Quản lý danh sách nhà cung cấp ({totalCount} nhà cung cấp)
            </p>
          </div>
          <Link to={ROUTES.SUPPLIERS.CREATE}>
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm nhà cung cấp
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm kiếm
              </Button>
              {searchKeyword && (
                <Button onClick={handleClearSearch} variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Suppliers Table */}
        <Card>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhà cung cấp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thống kê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Hành động</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.length > 0 ? (
                    suppliers.map((supplier) => (
                      <tr key={supplier.supplierId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {supplier.supplierName}
                            </div>
                            {supplier.address && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                📍 {supplier.address}
                              </div>
                            )}
                            {supplier.taxCode && (
                              <div className="text-xs text-gray-400 mt-1">
                                MST: {supplier.taxCode}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm space-y-1">
                            {supplier.email && (
                              <div className="flex items-center text-gray-900">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                {supplier.email}
                              </div>
                            )}
                            {supplier.phoneNumber && (
                              <div className="flex items-center text-gray-900">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {supplier.phoneNumber}
                              </div>
                            )}
                            {!supplier.email && !supplier.phoneNumber && (
                              <span className="text-gray-400 text-sm">Chưa có thông tin liên hệ</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm space-y-1">
                            <div className="text-gray-900">
                              📦 {supplier.totalProducts} sản phẩm
                            </div>
                            <div className="text-gray-600">
                              📄 {supplier.totalReceipts} phiếu nhập
                            </div>
                            {supplier.totalPurchaseValue && supplier.totalPurchaseValue > 0 && (
                              <div className="text-green-600 font-medium">
                                💰 {supplier.totalPurchaseValue.toLocaleString('vi-VN')} ₫
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {supplier.createdAt 
                            ? new Date(supplier.createdAt).toLocaleDateString('vi-VN')
                            : '-'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <Link
                              to={ROUTES.SUPPLIERS.VIEW(supplier.supplierId)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              Xem
                            </Link>
                            <Link
                              to={ROUTES.SUPPLIERS.EDIT(supplier.supplierId)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            >
                              Sửa
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <p className="text-gray-500 text-lg">
                            {searchKeyword ? 'Không tìm thấy nhà cung cấp nào' : 'Chưa có nhà cung cấp nào'}
                          </p>
                          {searchKeyword && (
                            <Button onClick={handleClearSearch} variant="outline" className="mt-4">
                              Xóa bộ lọc
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Trước
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Sau
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{' '}
                    <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>
                    {' '}-{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, totalCount)}
                    </span>
                    {' '}trong{' '}
                    <span className="font-medium">{totalCount}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="rounded-l-md"
                    >
                      Trước
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          variant={currentPage === pageNum ? 'primary' : 'outline'}
                          className="-ml-px"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="rounded-r-md -ml-px"
                    >
                      Sau
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default SuppliersPage;
