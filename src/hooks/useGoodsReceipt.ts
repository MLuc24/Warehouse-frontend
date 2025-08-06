import { useState, useEffect, useCallback } from 'react'
import { goodsReceiptService } from '@/services'
import type { 
  GoodsReceipt, 
  CreateGoodsReceiptDto, 
  UpdateGoodsReceiptDto, 
  GoodsReceiptFilterDto, 
  PagedGoodsReceiptResult 
} from '@/types'

interface UseGoodsReceiptsReturn {
  data: PagedGoodsReceiptResult | null
  loading: boolean
  error: string | null
  refetch: () => void
  refresh: () => void
}

export const useGoodsReceipts = (filters?: GoodsReceiptFilterDto): UseGoodsReceiptsReturn => {
  const [data, setData] = useState<PagedGoodsReceiptResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await goodsReceiptService.getGoodsReceipts(filters)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    refresh: fetchData
  }
}

interface UseGoodsReceiptReturn {
  data: GoodsReceipt | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useGoodsReceipt = (id: number | null): UseGoodsReceiptReturn => {
  const [data, setData] = useState<GoodsReceipt | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!id) {
      setData(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await goodsReceiptService.getGoodsReceiptById(id)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải phiếu nhập')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

interface UseGoodsReceiptActionsReturn {
  creating: boolean
  updating: boolean
  deleting: boolean
  createGoodsReceipt: (data: CreateGoodsReceiptDto) => Promise<GoodsReceipt | null>
  updateGoodsReceipt: (id: number, data: UpdateGoodsReceiptDto) => Promise<GoodsReceipt | null>
  deleteGoodsReceipt: (id: number) => Promise<boolean>
  canDelete: (id: number) => Promise<boolean>
}

export const useGoodsReceiptActions = (): UseGoodsReceiptActionsReturn => {
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const createGoodsReceipt = useCallback(async (data: CreateGoodsReceiptDto): Promise<GoodsReceipt | null> => {
    setCreating(true)
    try {
      const result = await goodsReceiptService.createGoodsReceipt(data)
      return result
    } catch (err) {
      console.error('Error creating goods receipt:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [])

  const updateGoodsReceipt = useCallback(async (id: number, data: UpdateGoodsReceiptDto): Promise<GoodsReceipt | null> => {
    setUpdating(true)
    try {
      const result = await goodsReceiptService.updateGoodsReceipt(id, data)
      return result
    } catch (err) {
      console.error('Error updating goods receipt:', err)
      return null
    } finally {
      setUpdating(false)
    }
  }, [])

  const deleteGoodsReceipt = useCallback(async (id: number): Promise<boolean> => {
    setDeleting(true)
    try {
      await goodsReceiptService.deleteGoodsReceipt(id)
      return true
    } catch (err) {
      console.error('Error deleting goods receipt:', err)
      return false
    } finally {
      setDeleting(false)
    }
  }, [])

  const canDelete = useCallback(async (id: number): Promise<boolean> => {
    try {
      const result = await goodsReceiptService.canDeleteGoodsReceipt(id)
      return result.canDelete
    } catch (err) {
      console.error('Error checking can delete:', err)
      return false
    }
  }, [])

  return {
    creating,
    updating,
    deleting,
    createGoodsReceipt,
    updateGoodsReceipt,
    deleteGoodsReceipt,
    canDelete
  }
}
