import { useState, useCallback } from 'react';
import { productService } from '@/services';
import type { 
  Product, 
  CreateProduct, 
  UpdateProduct, 
  ProductSearch, 
  ProductListResponse,
  ProductStats,
  ProductInventory
} from '@/types';

interface UseProductReturn {
  // Data state
  products: Product[];
  product: Product | null;
  stats: ProductStats | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  
  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadingStats: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  fetchProducts: (searchParams?: ProductSearch) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchProductBySku: (sku: string) => Promise<void>;
  fetchProductStats: (id: number) => Promise<void>;
  createProduct: (data: CreateProduct) => Promise<Product | null>;
  updateProduct: (id: number, data: UpdateProduct) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  reactivateProduct: (id: number) => Promise<boolean>;
  canDeleteProduct: (id: number) => Promise<boolean>;
  getTopProducts: (count?: number) => Promise<Product[]>;
  getLowStockProducts: () => Promise<ProductInventory[]>;
  getProductsBySupplier: (supplierId: number) => Promise<Product[]>;
  getActiveProducts: () => Promise<Product[]>;
  clearError: () => void;
  clearProduct: () => void;
  clearStats: () => void;
}

/**
 * Comprehensive hook for all product operations
 * Following hook structure template from guidelines
 */
export const useProduct = (): UseProductReturn => {
  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle errors
  const handleError = useCallback((err: unknown, defaultMessage: string) => {
    const errorMessage = err instanceof Error ? err.message : defaultMessage;
    setError(errorMessage);
    console.error('Product operation error:', err);
  }, []);

  // Fetch products with search/pagination
  const fetchProducts = useCallback(async (searchParams?: ProductSearch) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ProductListResponse = await productService.getProducts(searchParams);
      setProducts(response.items);
      setTotalCount(response.totalCount);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải danh sách sản phẩm');
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fetch single product by ID
  const fetchProductById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const productData = await productService.getProductById(id);
      setProduct(productData);
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải thông tin sản phẩm');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fetch single product by SKU
  const fetchProductBySku = useCallback(async (sku: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const productData = await productService.getProductBySku(sku);
      setProduct(productData);
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải sản phẩm theo mã SKU');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fetch product statistics
  const fetchProductStats = useCallback(async (id: number) => {
    setLoadingStats(true);
    setError(null);
    
    try {
      const statsData = await productService.getProductStats(id);
      setStats(statsData);
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải thống kê sản phẩm');
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  }, [handleError]);

  // Create new product
  const createProduct = useCallback(async (data: CreateProduct): Promise<Product | null> => {
    setCreating(true);
    setError(null);
    
    try {
      const newProduct = await productService.createProduct(data);
      
      // Update products list if we have it loaded
      if (products.length > 0) {
        setProducts(prev => [newProduct, ...prev]);
        setTotalCount(prev => prev + 1);
      }
      
      return newProduct;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tạo sản phẩm');
      return null;
    } finally {
      setCreating(false);
    }
  }, [products.length, handleError]);

  // Update existing product
  const updateProduct = useCallback(async (id: number, data: UpdateProduct): Promise<Product | null> => {
    setUpdating(true);
    setError(null);
    
    try {
      const updatedProduct = await productService.updateProduct(id, data);
      
      // Update products list if we have it loaded
      if (products.length > 0) {
        setProducts(prev => 
          prev.map(p => p.productId === id ? updatedProduct : p)
        );
      }
      
      // Update single product if it's the one being edited
      if (product && product.productId === id) {
        setProduct(updatedProduct);
      }
      
      return updatedProduct;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi cập nhật sản phẩm');
      return null;
    } finally {
      setUpdating(false);
    }
  }, [products.length, product, handleError]);

  // Delete product
  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    setDeleting(true);
    setError(null);
    
    try {
      await productService.deleteProduct(id);
      
      // Update products list if we have it loaded
      if (products.length > 0) {
        setProducts(prev => prev.map(p => 
          p.productId === id ? { ...p, status: false } : p
        ));
      }
      
      // Update single product if it's the one being deleted
      if (product && product.productId === id) {
        setProduct(prev => prev ? { ...prev, status: false } : null);
      }
      
      return true;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi xóa sản phẩm');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [products.length, product, handleError]);

  // Check if product can be deleted
  const canDeleteProduct = useCallback(async (id: number): Promise<boolean> => {
    try {
      const result = await productService.canDeleteProduct(id);
      return result.canDelete;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi kiểm tra sản phẩm');
      return false;
    }
  }, [handleError]);

  // Reactivate product
  const reactivateProduct = useCallback(async (id: number): Promise<boolean> => {
    setUpdating(true);
    setError(null);
    
    try {
      await productService.reactivateProduct(id);
      
      // Update products list if we have it loaded
      if (products.length > 0) {
        setProducts(prev => prev.map(p => 
          p.productId === id ? { ...p, status: true } : p
        ));
      }
      
      // Update single product if it's the one being reactivated
      if (product && product.productId === id) {
        setProduct(prev => prev ? { ...prev, status: true } : null);
      }
      
      return true;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi kích hoạt lại sản phẩm');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [products.length, product, handleError]);

  // Get top products
  const getTopProducts = useCallback(async (count = 5): Promise<Product[]> => {
    try {
      const topProducts = await productService.getTopProducts(count);
      return topProducts;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải sản phẩm hàng đầu');
      return [];
    }
  }, [handleError]);

  // Get low stock products
  const getLowStockProducts = useCallback(async (): Promise<ProductInventory[]> => {
    try {
      const lowStockProducts = await productService.getLowStockProducts();
      return lowStockProducts;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải sản phẩm sắp hết hàng');
      return [];
    }
  }, [handleError]);

  // Get products by supplier
  const getProductsBySupplier = useCallback(async (supplierId: number): Promise<Product[]> => {
    try {
      const products = await productService.getProductsBySupplier(supplierId);
      return products;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải sản phẩm theo nhà cung cấp');
      return [];
    }
  }, [handleError]);

  // Get active products
  const getActiveProducts = useCallback(async (): Promise<Product[]> => {
    try {
      const activeProducts = await productService.getActiveProducts();
      return activeProducts;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải sản phẩm đang hoạt động');
      return [];
    }
  }, [handleError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear single product
  const clearProduct = useCallback(() => {
    setProduct(null);
  }, []);

  // Clear stats
  const clearStats = useCallback(() => {
    setStats(null);
  }, []);

  return {
    // Data state
    products,
    product,
    stats,
    totalCount,
    currentPage,
    totalPages,
    
    // Loading states
    loading,
    creating,
    updating,
    deleting,
    loadingStats,
    
    // Error state
    error,
    
    // Actions
    fetchProducts,
    fetchProductById,
    fetchProductBySku,
    fetchProductStats,
    createProduct,
    updateProduct,
    deleteProduct,
    reactivateProduct,
    canDeleteProduct,
    getTopProducts,
    getLowStockProducts,
    getProductsBySupplier,
    getActiveProducts,
    clearError,
    clearProduct,
    clearStats,
  };
};
