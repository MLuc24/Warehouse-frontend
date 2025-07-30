import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Input, LoadingSpinner } from '@/components/ui';
import { Layout } from '@/components/layout';
import { productService } from '@/services';
import { ROUTES } from '@/constants';
import type { Product, ProductSearch, ProductListResponse } from '@/types';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  const pageSize = 10;

  const fetchProducts = async (page = 1, keyword = '') => {
    try {
      setIsLoading(true);
      const searchParams: ProductSearch = {
        page,
        pageSize,
        keyword: keyword || undefined,
      };

      const response: ProductListResponse = await productService.getProducts(searchParams);
      setProducts(response.items);
      setTotalCount(response.totalCount);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1, searchKeyword);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page, searchKeyword);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600">Danh sách tất cả sản phẩm trong kho</p>
          </div>
          <Link to={ROUTES.PRODUCTS.CREATE}>
            <Button>Thêm sản phẩm mới</Button>
          </Link>
        </div>

        {/* Search */}
        <Card>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên sản phẩm, SKU..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </Card>

        {/* Products Table */}
        <Card>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nhà cung cấp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tồn kho
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá bán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.productId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.productName}
                              </div>
                              {product.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.supplierName || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              product.currentStock < 10 ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {product.currentStock} {product.unit}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.sellingPrice?.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product?.status
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product?.status ? 'Hoạt động' : 'Ngừng bán'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <Link 
                              to={ROUTES.PRODUCTS.VIEW(product.productId)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Xem
                            </Link>
                            <Link 
                              to={ROUTES.PRODUCTS.EDIT(product.productId)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Sửa
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          Không tìm thấy sản phẩm nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} của {totalCount} sản phẩm
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Trước
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};
