import { useState, useCallback } from 'react'
import { expiryService } from '@/services/expiry'
import type { 
  ProductExpiryDto, 
  UpdateProductExpiryDto,
  ExpiryReportDto,
  ExpirySearchDto,
  ExpiryAlertDto
} from '@/types/expiry'

export interface UseExpiryReturn {
  // State
  expiryData: ProductExpiryDto[]
  expiryReport: ExpiryReportDto | null
  expiryAlerts: ExpiryAlertDto[]
  expiredProducts: ProductExpiryDto[]
  expiringSoonProducts: ProductExpiryDto[]
  loading: boolean
  error: string | null

  // Actions
  fetchExpiryInfo: (searchParams?: ExpirySearchDto) => Promise<void>
  fetchExpiryReport: () => Promise<void>
  fetchExpiryAlerts: () => Promise<void>
  fetchExpiredProducts: () => Promise<void>
  fetchExpiringSoonProducts: (days?: number) => Promise<void>
  updateExpiryInfo: (data: UpdateProductExpiryDto) => Promise<void>
  clearError: () => void
}

export const useExpiry = (): UseExpiryReturn => {
  const [expiryData, setExpiryData] = useState<ProductExpiryDto[]>([])
  const [expiryReport, setExpiryReport] = useState<ExpiryReportDto | null>(null)
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlertDto[]>([])
  const [expiredProducts, setExpiredProducts] = useState<ProductExpiryDto[]>([])
  const [expiringSoonProducts, setExpiringSoonProducts] = useState<ProductExpiryDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchExpiryInfo = useCallback(async (searchParams?: ExpirySearchDto) => {
    try {
      setLoading(true)
      setError(null)
      const data = await expiryService.getExpiryInfo(searchParams)
      setExpiryData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu hạn sử dụng')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchExpiryReport = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await expiryService.getExpiryReport()
      setExpiryReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải báo cáo hạn sử dụng')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchExpiryAlerts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await expiryService.getExpiryAlerts()
      setExpiryAlerts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải cảnh báo hạn sử dụng')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchExpiredProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await expiryService.getExpiredProducts()
      setExpiredProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải sản phẩm đã hết hạn')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchExpiringSoonProducts = useCallback(async (days: number = 7) => {
    try {
      setLoading(true)
      setError(null)
      const data = await expiryService.getExpiringSoonProducts(days)
      setExpiringSoonProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải sản phẩm sắp hết hạn')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateExpiryInfo = useCallback(async (data: UpdateProductExpiryDto) => {
    try {
      setLoading(true)
      setError(null)
      await expiryService.updateExpiryInfo(data)
      // Refresh data after update
      await fetchExpiryInfo()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật thông tin hạn sử dụng')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchExpiryInfo])

  return {
    // State
    expiryData,
    expiryReport,
    expiryAlerts,
    expiredProducts,
    expiringSoonProducts,
    loading,
    error,

    // Actions
    fetchExpiryInfo,
    fetchExpiryReport,
    fetchExpiryAlerts,
    fetchExpiredProducts,
    fetchExpiringSoonProducts,
    updateExpiryInfo,
    clearError
  }
}
