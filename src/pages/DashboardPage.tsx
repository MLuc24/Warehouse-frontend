import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '@/components/ui';
import { Layout } from '@/components/layout';
import { productService, supplierService } from '@/services';
import { ROUTES } from '@/constants';
import type { Product, Supplier, ProductInventory } from '@/types';

export const DashboardPage: React.FC = () => {
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [topSuppliers, setTopSuppliers] = useState<Supplier[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<ProductInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsData, suppliersData, lowStockData] = await Promise.all([
          productService.getTopProducts(5),
          supplierService.getTopSuppliers(5),
          productService.getLowStockProducts(),
        ]);

        setTopProducts(productsData);
        setTopSuppliers(suppliersData);
        setLowStockProducts(lowStockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hệ thống quản lý kho</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
                <p className="text-2xl font-semibold text-gray-900">{topProducts.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Nhà cung cấp</p>
                <p className="text-2xl font-semibold text-gray-900">{topSuppliers.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sắp hết hàng</p>
                <p className="text-2xl font-semibold text-gray-900">{lowStockProducts.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Sản phẩm hàng đầu</h3>
              <Link to={ROUTES.PRODUCTS.LIST}>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div key={product.productId} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {product.currentStock} {product.unit}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.sellingPrice?.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có dữ liệu</p>
              )}
            </div>
          </Card>

          {/* Top Suppliers */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Nhà cung cấp hàng đầu</h3>
              <Link to={ROUTES.SUPPLIERS.LIST}>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {topSuppliers.length > 0 ? (
                topSuppliers.map((supplier) => (
                  <div key={supplier.supplierId} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{supplier.supplierName}</p>
                      <p className="text-sm text-gray-500">{supplier.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {supplier.totalProducts} sản phẩm
                      </p>
                      <p className="text-sm text-gray-500">
                        {supplier.totalPurchaseValue?.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có dữ liệu</p>
              )}
            </div>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Cảnh báo sắp hết hàng
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.productId} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  <p className="text-sm text-red-600 font-medium">
                    Còn lại: {product.currentStock} {product.unit}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};
