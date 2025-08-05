import { apiService } from './api';
import { API_ENDPOINTS } from '@/constants';
import type { 
  ProductStock,
  StockAdjustment,
  StockHistory,
  BulkStockUpdate,
  StockLevelsUpdate,
  ProductInventory
} from '@/types';

/**
 * Stock Service - Handle all stock-related API calls
 * Following service layer pattern from guidelines
 */
export class StockService {
  private static instance: StockService;

  private constructor() {}

  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  /**
   * Get all stock information
   */
  async getAllStockInfo(): Promise<ProductStock[]> {
    return apiService.get<ProductStock[]>(API_ENDPOINTS.PRODUCTS.STOCK.LIST);
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(): Promise<ProductInventory[]> {
    return apiService.get<ProductInventory[]>(API_ENDPOINTS.PRODUCTS.STOCK.LOW_STOCK);
  }

  /**
   * Update stock for a single product
   */
  async updateStock(productId: number, data: StockAdjustment): Promise<{ message: string }> {
    return apiService.put<{ message: string }>(API_ENDPOINTS.PRODUCTS.STOCK.UPDATE(productId), data);
  }

  /**
   * Bulk update stock for multiple products
   */
  async bulkUpdateStock(data: BulkStockUpdate): Promise<{ message: string; updatedCount: number }> {
    return apiService.put<{ message: string; updatedCount: number }>(
      API_ENDPOINTS.PRODUCTS.STOCK.BULK_UPDATE, 
      data
    );
  }

  /**
   * Get stock history for a product
   */
  async getStockHistory(productId: number): Promise<StockHistory[]> {
    return apiService.get<StockHistory[]>(API_ENDPOINTS.PRODUCTS.STOCK.HISTORY(productId));
  }

  /**
   * Adjust stock (specific adjustment endpoint)
   */
  async adjustStock(productId: number, data: StockAdjustment): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(API_ENDPOINTS.PRODUCTS.STOCK.ADJUST, data);
  }

  /**
   * Set stock levels for a product
   */
  async setStockLevels(productId: number, data: StockLevelsUpdate): Promise<{ message: string }> {
    return apiService.put<{ message: string }>(
      API_ENDPOINTS.PRODUCTS.STOCK.SET_STOCK_LEVELS(productId), 
      data
    );
  }
}

export const stockService = StockService.getInstance();
