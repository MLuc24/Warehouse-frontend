import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '@/components/ui';
import { Layout } from '@/components/layout';
import { useSupplier } from '@/hooks/useSupplier';
import { ROUTES } from '@/constants';

export const ViewSupplierPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const supplierId = parseInt(id || '0', 10);
  
  const { 
    supplier, 
    stats,
    loading, 
    loadingStats,
    deleting,
    error, 
    fetchSupplierById, 
    fetchSupplierStats,
    deleteSupplier,
    canDeleteSupplier,
    clearError, 
    clearSupplier,
    clearStats
  } = useSupplier();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  // Fetch supplier data on mount
  useEffect(() => {
    if (supplierId) {
      fetchSupplierById(supplierId);
      fetchSupplierStats(supplierId);
    }
    
    return () => {
      clearSupplier();
      clearStats();
    };
  }, [supplierId, fetchSupplierById, fetchSupplierStats, clearSupplier, clearStats]);

  // Check if supplier can be deleted when showing delete confirmation
  useEffect(() => {
    if (showDeleteConfirm && supplierId) {
      canDeleteSupplier(supplierId).then(setCanDelete);
    }
  }, [showDeleteConfirm, supplierId, canDeleteSupplier]);

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(async () => {
    if (!supplierId) return;
    
    const success = await deleteSupplier(supplierId);
    if (success) {
      navigate(ROUTES.SUPPLIERS.LIST);
    } else {
      setShowDeleteConfirm(false);
    }
  }, [supplierId, deleteSupplier, navigate]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(ROUTES.SUPPLIERS.LIST);
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  // Error state - supplier not found
  if (error && !supplier) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">{error}</p>
          </div>
          <Button onClick={handleBack} variant="outline">
            Quay lại danh sách
          </Button>
        </div>
      </Layout>
    );
  }

  if (!supplier) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy nhà cung cấp</p>
          <Button onClick={handleBack} variant="outline" className="mt-4">
            Quay lại danh sách
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
          <div className="flex items-center space-x-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{supplier.supplierName}</h1>
              <p className="text-gray-600 mt-1">Chi tiết thông tin nhà cung cấp</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link to={ROUTES.SUPPLIERS.EDIT(supplier.supplierId)}>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa
              </Button>
            </Link>
            <Button 
              onClick={() => setShowDeleteConfirm(true)} 
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa
            </Button>
          </div>
        </div>

        {/* Global Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{error}</p>
              <Button onClick={clearError} variant="outline" size="sm" className="ml-auto">
                ✕
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supplier Information */}
          <div className="lg:col-span-2">
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Thông tin nhà cung cấp</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tên nhà cung cấp
                    </label>
                    <p className="text-gray-900 font-medium">{supplier.supplierName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Mã số thuế
                    </label>
                    <p className="text-gray-900">{supplier.taxCode || 'Chưa có'}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Địa chỉ
                    </label>
                    <p className="text-gray-900">{supplier.address || 'Chưa có địa chỉ'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Số điện thoại
                    </label>
                    {supplier.phoneNumber ? (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${supplier.phoneNumber}`} className="text-blue-600 hover:text-blue-800">
                          {supplier.phoneNumber}
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-900">Chưa có</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    {supplier.email ? (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:text-blue-800">
                          {supplier.email}
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-900">Chưa có</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Ngày tạo
                    </label>
                    <p className="text-gray-900">
                      {supplier.createdAt 
                        ? new Date(supplier.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Không xác định'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Statistics */}
          <div>
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Thống kê</h3>
              </div>
              <div className="px-6 py-4">
                {loadingStats ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Sản phẩm</p>
                          <p className="text-xs text-gray-500">Tổng số sản phẩm</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{supplier.totalProducts}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Phiếu nhập</p>
                          <p className="text-xs text-gray-500">Tổng số phiếu</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-600">{supplier.totalReceipts}</span>
                    </div>

                    {supplier.totalPurchaseValue && supplier.totalPurchaseValue > 0 && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Giá trị mua hàng</p>
                            <p className="text-xs text-gray-500">Tổng giá trị</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-yellow-600">
                          {supplier.totalPurchaseValue.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    )}

                    {stats && stats.monthlyPurchases && stats.monthlyPurchases.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Mua hàng gần đây</h4>
                        <div className="space-y-2">
                          {stats.monthlyPurchases.slice(0, 3).map((purchase, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {purchase.month}/{purchase.year}
                              </span>
                              <span className="font-medium text-gray-900">
                                {purchase.amount.toLocaleString('vi-VN')} ₫
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <div className="px-6 py-4">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-100 rounded-full mr-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Bạn có chắc chắn muốn xóa nhà cung cấp <strong>{supplier.supplierName}</strong>?
                </p>
                
                {!canDelete && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ Không thể xóa nhà cung cấp này vì có dữ liệu liên quan (sản phẩm hoặc phiếu nhập).
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    disabled={deleting}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    disabled={deleting || !canDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleting && <LoadingSpinner size="sm" className="mr-2" />}
                    {deleting ? 'Đang xóa...' : 'Xóa'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewSupplierPage;
