import { apiService } from './api';
import { API_ENDPOINTS } from '@/constants';
import type { 
  Customer, 
  CreateCustomer, 
  UpdateCustomer, 
  CustomerSearch, 
  CustomerListResponse,
  CustomerStats
} from '@/types';

// Backend response types for mapping
interface BackendCustomerListResponse {
  customers?: Customer[];
  Customers?: Customer[];
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
 * Customer Service - Handle all customer-related API calls
 * Following service layer pattern from guidelines
 */
export class CustomerService {
  /**
   * Get paginated list of customers with optional search
   */
  async getCustomers(searchParams?: CustomerSearch): Promise<CustomerListResponse> {
    const params = searchParams ? this.buildSearchParams(searchParams) : undefined;
    const response = await apiService.get<BackendCustomerListResponse>(API_ENDPOINTS.CUSTOMERS.LIST, params);
    
    // Map backend response to frontend type
    return {
      items: response.customers || response.Customers || [],
      totalCount: response.totalCount || response.TotalCount || 0,
      page: response.page || response.Page || 1,
      pageSize: response.pageSize || response.PageSize || 10,
      totalPages: response.totalPages || response.TotalPages || 0,
    };
  }

  /**
   * Get customer by ID
   */
  async getCustomer(id: number): Promise<Customer> {
    return await apiService.get<Customer>(`${API_ENDPOINTS.CUSTOMERS.LIST}/${id}`);
  }

  /**
   * Create new customer
   */
  async createCustomer(data: CreateCustomer): Promise<Customer> {
    return await apiService.post<Customer>(API_ENDPOINTS.CUSTOMERS.LIST, data);
  }

  /**
   * Update customer
   */
  async updateCustomer(id: number, data: UpdateCustomer): Promise<Customer> {
    return await apiService.put<Customer>(`${API_ENDPOINTS.CUSTOMERS.LIST}/${id}`, data);
  }

  /**
   * Delete customer (soft delete)
   */
  async deleteCustomer(id: number): Promise<void> {
    await apiService.delete(`${API_ENDPOINTS.CUSTOMERS.LIST}/${id}`);
  }

  /**
   * Reactivate customer
   */
  async reactivateCustomer(id: number): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.CUSTOMERS.LIST}/${id}/reactivate`);
  }

  /**
   * Get customer statistics
   */
  async getCustomerStats(id: number): Promise<CustomerStats> {
    return await apiService.get<CustomerStats>(`${API_ENDPOINTS.CUSTOMERS.LIST}/${id}/statistics`);
  }

  /**
   * Get top customers
   */
  async getTopCustomers(count: number = 5): Promise<Customer[]> {
    return await apiService.get<Customer[]>(`${API_ENDPOINTS.CUSTOMERS.LIST}/top?count=${count}`);
  }

  /**
   * Get active customers (for dropdowns)
   */
  async getActiveCustomers(): Promise<Customer[]> {
    return await apiService.get<Customer[]>(`${API_ENDPOINTS.CUSTOMERS.LIST}/active`);
  }

  /**
   * Get customers by type
   */
  async getCustomersByType(customerType: string): Promise<Customer[]> {
    return await apiService.get<Customer[]>(`${API_ENDPOINTS.CUSTOMERS.LIST}/by-type/${customerType}`);
  }

  /**
   * Check if customer can be deleted
   */
  async canDeleteCustomer(id: number): Promise<{ canDelete: boolean }> {
    return await apiService.get<{ canDelete: boolean }>(`${API_ENDPOINTS.CUSTOMERS.LIST}/${id}/can-delete`);
  }

  /**
   * Build search parameters for API request
   */
  private buildSearchParams(searchParams: CustomerSearch): Record<string, string> {
    const params: Record<string, string> = {};

    if (searchParams.keyword) {
      params.searchTerm = searchParams.keyword;
    }
    if (searchParams.email) {
      params.email = searchParams.email;
    }
    if (searchParams.phoneNumber) {
      params.phoneNumber = searchParams.phoneNumber;
    }
    if (searchParams.customerType) {
      params.customerType = searchParams.customerType;
    }
    if (searchParams.status) {
      params.status = searchParams.status;
    }
    if (searchParams.page) {
      params.page = searchParams.page.toString();
    }
    if (searchParams.pageSize) {
      params.pageSize = searchParams.pageSize.toString();
    }
    if (searchParams.sortBy) {
      params.sortBy = searchParams.sortBy;
    }
    if (searchParams.sortOrder) {
      params.sortDescending = searchParams.sortOrder === 'desc' ? 'true' : 'false';
    }

    return params;
  }
}

// Export singleton instance
export const customerService = new CustomerService();
