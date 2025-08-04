import { useState, useCallback } from 'react';
import { stockService } from '@/services';
import type { 
  ProductStock,
  StockAdjustment,
  StockHistory,
  BulkStockUpdate,
  StockLevelsUpdate,
  ProductInventory
} from '@/types';

interface UseStockReturn {
  // Data state
  stocks: ProductStock[];
  lowStockProducts: ProductInventory[];
  stockHistory: StockHistory[];
  
  // Loading states
  loading: boolean;
  loadingLowStock: boolean;
  loadingHistory: boolean;
  updating: boolean;
  adjusting: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  fetchAllStock: () => Promise<void>;
  fetchLowStockProducts: () => Promise<void>;
  fetchStockHistory: (productId: number) => Promise<void>;
  updateStock: (productId: number, data: StockAdjustment) => Promise<boolean>;
  bulkUpdateStock: (data: BulkStockUpdate) => Promise<boolean>;
  adjustStock: (productId: number, data: StockAdjustment) => Promise<boolean>;
    setStockLevels: (productId: number, data: StockLevelsUpdate) => Promise<boolean>;
  clearError: () => void;
  clearHistory: () => void;
}

/**
 * Hook for stock management operations
 * Following hook structure template from guidelines
 */
export const useStock = (): UseStockReturn => {
  // Data state
  const [stocks, setStocks] = useState<ProductStock[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<ProductInventory[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingLowStock, setLoadingLowStock] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch all stock information
  const fetchAllStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await stockService.getAllStockInfo();
      setStocks(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin tồn kho');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch low stock products
  const fetchLowStockProducts = useCallback(async () => {
    setLoadingLowStock(true);
    setError(null);
    try {
      const result = await stockService.getLowStockProducts();
      setLowStockProducts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải sản phẩm sắp hết hàng');
    } finally {
      setLoadingLowStock(false);
    }
  }, []);

  // Fetch stock history for specific product
  const fetchStockHistory = useCallback(async (productId: number) => {
    setLoadingHistory(true);
    setError(null);
    try {
      const result = await stockService.getStockHistory(productId);
      setStockHistory(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải lịch sử tồn kho');
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Update stock for single product
  const updateStock = useCallback(async (productId: number, data: StockAdjustment): Promise<boolean> => {
    setUpdating(true);
    setError(null);
    try {
      await stockService.updateStock(productId, data);
      // Refresh stock data
      await fetchAllStock();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật tồn kho');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [fetchAllStock]);

  // Bulk update stock
  const bulkUpdateStock = useCallback(async (data: BulkStockUpdate): Promise<boolean> => {
    setUpdating(true);
    setError(null);
    try {
      await stockService.bulkUpdateStock(data);
      // Refresh stock data
      await fetchAllStock();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật tồn kho hàng loạt');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [fetchAllStock]);

  // Adjust stock with specific reason
  const adjustStock = useCallback(async (productId: number, data: StockAdjustment): Promise<boolean> => {
    setAdjusting(true);
    setError(null);
    try {
      await stockService.adjustStock(productId, data);
      // Refresh stock data and history
      await fetchAllStock();
      await fetchStockHistory(productId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi điều chỉnh tồn kho');
      return false;
    } finally {
      setAdjusting(false);
    }
  }, [fetchAllStock, fetchStockHistory]);

  // Set stock levels
  const setStockLevels = useCallback(async (productId: number, data: StockLevelsUpdate): Promise<boolean> => {
    setUpdating(true);
    setError(null);
    try {
      await stockService.setStockLevels(productId, data);
      // Refresh stock data
      await fetchAllStock();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi thiết lập mức tồn kho');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [fetchAllStock]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setStockHistory([]);
  }, []);

  return {
    // Data state
    stocks,
    lowStockProducts,
    stockHistory,
    
    // Loading states
    loading,
    loadingLowStock,
    loadingHistory,
    updating,
    adjusting,
    
    // Error state
    error,
    
    // Actions
    fetchAllStock,
    fetchLowStockProducts,
    fetchStockHistory,
    updateStock,
    bulkUpdateStock,
    adjustStock,
    setStockLevels,
    clearError,
    clearHistory,
  };
};
