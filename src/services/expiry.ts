import { apiService } from './api'
import type { 
  ProductExpiryDto, 
  UpdateProductExpiryDto, 
  ExpiryReportDto,
  ExpirySearchDto,
  ExpiryAlertDto
} from '@/types/expiry'

export const expiryService = {
  // Lấy thông tin hạn sử dụng với tìm kiếm và lọc
  getExpiryInfo: async (searchParams?: ExpirySearchDto): Promise<ProductExpiryDto[]> => {
    const params = searchParams ? {
      status: searchParams.status,
      expiryFromDate: searchParams.expiryFromDate,
      expiryToDate: searchParams.expiryToDate,
      category: searchParams.category,
      storageType: searchParams.storageType,
      isPerishable: searchParams.isPerishable?.toString(),
      page: searchParams.page?.toString(),
      pageSize: searchParams.pageSize?.toString(),
      sortBy: searchParams.sortBy,
      sortDescending: searchParams.sortDescending?.toString()
    } : undefined
    
    return await apiService.get<ProductExpiryDto[]>('/ProductExpiry', params)
  },

  // Lấy báo cáo hạn sử dụng tổng quan
  getExpiryReport: async (): Promise<ExpiryReportDto> => {
    return await apiService.get<ExpiryReportDto>('/ProductExpiry/report')
  },

  // Lấy danh sách sản phẩm đã hết hạn
  getExpiredProducts: async (): Promise<ProductExpiryDto[]> => {
    return await apiService.get<ProductExpiryDto[]>('/ProductExpiry/expired')
  },

  // Lấy danh sách sản phẩm sắp hết hạn
  getExpiringSoonProducts: async (days: number = 7): Promise<ProductExpiryDto[]> => {
    return await apiService.get<ProductExpiryDto[]>('/ProductExpiry/expiring-soon', { 
      days: days.toString() 
    })
  },

  // Lấy cảnh báo hạn sử dụng
  getExpiryAlerts: async (): Promise<ExpiryAlertDto[]> => {
    return await apiService.get<ExpiryAlertDto[]>('/ProductExpiry/alerts')
  },

  // Cập nhật thông tin hạn sử dụng
  updateExpiryInfo: async (data: UpdateProductExpiryDto): Promise<void> => {
    await apiService.put<void>('/ProductExpiry', data)
  }
}
