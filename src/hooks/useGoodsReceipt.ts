import { useState, useEffect, useCallback } from 'react'
import type { 
  GoodsReceipt, 
  CreateGoodsReceiptDto, 
  UpdateGoodsReceiptDto,
  GoodsReceiptFilterDto,
  Supplier,
  Product,
  User
} from '@/types'
import { goodsReceiptService } from '@/services/goodsReceipt'
import { supplierService } from '@/services/supplier'
import { productService } from '@/services/product'
import { AuthService } from '@/services/auth'

type ViewMode = 'table' | 'create' | 'edit' | 'view'

interface UseGoodsReceiptReturn {
  // Data state
  goodsReceipts: GoodsReceipt[]
  suppliers: Supplier[]
  products: Product[]
  currentUser: User | null
  selectedGoodsReceipt: GoodsReceipt | null
  loading: boolean
  
  // Pagination state
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
  
  // Filter state
  filters: GoodsReceiptFilterDto
  
  // View state
  viewMode: ViewMode
  
  // Actions
  setViewMode: (mode: ViewMode) => void
  setSelectedGoodsReceipt: (receipt: GoodsReceipt | null) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  updateFilters: (newFilters: Partial<GoodsReceiptFilterDto>) => void
  clearFilters: () => void
  
  // CRUD operations
  handleFormSubmit: (data: CreateGoodsReceiptDto | UpdateGoodsReceiptDto) => Promise<void>
  handleDeleteGoodsReceipt: (id: number) => Promise<void>
  refreshData: () => Promise<void>
  
  // Workflow operations
  handleApprove: (goodsReceiptId: number) => Promise<void>
  handleReject: (goodsReceiptId: number) => Promise<void>
  handleComplete: (goodsReceiptId: number) => Promise<void>
  handleCancel: (goodsReceiptId: number) => Promise<void>
  handleResubmit: (goodsReceiptId: number) => Promise<void>
  handleResendEmail: (goodsReceiptId: number) => Promise<void>
  handleExportPDF: (goodsReceiptId: number) => Promise<void>
  handleEdit: (receipt: GoodsReceipt) => void
  handleView: (receipt: GoodsReceipt) => void
  handleCreate: () => void
}

const DEFAULT_FILTERS: GoodsReceiptFilterDto = {
  pageNumber: 1,
  pageSize: 10,
  receiptNumber: '',
  supplierName: '',
  status: undefined,
  fromDate: '',
  toDate: ''
}

export const useGoodsReceipt = (): UseGoodsReceiptReturn => {
  // Data state
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedGoodsReceipt, setSelectedGoodsReceipt] = useState<GoodsReceipt | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  
  // Filter state
  const [filters, setFilters] = useState<GoodsReceiptFilterDto>(DEFAULT_FILTERS)
  
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  
  // Computed values
  const totalPages = Math.ceil(totalCount / pageSize)
  
  // Load goods receipts with filters and pagination
  const loadGoodsReceipts = useCallback(async () => {
    try {
      setLoading(true)
      const filterWithPagination = {
        ...filters,
        pageNumber: currentPage,
        pageSize
      }
      
      const result = await goodsReceiptService.getGoodsReceipts(filterWithPagination)
      setGoodsReceipts(result.items)
      setTotalCount(result.totalCount)
    } catch (error) {
      console.error('Error loading goods receipts:', error)
      setGoodsReceipts([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage, pageSize])

  // Load supporting data
  const loadSupportingData = useCallback(async () => {
    try {
      const authService = AuthService.getInstance()
      const [suppliersData, productsData, currentUserData] = await Promise.all([
        supplierService.getSuppliers(),
        productService.getProducts(),
        authService.getCurrentUser()
      ])
      
      setSuppliers(suppliersData.items)
      setProducts(productsData.items)
      setCurrentUser(currentUserData)
    } catch (error) {
      console.error('Error loading supporting data:', error)
    }
  }, [])

  // Load all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadGoodsReceipts(),
      loadSupportingData()
    ])
  }, [loadGoodsReceipts, loadSupportingData])

  // Effects
  useEffect(() => {
    loadGoodsReceipts()
  }, [loadGoodsReceipts])

  useEffect(() => {
    loadSupportingData()
  }, [loadSupportingData])

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<GoodsReceiptFilterDto>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setCurrentPage(1)
  }, [])

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when page size changes
  }, [])

  // CRUD operations
  const handleFormSubmit = useCallback(async (data: CreateGoodsReceiptDto | UpdateGoodsReceiptDto) => {
    try {
      if ('goodsReceiptId' in data) {
        await goodsReceiptService.updateGoodsReceipt(data.goodsReceiptId!, data)
      } else {
        await goodsReceiptService.createGoodsReceipt(data)
      }
      await refreshData()
      setViewMode('table')
    } catch (error) {
      console.error('Error submitting goods receipt form:', error)
      throw error
    }
  }, [refreshData])

  const handleDeleteGoodsReceipt = useCallback(async (id: number) => {
    try {
      await goodsReceiptService.deleteGoodsReceipt(id)
      await refreshData()
    } catch (error) {
      console.error('Error deleting goods receipt:', error)
      throw error
    }
  }, [refreshData])
  
  // Workflow handlers with CORRECT status transitions
  const handleApprove = useCallback(async (goodsReceiptId: number) => {
    try {
      await goodsReceiptService.approveOrReject({
        goodsReceiptId,
        action: 'Approve'
      });
      
      // CORRECT: Admin approve AwaitingApproval → Pending (not SupplierConfirmed!)
      setGoodsReceipts(prev => 
        prev.map(receipt => 
          receipt.goodsReceiptId === goodsReceiptId 
            ? { ...receipt, status: 'Pending' }
            : receipt
        )
      );

      // Update selected receipt if it matches
      setSelectedGoodsReceipt(prev => 
        prev?.goodsReceiptId === goodsReceiptId 
          ? { ...prev, status: 'Pending' }
          : prev
      );

      // Refresh data in background to get full updated info
      await refreshData();
    } catch (error) {
      console.error('Error approving goods receipt:', error);
      throw error;
    }
  }, [refreshData]);
  
  const handleReject = useCallback(async (goodsReceiptId: number) => {
    try {
      await goodsReceiptService.approveOrReject({
        goodsReceiptId,
        action: 'Reject'
      });
      
      // Update the specific receipt in state immediately
      setGoodsReceipts(prev => 
        prev.map(receipt => 
          receipt.goodsReceiptId === goodsReceiptId 
            ? { ...receipt, status: 'Rejected' }
            : receipt
        )
      );

      // Update selected receipt if it matches
      setSelectedGoodsReceipt(prev => 
        prev?.goodsReceiptId === goodsReceiptId 
          ? { ...prev, status: 'Rejected' }
          : prev
      );

      // Refresh data in background
      await refreshData();
    } catch (error) {
      console.error('Error rejecting goods receipt:', error);
      throw error;
    }
  }, [refreshData]);
  
  const handleComplete = useCallback(async (goodsReceiptId: number) => {
    try {
      // Use the complete method properly
      await goodsReceiptService.completeReceipt(goodsReceiptId, {
        goodsReceiptId,
        notes: 'Hoàn thành nhập kho'
      });
      
      // Update the specific receipt in state immediately
      setGoodsReceipts(prev => 
        prev.map(receipt => 
          receipt.goodsReceiptId === goodsReceiptId 
            ? { ...receipt, status: 'Completed' }
            : receipt
        )
      );

      // Update selected receipt if it matches
      setSelectedGoodsReceipt(prev => 
        prev?.goodsReceiptId === goodsReceiptId 
          ? { ...prev, status: 'Completed' }
          : prev
      );

      // Refresh data in background
      await refreshData();
    } catch (error) {
      console.error('Error completing goods receipt:', error);
      throw error;
    }
  }, [refreshData]);

  const handleCancel = useCallback(async (goodsReceiptId: number) => {
    try {
      // For now use reject with special handling, or implement separate cancel endpoint
      await goodsReceiptService.approveOrReject({
        goodsReceiptId,
        action: 'Reject' // Backend should handle this as cancel for employees
      });
      
      // Update the specific receipt in state immediately
      setGoodsReceipts(prev => 
        prev.map(receipt => 
          receipt.goodsReceiptId === goodsReceiptId 
            ? { ...receipt, status: 'Cancelled' }
            : receipt
        )
      );

      // Update selected receipt if it matches
      setSelectedGoodsReceipt(prev => 
        prev?.goodsReceiptId === goodsReceiptId 
          ? { ...prev, status: 'Cancelled' }
          : prev
      );

      // Refresh data in background
      await refreshData();
    } catch (error) {
      console.error('Error cancelling goods receipt:', error);
      throw error;
    }
  }, [refreshData]);

  const handleResubmit = useCallback(async (goodsReceiptId: number) => {
    try {
      // This should call a resubmit API that changes Rejected → AwaitingApproval
      // For now, find the receipt and update it
      const receipt = goodsReceipts.find(gr => gr.goodsReceiptId === goodsReceiptId);
      if (receipt) {
        const updateData: UpdateGoodsReceiptDto = {
          goodsReceiptId,
          supplierId: receipt.supplierId,
          notes: receipt.notes,
          details: receipt.details || []
        };
        await goodsReceiptService.updateGoodsReceipt(goodsReceiptId, updateData);
      }
      
      // Update the specific receipt in state immediately
      setGoodsReceipts(prev => 
        prev.map(receipt => 
          receipt.goodsReceiptId === goodsReceiptId 
            ? { ...receipt, status: 'AwaitingApproval' }
            : receipt
        )
      );

      // Update selected receipt if it matches
      setSelectedGoodsReceipt(prev => 
        prev?.goodsReceiptId === goodsReceiptId 
          ? { ...prev, status: 'AwaitingApproval' }
          : prev
      );

      // Refresh data in background
      await refreshData();
    } catch (error) {
      console.error('Error resubmitting goods receipt:', error);
      throw error;
    }
  }, [goodsReceipts, refreshData]);

  const handleResendEmail = useCallback(async (goodsReceiptId: number) => {
    try {
      await goodsReceiptService.resendSupplierEmail(goodsReceiptId);
      // Email resend doesn't change status, so no need to update state
      // Just show a success message via toast or similar
    } catch (error) {
      console.error('Error resending supplier email:', error);
      throw error;
    }
  }, []);

  const handleExportPDF = useCallback(async (goodsReceiptId: number) => {
    try {
      // Find the receipt to export
      const receipt = goodsReceipts.find(gr => gr.goodsReceiptId === goodsReceiptId) || selectedGoodsReceipt;
      if (!receipt) {
        throw new Error('Receipt not found for PDF export');
      }
      
      // Import PDF service dynamically
      const { pdfService } = await import('@/services/pdfService');
      await pdfService.downloadPDF(receipt);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  }, [goodsReceipts, selectedGoodsReceipt]);

  // View handlers
  const handleEdit = useCallback((receipt: GoodsReceipt) => {
    setSelectedGoodsReceipt(receipt)
    setViewMode('edit')
  }, [])

  const handleView = useCallback((receipt: GoodsReceipt) => {
    setSelectedGoodsReceipt(receipt)
    setViewMode('view')
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedGoodsReceipt(null)
    setViewMode('create')
  }, [])

  return {
    // Data state
    goodsReceipts,
    suppliers,
    products,
    currentUser,
    selectedGoodsReceipt,
    loading,
    
    // Pagination state
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    
    // Filter state
    filters,
    
    // View state
    viewMode,
    
    // Actions
    setViewMode,
    setSelectedGoodsReceipt,
    setCurrentPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    updateFilters,
    clearFilters,
    
    // CRUD operations
    handleFormSubmit,
    handleDeleteGoodsReceipt,
    refreshData,
    
    // Workflow operations
    handleApprove,
    handleReject,
    handleComplete,
    handleCancel,
    handleResubmit,
    handleResendEmail,
    handleExportPDF,
    handleEdit,
    handleView,
    handleCreate
  }
}
