import { apiService } from './api';
import { API_ENDPOINTS } from '@/constants';
import type { 
  ProductCategory,
  CategoryStatistics,
  BulkUpdateCategory
} from '@/types';

/**
 * Category Service - Handle all category-related API calls
 * Following service layer pattern from guidelines
 */
export class CategoryService {
  private static instance: CategoryService;

  private constructor() {}

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  /**
   * Get all categories with basic info
   */
  async getAllCategories(): Promise<ProductCategory[]> {
    return apiService.get<ProductCategory[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES.LIST);
  }

  /**
   * Get category names only (for dropdowns)
   */
  async getCategoryList(): Promise<string[]> {
    return apiService.get<string[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES.LIST_NAMES);
  }

  /**
   * Get statistics for all categories
   */
  async getAllCategoryStatistics(): Promise<CategoryStatistics[]> {
    return apiService.get<CategoryStatistics[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES.STATISTICS);
  }

  /**
   * Get statistics for a specific category
   */
  async getCategoryStatistics(category: string): Promise<CategoryStatistics> {
    return apiService.get<CategoryStatistics>(API_ENDPOINTS.PRODUCTS.CATEGORIES.CATEGORY_STATS(category));
  }

  /**
   * Bulk update product categories
   */
  async bulkUpdateCategories(data: BulkUpdateCategory): Promise<{ message: string; updatedCount: number }> {
    return apiService.put<{ message: string; updatedCount: number }>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES.BULK_UPDATE, 
      data
    );
  }
}

export const categoryService = CategoryService.getInstance();
