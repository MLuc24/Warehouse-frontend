import { apiService } from './api';
import { API_ENDPOINTS } from '@/constants';
import type { 
  Supplier, 
  CreateSupplier, 
  UpdateSupplier, 
  SupplierSearch, 
  SupplierListResponse,
  SupplierStats
} from '@/types';

// Backend response types for mapping
interface BackendSupplierListResponse {
  suppliers?: Supplier[];
  Suppliers?: Supplier[];
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
 * Supplier Service - Handle all supplier-related API calls
 * Following service layer pattern from guidelines
 */
export class SupplierService {
  /**
   * Get paginated list of suppliers with optional search
   */
  async getSuppliers(searchParams?: SupplierSearch): Promise<SupplierListResponse> {
    const params = searchParams ? this.buildSearchParams(searchParams) : undefined;
    const response = await apiService.get<BackendSupplierListResponse>(API_ENDPOINTS.SUPPLIERS.LIST, params);
    
    // Map backend response to frontend type
    return {
      items: response.suppliers || response.Suppliers || [],
      totalCount: response.totalCount || response.TotalCount || 0,
      page: response.page || response.Page || 1,
      pageSize: response.pageSize || response.PageSize || 10,
      totalPages: response.totalPages || response.TotalPages || 0,
    };
  }

  /**
   * Get supplier by ID
   */
  async getSupplierById(id: number): Promise<Supplier> {
    return apiService.get<Supplier>(API_ENDPOINTS.SUPPLIERS.GET_BY_ID(id));
  }

  /**
   * Create new supplier
   */
  async createSupplier(data: CreateSupplier): Promise<Supplier> {
    return apiService.post<Supplier>(API_ENDPOINTS.SUPPLIERS.CREATE, data);
  }

  /**
   * Update existing supplier
   */
  async updateSupplier(id: number, data: UpdateSupplier): Promise<Supplier> {
    return apiService.put<Supplier>(API_ENDPOINTS.SUPPLIERS.UPDATE(id), data);
  }

  /**
   * Delete supplier
   */
  async deleteSupplier(id: number): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(API_ENDPOINTS.SUPPLIERS.DELETE(id));
  }

  /**
   * Get supplier statistics
   */
  async getSupplierStats(id: number): Promise<SupplierStats> {
    return apiService.get<SupplierStats>(API_ENDPOINTS.SUPPLIERS.STATS(id));
  }

  /**
   * Get top suppliers by purchase value
   */
  async getTopSuppliers(count = 5): Promise<Supplier[]> {
    return apiService.get<Supplier[]>(API_ENDPOINTS.SUPPLIERS.TOP_SUPPLIERS, { count });
  }

  /**
   * Check if supplier can be deleted
   */
  async canDeleteSupplier(id: number): Promise<{ canDelete: boolean; message: string }> {
    return apiService.get<{ canDelete: boolean; message: string }>(API_ENDPOINTS.SUPPLIERS.CAN_DELETE(id));
  }

  /**
   * Build search parameters for API call
   * Map frontend parameters to backend DTO format
   */
  private buildSearchParams(searchParams: SupplierSearch): Record<string, unknown> {
    const params: Record<string, unknown> = {};
    
    // Map 'keyword' to 'SearchTerm' for backend compatibility
    if (searchParams.keyword) params.SearchTerm = searchParams.keyword;
    if (searchParams.email) params.Email = searchParams.email;
    if (searchParams.phoneNumber) params.PhoneNumber = searchParams.phoneNumber;
    if (searchParams.taxCode) params.TaxCode = searchParams.taxCode;
    if (searchParams.page) params.Page = searchParams.page;
    if (searchParams.pageSize) params.PageSize = searchParams.pageSize;
    if (searchParams.sortBy) params.SortBy = searchParams.sortBy;
    if (searchParams.sortOrder) params.SortDescending = searchParams.sortOrder === 'desc';
    
    return params;
  }
}

// Export singleton instance
export const supplierService = new SupplierService();
