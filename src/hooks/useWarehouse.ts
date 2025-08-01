import { useState, useEffect, useCallback } from 'react';
import { warehouseService } from '@/services';
import type { Warehouse, WarehouseFormData } from '@/types';

interface UseWarehousesReturn {
  warehouses: Warehouse[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useWarehouses = (): UseWarehousesReturn => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await warehouseService.getAllWarehouses();
      if (response.success && response.data) {
        setWarehouses(response.data);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải danh sách kho hàng');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách kho hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  return {
    warehouses,
    loading,
    error,
    refetch: fetchWarehouses
  };
};

interface UseWarehouseReturn {
  warehouse: Warehouse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useWarehouse = (id: number | null): UseWarehouseReturn => {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouse = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await warehouseService.getWarehouseById(id);
      if (response.success && response.data) {
        setWarehouse(response.data);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải thông tin kho hàng');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin kho hàng');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchWarehouse();
    }
  }, [id, fetchWarehouse]);

  return {
    warehouse,
    loading,
    error,
    refetch: fetchWarehouse
  };
};

interface UseWarehouseActionsReturn {
  createWarehouse: (data: WarehouseFormData) => Promise<{ success: boolean; message: string }>;
  updateWarehouse: (id: number, data: WarehouseFormData) => Promise<{ success: boolean; message: string }>;
  deleteWarehouse: (id: number) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
}

export const useWarehouseActions = (): UseWarehouseActionsReturn => {
  const [loading, setLoading] = useState(false);

  const createWarehouse = useCallback(async (data: WarehouseFormData) => {
    setLoading(true);
    try {
      const response = await warehouseService.createWarehouse(data);
      return {
        success: response.success,
        message: response.message
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo kho hàng'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWarehouse = useCallback(async (id: number, data: WarehouseFormData) => {
    setLoading(true);
    try {
      const response = await warehouseService.updateWarehouse(id, data);
      return {
        success: response.success,
        message: response.message
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật kho hàng'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteWarehouse = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await warehouseService.deleteWarehouse(id);
      return {
        success: response.success,
        message: response.message
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa kho hàng'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    loading
  };
};
