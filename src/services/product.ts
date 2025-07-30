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

export class ProductService {
  private static instance: ProductService;

  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getProducts(searchParams?: ProductSearch): Promise<ProductListResponse> {
    return apiService.get<ProductListResponse>(API_ENDPOINTS.PRODUCTS.LIST, searchParams as Record<string, unknown>);
  }

  async getProductById(id: number): Promise<Product> {
    return apiService.get<Product>(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
  }

  async getProductBySku(sku: string): Promise<Product> {
    return apiService.get<Product>(API_ENDPOINTS.PRODUCTS.GET_BY_SKU(sku));
  }

  async createProduct(data: CreateProduct): Promise<Product> {
    return apiService.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, data);
  }

  async updateProduct(id: number, data: UpdateProduct): Promise<Product> {
    return apiService.put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), data);
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(API_ENDPOINTS.PRODUCTS.DELETE(id));
  }

  async getProductStats(id: number): Promise<ProductStats> {
    return apiService.get<ProductStats>(API_ENDPOINTS.PRODUCTS.STATS(id));
  }

  async getTopProducts(count = 5): Promise<Product[]> {
    return apiService.get<Product[]>(API_ENDPOINTS.PRODUCTS.TOP_PRODUCTS, { count });
  }

  async getLowStockProducts(): Promise<ProductInventory[]> {
    return apiService.get<ProductInventory[]>(API_ENDPOINTS.PRODUCTS.LOW_STOCK);
  }

  async getProductsBySupplier(supplierId: number): Promise<Product[]> {
    return apiService.get<Product[]>(API_ENDPOINTS.PRODUCTS.BY_SUPPLIER(supplierId));
  }
}

export const productService = ProductService.getInstance();
