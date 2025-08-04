import { apiService } from './api'
import type { 
  ProductPricingDto, 
  UpdateProductPricingDto, 
  BulkUpdatePricingDto, 
  PriceHistoryDto, 
  PricingAnalysisDto,
  BulkOperationResultDto 
} from '@/types/pricing'

export const pricingService = {
  // Lấy thông tin giá của tất cả sản phẩm
  getAllPricingInfo: async (): Promise<ProductPricingDto[]> => {
    return await apiService.get<ProductPricingDto[]>('/ProductPricing')
  },

  // Lấy thông tin giá của một sản phẩm
  getPricingInfo: async (productId: number): Promise<ProductPricingDto> => {
    return await apiService.get<ProductPricingDto>(`/ProductPricing/${productId}`)
  },

  // Cập nhật giá sản phẩm
  updatePricing: async (data: UpdateProductPricingDto): Promise<void> => {
    await apiService.put<void>('/ProductPricing', data)
  },

  // Cập nhật giá hàng loạt
  updatePricingBulk: async (data: BulkUpdatePricingDto): Promise<BulkOperationResultDto> => {
    return await apiService.put<BulkOperationResultDto>('/ProductPricing/bulk-update', data)
  },

  // Lấy lịch sử thay đổi giá
  getPriceHistory: async (
    productId: number, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<PriceHistoryDto[]> => {
    const params = { page: page.toString(), pageSize: pageSize.toString() }
    return await apiService.get<PriceHistoryDto[]>(`/ProductPricing/${productId}/history`, params)
  },

  // Lấy phân tích giá sản phẩm
  getPricingAnalysis: async (): Promise<PricingAnalysisDto> => {
    return await apiService.get<PricingAnalysisDto>('/ProductPricing/analysis')
  }
}
