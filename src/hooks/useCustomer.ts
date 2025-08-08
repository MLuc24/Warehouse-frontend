import { useState, useCallback } from 'react';
import { customerService } from '@/services/customer';
import type { 
  Customer, 
  CreateCustomer, 
  UpdateCustomer, 
  CustomerSearch, 
  CustomerListResponse,
  CustomerStats 
} from '@/types';

interface UseCustomerReturn {
  // Data state
  customers: Customer[];
  customer: Customer | null;
  stats: CustomerStats | null;
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
  fetchCustomers: (searchParams?: CustomerSearch) => Promise<void>;
  fetchCustomerById: (id: number) => Promise<void>;
  fetchCustomerStats: (id: number) => Promise<void>;
  createCustomer: (data: CreateCustomer) => Promise<Customer | null>;
  updateCustomer: (id: number, data: UpdateCustomer) => Promise<Customer | null>;
  deleteCustomer: (id: number) => Promise<boolean>;
  reactivateCustomer: (id: number) => Promise<boolean>;
  canDeleteCustomer: (id: number) => Promise<boolean>;
  getTopCustomers: (count?: number) => Promise<Customer[]>;
  getActiveCustomers: () => Promise<Customer[]>;
  getCustomersByType: (customerType: string) => Promise<Customer[]>;
  clearError: () => void;
  clearCustomer: () => void;
  clearStats: () => void;
}

/**
 * Comprehensive hook for all customer operations
 * Following hook structure template from guidelines
 */
export const useCustomer = (): UseCustomerReturn => {
  // Data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState<CustomerStats | null>(null);
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
    let errorMessage = defaultMessage;
    
    if (err instanceof Error) {
      errorMessage = err.message;
      
      // Handle specific HTTP errors
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này. Vui lòng liên hệ quản trị viên.';
      } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        errorMessage = 'Không tìm thấy khách hàng. Khách hàng có thể đã bị xóa hoặc không tồn tại.';
      } else if (err.message.includes('409') || err.message.includes('Conflict')) {
        errorMessage = 'Khách hàng đã tồn tại hoặc có xung đột dữ liệu.';
      } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
        errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      }
    }
    
    console.error('Customer operation error:', err);
    setError(errorMessage);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear customer data
  const clearCustomer = useCallback(() => {
    setCustomer(null);
  }, []);

  // Clear stats data
  const clearStats = useCallback(() => {
    setStats(null);
  }, []);

  // Fetch customers with search and pagination
  const fetchCustomers = useCallback(async (searchParams?: CustomerSearch) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: CustomerListResponse = await customerService.getCustomers(searchParams);
      
      setCustomers(response.items);
      setTotalCount(response.totalCount);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      handleError(err, 'Không thể tải danh sách khách hàng');
      setCustomers([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fetch single customer by ID
  const fetchCustomerById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const customerData = await customerService.getCustomer(id);
      setCustomer(customerData);
    } catch (err) {
      handleError(err, 'Không thể tải thông tin khách hàng');
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fetch customer statistics
  const fetchCustomerStats = useCallback(async (id: number) => {
    setLoadingStats(true);
    setError(null);
    
    try {
      const statsData = await customerService.getCustomerStats(id);
      setStats(statsData);
    } catch (err) {
      handleError(err, 'Không thể tải thống kê khách hàng');
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  }, [handleError]);

  // Create new customer
  const createCustomer = useCallback(async (data: CreateCustomer): Promise<Customer | null> => {
    setCreating(true);
    setError(null);
    
    try {
      const newCustomer = await customerService.createCustomer(data);
      
      // Add to current list if we have customers loaded
      setCustomers(prev => [newCustomer, ...prev]);
      
      return newCustomer;
    } catch (err) {
      handleError(err, 'Không thể tạo khách hàng mới');
      return null;
    } finally {
      setCreating(false);
    }
  }, [handleError]);

  // Update customer
  const updateCustomer = useCallback(async (id: number, data: UpdateCustomer): Promise<Customer | null> => {
    setUpdating(true);
    setError(null);
    
    try {
      const updatedCustomer = await customerService.updateCustomer(id, data);
      
      // Update in current list
      setCustomers(prev => 
        prev.map(c => c.customerId === id ? updatedCustomer : c)
      );
      
      // Update single customer if it's the one being viewed
      if (customer?.customerId === id) {
        setCustomer(updatedCustomer);
      }
      
      return updatedCustomer;
    } catch (err) {
      handleError(err, 'Không thể cập nhật thông tin khách hàng');
      return null;
    } finally {
      setUpdating(false);
    }
  }, [handleError, customer]);

  // Delete customer (soft delete)
  const deleteCustomer = useCallback(async (id: number): Promise<boolean> => {
    setDeleting(true);
    setError(null);
    
    try {
      await customerService.deleteCustomer(id);
      
      // Update customer status in list instead of removing
      setCustomers(prev => 
        prev.map(c => 
          c.customerId === id 
            ? { ...c, status: 'Inactive' }
            : c
        )
      );
      
      // Clear single customer if it was deleted
      if (customer?.customerId === id) {
        setCustomer(null);
      }
      
      return true;
    } catch (err) {
      handleError(err, 'Không thể xóa khách hàng');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [handleError, customer]);

  // Reactivate customer
  const reactivateCustomer = useCallback(async (id: number): Promise<boolean> => {
    setUpdating(true);
    setError(null);
    
    try {
      await customerService.reactivateCustomer(id);
      
      // Update customer status in list
      setCustomers(prev => 
        prev.map(c => 
          c.customerId === id 
            ? { ...c, status: 'Active' }
            : c
        )
      );
      
      // Update single customer if it's the one being viewed
      if (customer?.customerId === id) {
        setCustomer(prev => prev ? { ...prev, status: 'Active' } : null);
      }
      
      return true;
    } catch (err) {
      handleError(err, 'Không thể kích hoạt lại khách hàng');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [handleError, customer]);

  // Check if customer can be deleted
  const canDeleteCustomer = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await customerService.canDeleteCustomer(id);
      return response.canDelete;
    } catch (err) {
      handleError(err, 'Không thể kiểm tra khả năng xóa khách hàng');
      return false;
    }
  }, [handleError]);

  // Get top customers
  const getTopCustomers = useCallback(async (count: number = 5): Promise<Customer[]> => {
    try {
      return await customerService.getTopCustomers(count);
    } catch (err) {
      handleError(err, 'Không thể tải danh sách khách hàng hàng đầu');
      return [];
    }
  }, [handleError]);

  // Get active customers (for dropdowns)
  const getActiveCustomers = useCallback(async (): Promise<Customer[]> => {
    try {
      return await customerService.getActiveCustomers();
    } catch (err) {
      handleError(err, 'Không thể tải danh sách khách hàng hoạt động');
      return [];
    }
  }, [handleError]);

  // Get customers by type
  const getCustomersByType = useCallback(async (customerType: string): Promise<Customer[]> => {
    try {
      return await customerService.getCustomersByType(customerType);
    } catch (err) {
      handleError(err, `Không thể tải danh sách khách hàng loại ${customerType}`);
      return [];
    }
  }, [handleError]);

  return {
    // Data state
    customers,
    customer,
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
    fetchCustomers,
    fetchCustomerById,
    fetchCustomerStats,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    reactivateCustomer,
    canDeleteCustomer,
    getTopCustomers,
    getActiveCustomers,
    getCustomersByType,
    clearError,
    clearCustomer,
    clearStats,
  };
};
