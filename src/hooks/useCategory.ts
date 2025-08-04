import { useState, useCallback } from 'react';
import { categoryService } from '@/services';
import type { 
  ProductCategory,
  CategoryStatistics,
  BulkUpdateCategory
} from '@/types';

interface UseCategoryReturn {
  // Data state
  categories: ProductCategory[];
  categoryNames: string[];
  categoryStats: CategoryStatistics[];
  selectedCategoryStats: CategoryStatistics | null;
  
  // Loading states
  loading: boolean;
  loadingNames: boolean;
  loadingStats: boolean;
  updating: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  fetchCategoryNames: () => Promise<void>;
  fetchAllCategoryStats: () => Promise<void>;
  fetchCategoryStats: (category: string) => Promise<void>;
  bulkUpdateCategories: (data: BulkUpdateCategory) => Promise<boolean>;
  clearError: () => void;
  clearStats: () => void;
}

/**
 * Hook for category management operations
 * Following hook structure template from guidelines
 */
export const useCategory = (): UseCategoryReturn => {
  // Data state
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStatistics[]>([]);
  const [selectedCategoryStats, setSelectedCategoryStats] = useState<CategoryStatistics | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingNames, setLoadingNames] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await categoryService.getAllCategories();
      setCategories(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch category names only
  const fetchCategoryNames = useCallback(async () => {
    setLoadingNames(true);
    setError(null);
    try {
      const result = await categoryService.getCategoryList();
      setCategoryNames(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách danh mục');
    } finally {
      setLoadingNames(false);
    }
  }, []);

  // Fetch all category statistics
  const fetchAllCategoryStats = useCallback(async () => {
    setLoadingStats(true);
    setError(null);
    try {
      const result = await categoryService.getAllCategoryStatistics();
      setCategoryStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thống kê danh mục');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch specific category statistics
  const fetchCategoryStats = useCallback(async (category: string) => {
    setLoadingStats(true);
    setError(null);
    try {
      const result = await categoryService.getCategoryStatistics(category);
      setSelectedCategoryStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thống kê danh mục');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Bulk update categories
  const bulkUpdateCategories = useCallback(async (data: BulkUpdateCategory): Promise<boolean> => {
    setUpdating(true);
    setError(null);
    try {
      await categoryService.bulkUpdateCategories(data);
      // Refresh categories after update
      await fetchCategories();
      await fetchAllCategoryStats();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật danh mục');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [fetchCategories, fetchAllCategoryStats]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear stats
  const clearStats = useCallback(() => {
    setCategoryStats([]);
    setSelectedCategoryStats(null);
  }, []);

  return {
    // Data state
    categories,
    categoryNames,
    categoryStats,
    selectedCategoryStats,
    
    // Loading states
    loading,
    loadingNames,
    loadingStats,
    updating,
    
    // Error state
    error,
    
    // Actions
    fetchCategories,
    fetchCategoryNames,
    fetchAllCategoryStats,
    fetchCategoryStats,
    bulkUpdateCategories,
    clearError,
    clearStats,
  };
};
