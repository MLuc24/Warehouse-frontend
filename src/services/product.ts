import { apiService } from './api';
import { API_ENDPOINTS } from '@/constants';
import type { 
  Product, 
  CreateProduct, 
  UpdateProduct, 
  ProductSearch, 
  ProductListResponse,
  ProductStats,
  ProductInventory
} from '@/types';

// Backend response types for mapping
interface BackendProductListResponse {
  products?: Product[];
  Products?: Product[];
  totalCount?: number;
  TotalCount?: number;
  page?: number;
  Page?: number;
  pageSize?: number;
  PageSize?: number;
  totalPages?: number;
  TotalPages?: number;
}

/**
 * Product Service - Handle all product-related API calls
 * Following service layer pattern from guidelines
 */
export class ProductService {
  private static instance: ProductService;

  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Get paginated list of products with optional search
   */
  async getProducts(searchParams?: ProductSearch): Promise<ProductListResponse> {
    const params = searchParams ? this.buildSearchParams(searchParams) : undefined;
    const response = await apiService.get<BackendProductListResponse>(API_ENDPOINTS.PRODUCTS.LIST, params);
    
    // Map backend response to frontend type
    return {
      items: response.products || response.Products || [],
      totalCount: response.totalCount || response.TotalCount || 0,
      page: response.page || response.Page || 1,
      pageSize: response.pageSize || response.PageSize || 10,
      totalPages: response.totalPages || response.TotalPages || 0,
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<Product> {
    return apiService.get<Product>(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
  }

  /**
   * Get product by SKU
   */
  async getProductBySku(sku: string): Promise<Product> {
    return apiService.get<Product>(API_ENDPOINTS.PRODUCTS.GET_BY_SKU(sku));
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProduct): Promise<Product> {
    return apiService.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, data);
  }

  /**
   * Update existing product
   */
  async updateProduct(id: number, data: UpdateProduct): Promise<Product> {
    return apiService.put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), data);
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(API_ENDPOINTS.PRODUCTS.DELETE(id));
  }

  /**
   * Reactivate product (change status to active)
   */
  async reactivateProduct(id: number): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>(API_ENDPOINTS.PRODUCTS.REACTIVATE(id));
  }

  /**
   * Get product statistics
   */
  async getProductStats(id: number): Promise<ProductStats> {
    return apiService.get<ProductStats>(API_ENDPOINTS.PRODUCTS.STATS(id));
  }

  /**
   * Get top products by movement/value
   */
  async getTopProducts(count = 5): Promise<Product[]> {
    return apiService.get<Product[]>(API_ENDPOINTS.PRODUCTS.TOP_PRODUCTS, { count });
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(): Promise<ProductInventory[]> {
    return apiService.get<ProductInventory[]>(API_ENDPOINTS.PRODUCTS.LOW_STOCK);
  }

  /**
   * Get products by supplier
   */
  async getProductsBySupplier(supplierId: number): Promise<Product[]> {
    return apiService.get<Product[]>(API_ENDPOINTS.PRODUCTS.BY_SUPPLIER(supplierId));
  }

  /**
   * Get active products (for dropdowns and selection)
   */
  async getActiveProducts(): Promise<Product[]> {
    return apiService.get<Product[]>(API_ENDPOINTS.PRODUCTS.ACTIVE);
  }

  /**
   * Check if product can be deleted
   */
  async canDeleteProduct(id: number): Promise<{ canDelete: boolean; message: string }> {
    return apiService.get<{ canDelete: boolean; message: string }>(API_ENDPOINTS.PRODUCTS.CAN_DELETE(id));
  }

  /**
   * Build search parameters for API call
   * Map frontend parameters to backend DTO format
   */
  private buildSearchParams(searchParams: ProductSearch): Record<string, unknown> {
    const params: Record<string, unknown> = {};
    
    // Map 'keyword' to 'SearchTerm' for backend compatibility
    if (searchParams.keyword) params.SearchTerm = searchParams.keyword;
    if (searchParams.sku) params.Sku = searchParams.sku;
    if (searchParams.supplierId) params.SupplierId = searchParams.supplierId;
    if (searchParams.minPrice) params.MinPrice = searchParams.minPrice;
    if (searchParams.maxPrice) params.MaxPrice = searchParams.maxPrice;
    if (searchParams.status !== undefined) params.Status = searchParams.status;
    if (searchParams.page) params.Page = searchParams.page;
    if (searchParams.pageSize) params.PageSize = searchParams.pageSize;
    if (searchParams.sortBy) params.SortBy = searchParams.sortBy;
    if (searchParams.sortOrder) params.SortDescending = searchParams.sortOrder === 'desc';
    
    return params;
  }
}

export const productService = ProductService.getInstance();
