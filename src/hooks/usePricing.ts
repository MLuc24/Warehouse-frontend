import { useState, useCallback } from 'react'
import { pricingService } from '@/services/pricing'
import type { 
  ProductPricingDto, 
  UpdateProductPricingDto,
  BulkUpdatePricingDto,
  PriceHistoryDto,
  PricingAnalysisDto,
  BulkOperationResultDto
} from '@/types/pricing'

export interface UsePricingReturn {
  // State
  pricingData: ProductPricingDto[]
  priceHistory: PriceHistoryDto[]
  pricingAnalysis: PricingAnalysisDto | null
  loading: boolean
  error: string | null

  // Actions
  fetchAllPricing: () => Promise<void>
  fetchPricingAnalysis: () => Promise<void>
  updatePricing: (data: UpdateProductPricingDto) => Promise<void>
  updatePricingBulk: (data: BulkUpdatePricingDto) => Promise<BulkOperationResultDto>
  fetchPriceHistory: (productId: number, page?: number, pageSize?: number) => Promise<void>
  clearError: () => void
}

export const usePricing = (): UsePricingReturn => {
  const [pricingData, setPricingData] = useState<ProductPricingDto[]>([])
  const [priceHistory, setPriceHistory] = useState<PriceHistoryDto[]>([])
  const [pricingAnalysis, setPricingAnalysis] = useState<PricingAnalysisDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchAllPricing = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await pricingService.getAllPricingInfo()
      setPricingData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu giá')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPricingAnalysis = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await pricingService.getPricingAnalysis()
      setPricingAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải phân tích giá')
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePricing = useCallback(async (data: UpdateProductPricingDto) => {
    try {
      setLoading(true)
      setError(null)
      await pricingService.updatePricing(data)
      // Refresh pricing data after update
      await fetchAllPricing()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật giá')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchAllPricing])

  const updatePricingBulk = useCallback(async (data: BulkUpdatePricingDto): Promise<BulkOperationResultDto> => {
    try {
      setLoading(true)
      setError(null)
      const result = await pricingService.updatePricingBulk(data)
      // Refresh pricing data after bulk update
      await fetchAllPricing()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật giá hàng loạt')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchAllPricing])

  const fetchPriceHistory = useCallback(async (
    productId: number, 
    page: number = 1, 
    pageSize: number = 10
  ) => {
    try {
      setLoading(true)
      setError(null)
      const data = await pricingService.getPriceHistory(productId, page, pageSize)
      setPriceHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải lịch sử giá')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    // State
    pricingData,
    priceHistory,
    pricingAnalysis,
    loading,
    error,

    // Actions
    fetchAllPricing,
    fetchPricingAnalysis,
    updatePricing,
    updatePricingBulk,
    fetchPriceHistory,
    clearError
  }
}
