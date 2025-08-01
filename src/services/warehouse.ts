import { ApiService } from './api';
import type { 
  WarehouseFormData, 
  WarehouseResponse, 
  WarehouseListResponse 
} from '@/types';

class WarehouseService {
  private static instance: WarehouseService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): WarehouseService {
    if (!WarehouseService.instance) {
      WarehouseService.instance = new WarehouseService();
    }
    return WarehouseService.instance;
  }

  /**
   * Lấy danh sách tất cả kho hàng
   */
  async getAllWarehouses(): Promise<WarehouseListResponse> {
    return this.apiService.get<WarehouseListResponse>('/warehouse');
  }

  /**
   * Lấy thông tin kho hàng theo ID
   */
  async getWarehouseById(id: number): Promise<WarehouseResponse> {
    return this.apiService.get<WarehouseResponse>(`/warehouse/${id}`);
  }

  /**
   * Tạo kho hàng mới
   */
  async createWarehouse(warehouseData: WarehouseFormData): Promise<WarehouseResponse> {
    const payload = { ...warehouseData, warehouseId: null };
    return this.apiService.post<WarehouseResponse>('/warehouse', payload);
  }

  /**
   * Cập nhật thông tin kho hàng
   */
  async updateWarehouse(id: number, warehouseData: WarehouseFormData): Promise<WarehouseResponse> {
    const payload = { ...warehouseData, warehouseId: id };
    return this.apiService.put<WarehouseResponse>(`/warehouse/${id}`, payload);
  }

  /**
   * Xóa kho hàng
   */
  async deleteWarehouse(id: number): Promise<WarehouseResponse> {
    return this.apiService.delete<WarehouseResponse>(`/warehouse/${id}`);
  }

  /**
   * Kiểm tra kho hàng có tồn tại không
   */
  async checkWarehouseExists(id: number): Promise<{ success: boolean; data: boolean }> {
    return this.apiService.get<{ success: boolean; data: boolean }>(`/warehouse/${id}/exists`);
  }
}

export const warehouseService = WarehouseService.getInstance();
export default warehouseService;
