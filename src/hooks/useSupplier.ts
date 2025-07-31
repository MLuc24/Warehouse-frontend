import { useState, useCallback } from 'react';
import { supplierService } from '@/services';
import type { 
  Supplier, 
  CreateSupplier, 
  UpdateSupplier, 
  SupplierSearch, 
  SupplierListResponse,
  SupplierStats 
} from '@/types';

interface UseSupplierReturn {
  // Data state
  suppliers: Supplier[];
  supplier: Supplier | null;
  stats: SupplierStats | null;
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
  fetchSuppliers: (searchParams?: SupplierSearch) => Promise<void>;
  fetchSupplierById: (id: number) => Promise<void>;
  fetchSupplierStats: (id: number) => Promise<void>;
  createSupplier: (data: CreateSupplier) => Promise<Supplier | null>;
  updateSupplier: (id: number, data: UpdateSupplier) => Promise<Supplier | null>;
  deleteSupplier: (id: number) => Promise<boolean>;
  reactivateSupplier: (id: number) => Promise<boolean>;
  canDeleteSupplier: (id: number) => Promise<boolean>;
  getTopSuppliers: (count?: number) => Promise<Supplier[]>;
  clearError: () => void;
  clearSupplier: () => void;
  clearStats: () => void;
}

/**
 * Comprehensive hook for all supplier operations
 * Following hook structure template from guidelines
 */
export const useSupplier = (): UseSupplierReturn => {
  // Data state
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [stats, setStats] = useState<SupplierStats | null>(null);
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
    console.error('Supplier operation error:', err);
  }, []);

  // Fetch suppliers with search/pagination
  const fetchSuppliers = useCallback(async (searchParams?: SupplierSearch) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: SupplierListResponse = await supplierService.getSuppliers(searchParams);
      setSuppliers(response.items);
      setTotalCount(response.totalCount);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải danh sách nhà cung cấp');
      setSuppliers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fetch single supplier by ID
  const fetchSupplierById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const supplierData = await supplierService.getSupplierById(id);
      setSupplier(supplierData);
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải thông tin nhà cung cấp');
      setSupplier(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fetch supplier statistics
  const fetchSupplierStats = useCallback(async (id: number) => {
    setLoadingStats(true);
    setError(null);
    
    try {
      const statsData = await supplierService.getSupplierStats(id);
      setStats(statsData);
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải thống kê nhà cung cấp');
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  }, [handleError]);

  // Create new supplier
  const createSupplier = useCallback(async (data: CreateSupplier): Promise<Supplier | null> => {
    setCreating(true);
    setError(null);
    
    try {
      const newSupplier = await supplierService.createSupplier(data);
      
      // Update suppliers list if we have it loaded
      if (suppliers.length > 0) {
        setSuppliers(prev => [newSupplier, ...prev]);
        setTotalCount(prev => prev + 1);
      }
      
      return newSupplier;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tạo nhà cung cấp');
      return null;
    } finally {
      setCreating(false);
    }
  }, [suppliers.length, handleError]);

  // Update existing supplier
  const updateSupplier = useCallback(async (id: number, data: UpdateSupplier): Promise<Supplier | null> => {
    setUpdating(true);
    setError(null);
    
    try {
      const updatedSupplier = await supplierService.updateSupplier(id, data);
      
      // Update suppliers list if we have it loaded
      if (suppliers.length > 0) {
        setSuppliers(prev => 
          prev.map(s => s.supplierId === id ? updatedSupplier : s)
        );
      }
      
      // Update single supplier if it's the one being edited
      if (supplier && supplier.supplierId === id) {
        setSupplier(updatedSupplier);
      }
      
      return updatedSupplier;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi cập nhật nhà cung cấp');
      return null;
    } finally {
      setUpdating(false);
    }
  }, [suppliers.length, supplier, handleError]);

  // Delete supplier
  const deleteSupplier = useCallback(async (id: number): Promise<boolean> => {
    setDeleting(true);
    setError(null);
    
    try {
      await supplierService.deleteSupplier(id);
      
      // Update suppliers list if we have it loaded
      if (suppliers.length > 0) {
        setSuppliers(prev => prev.filter(s => s.supplierId !== id));
        setTotalCount(prev => prev - 1);
      }
      
      // Clear single supplier if it's the one being deleted
      if (supplier && supplier.supplierId === id) {
        setSupplier(null);
      }
      
      return true;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi chuyển nhà cung cấp sang trạng thái hết hạn');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [suppliers.length, supplier, handleError]);

  // Check if supplier can be deleted
  const canDeleteSupplier = useCallback(async (id: number): Promise<boolean> => {
    try {
      const result = await supplierService.canDeleteSupplier(id);
      return result.canDelete;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi kiểm tra nhà cung cấp');
      return false;
    }
  }, [handleError]);

  // Reactivate supplier
  const reactivateSupplier = useCallback(async (id: number): Promise<boolean> => {
    console.log('Reactivating supplier with ID:', id); // Debug log
    setUpdating(true);
    setError(null);
    
    try {
      const result = await supplierService.reactivateSupplier(id);
      console.log('Reactivate result:', result); // Debug log
      
      // Update suppliers list if we have it loaded
      if (suppliers.length > 0) {
        setSuppliers(prev => prev.map(s => 
          s.supplierId === id ? { ...s, status: 'Active' } : s
        ));
      }
      
      // Update single supplier if it's the one being reactivated
      if (supplier && supplier.supplierId === id) {
        setSupplier(prev => prev ? { ...prev, status: 'Active' } : null);
      }
      
      return true;
    } catch (err) {
      console.error('Error in reactivateSupplier hook:', err); // Debug log
      handleError(err, 'Đã xảy ra lỗi khi gia hạn nhà cung cấp');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [suppliers.length, supplier, handleError]);

  // Get top suppliers
  const getTopSuppliers = useCallback(async (count = 5): Promise<Supplier[]> => {
    try {
      const topSuppliers = await supplierService.getTopSuppliers(count);
      return topSuppliers;
    } catch (err) {
      handleError(err, 'Đã xảy ra lỗi khi tải nhà cung cấp hàng đầu');
      return [];
    }
  }, [handleError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear single supplier
  const clearSupplier = useCallback(() => {
    setSupplier(null);
  }, []);

  // Clear stats
  const clearStats = useCallback(() => {
    setStats(null);
  }, []);

  return {
    // Data state
    suppliers,
    supplier,
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
    fetchSuppliers,
    fetchSupplierById,
    fetchSupplierStats,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    reactivateSupplier,
    canDeleteSupplier,
    getTopSuppliers,
    clearError,
    clearSupplier,
    clearStats,
  };
};
