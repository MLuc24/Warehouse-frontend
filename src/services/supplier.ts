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

export class SupplierService {
  private static instance: SupplierService;

  private constructor() {}

  public static getInstance(): SupplierService {
    if (!SupplierService.instance) {
      SupplierService.instance = new SupplierService();
    }
    return SupplierService.instance;
  }

  async getSuppliers(searchParams?: SupplierSearch): Promise<SupplierListResponse> {
    return apiService.get<SupplierListResponse>(API_ENDPOINTS.SUPPLIERS.LIST, searchParams as Record<string, unknown>);
  }

  async getSupplierById(id: number): Promise<Supplier> {
    return apiService.get<Supplier>(API_ENDPOINTS.SUPPLIERS.GET_BY_ID(id));
  }

  async createSupplier(data: CreateSupplier): Promise<Supplier> {
    return apiService.post<Supplier>(API_ENDPOINTS.SUPPLIERS.CREATE, data);
  }

  async updateSupplier(id: number, data: UpdateSupplier): Promise<Supplier> {
    return apiService.put<Supplier>(API_ENDPOINTS.SUPPLIERS.UPDATE(id), data);
  }

  async deleteSupplier(id: number): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(API_ENDPOINTS.SUPPLIERS.DELETE(id));
  }

  async getSupplierStats(id: number): Promise<SupplierStats> {
    return apiService.get<SupplierStats>(API_ENDPOINTS.SUPPLIERS.STATS(id));
  }

  async getTopSuppliers(count = 5): Promise<Supplier[]> {
    return apiService.get<Supplier[]>(API_ENDPOINTS.SUPPLIERS.TOP_SUPPLIERS, { count });
  }

  async canDeleteSupplier(id: number): Promise<{ canDelete: boolean; message: string }> {
    return apiService.get<{ canDelete: boolean; message: string }>(API_ENDPOINTS.SUPPLIERS.CAN_DELETE(id));
  }
}

export const supplierService = SupplierService.getInstance();
