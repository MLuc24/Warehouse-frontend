import { useState, useEffect, useCallback } from 'react'
import type { 
  GoodsIssue, 
  CreateUpdateGoodsIssueDto,
  GoodsIssueFilterDto,
  Customer,
  Product,
  User
} from '@/types'
import { goodsIssueService } from '@/services/goodsIssue'
import { customerService } from '@/services/customer'
import { productService } from '@/services/product'
import { AuthService } from '@/services/auth'

type ViewMode = 'table' | 'create' | 'edit' | 'view'

interface UseGoodsIssueReturn {
  // Data state
  goodsIssues: GoodsIssue[]
  customers: Customer[]
  products: Product[]
  currentUser: User | null
  selectedGoodsIssue: GoodsIssue | null
  loading: boolean
  
  // Pagination state
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
  
  // Filter state
  filters: GoodsIssueFilterDto
  
  // View state
  viewMode: ViewMode
  
  // Actions
  setViewMode: (mode: ViewMode) => void
  setSelectedGoodsIssue: (issue: GoodsIssue | null) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  updateFilters: (newFilters: Partial<GoodsIssueFilterDto>) => void
  clearFilters: () => void
  
  // CRUD operations
  handleFormSubmit: (data: CreateUpdateGoodsIssueDto) => Promise<void>
  handleDeleteGoodsIssue: (id: number) => Promise<void>
  refreshData: () => Promise<void>
  
  // Workflow operations  
  handleApprove: (goodsIssueId: number, notes?: string) => Promise<void>
  handleReject: (goodsIssueId: number, notes?: string) => Promise<void>
  handlePrepare: (goodsIssueId: number) => Promise<void>
  handleConfirmDelivery: (goodsIssueId: number, deliveryAddress?: string, notes?: string) => Promise<void>
  handleComplete: (goodsIssueId: number, notes?: string) => Promise<void>
  handleCancel: (goodsIssueId: number) => Promise<void>
  handleResubmit: (goodsIssueId: number) => Promise<void>
  handleResendEmail: (goodsIssueId: number) => Promise<void>
  handleExportPDF: (goodsIssueId: number) => Promise<void>
  handleEdit: (issue: GoodsIssue) => Promise<void>
  handleView: (issue: GoodsIssue) => Promise<void>
  handleCreate: () => void
}

const DEFAULT_FILTERS: GoodsIssueFilterDto = {
  page: 1,
  pageSize: 10,
  issueNumber: '',
  customerId: undefined,
  status: undefined,
  issueDateFrom: '',
  issueDateTo: ''
}

export const useGoodsIssue = (): UseGoodsIssueReturn => {
  // Data state
  const [goodsIssues, setGoodsIssues] = useState<GoodsIssue[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedGoodsIssue, setSelectedGoodsIssue] = useState<GoodsIssue | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  
  // Filter state
  const [filters, setFilters] = useState<GoodsIssueFilterDto>(DEFAULT_FILTERS)
  
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  
  // Computed values
  const totalPages = Math.ceil(totalCount / pageSize)
  
  // Load goods issues with filters and pagination
  const loadGoodsIssues = useCallback(async () => {
    try {
      setLoading(true)
      const result = await goodsIssueService.getGoodsIssues({
        ...filters,
        page: currentPage,
        pageSize: pageSize
      })
      
      setGoodsIssues(result.items)
      setTotalCount(result.totalCount)
    } catch (error) {
      console.error('Error loading goods issues:', error)
      setGoodsIssues([])
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage, pageSize])
  
  // Load reference data
  const loadReferenceData = useCallback(async () => {
    try {
      const authService = AuthService.getInstance()
      const [customersResult, productsResult, userInfo] = await Promise.all([
        customerService.getCustomers(),
        productService.getProducts(),
        authService.getCurrentUser()
      ])
      
      setCustomers(customersResult.items || [])
      setProducts(productsResult.items || [])
      setCurrentUser(userInfo)
    } catch (error) {
      console.error('Error loading reference data:', error)
    }
  }, [])
  
  // Initial load
  useEffect(() => {
    loadReferenceData()
  }, [loadReferenceData])
  
  useEffect(() => {
    loadGoodsIssues()
  }, [loadGoodsIssues])
  
  // Filter and pagination handlers
  const updateFilters = useCallback((newFilters: Partial<GoodsIssueFilterDto>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }, [])
  
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setCurrentPage(1)
  }, [])
  
  // CRUD operations
  const handleFormSubmit = useCallback(async (data: CreateUpdateGoodsIssueDto) => {
    try {
      if (selectedGoodsIssue) {
        await goodsIssueService.updateGoodsIssue(selectedGoodsIssue.goodsIssueId, data)
      } else {
        await goodsIssueService.createGoodsIssue(data)
      }
      
      await loadGoodsIssues()
      setViewMode('table')
      setSelectedGoodsIssue(null)
    } catch (error) {
      console.error('Error submitting form:', error)
      throw error
    }
  }, [selectedGoodsIssue, loadGoodsIssues])
  
  const handleDeleteGoodsIssue = useCallback(async (id: number) => {
    try {
      const canDelete = await goodsIssueService.canDeleteGoodsIssue(id)
      if (!canDelete.canDelete) {
        throw new Error(canDelete.reason || 'Cannot delete this goods issue')
      }
      
      await goodsIssueService.deleteGoodsIssue(id)
      await loadGoodsIssues()
    } catch (error) {
      console.error('Error deleting goods issue:', error)
      throw error
    }
  }, [loadGoodsIssues])
  
  const refreshData = useCallback(async () => {
    await loadGoodsIssues()
  }, [loadGoodsIssues])
  
  const handleApprove = useCallback(async (goodsIssueId: number, notes?: string) => {
    try {
      await goodsIssueService.approveGoodsIssue(goodsIssueId, notes)
      
      // Update the specific issue in state immediately for real-time UI update
      setGoodsIssues(prev => 
        prev.map(issue => 
          issue.goodsIssueId === goodsIssueId 
            ? { ...issue, status: 'Approved' }
            : issue
        )
      )

      // Update selected issue if it matches
      setSelectedGoodsIssue(prev => 
        prev?.goodsIssueId === goodsIssueId 
          ? { ...prev, status: 'Approved' }
          : prev
      )

      // Refresh data in background to get full updated info
      await loadGoodsIssues()
    } catch (error) {
      console.error('Error approving goods issue:', error)
      throw error
    }
  }, [loadGoodsIssues])
  
  const handleReject = useCallback(async (goodsIssueId: number, notes?: string) => {
    try {
      await goodsIssueService.rejectGoodsIssue(goodsIssueId, notes)
      
      // Update the specific issue in state immediately for real-time UI update
      setGoodsIssues(prev => 
        prev.map(issue => 
          issue.goodsIssueId === goodsIssueId 
            ? { ...issue, status: 'Rejected' }
            : issue
        )
      )

      // Update selected issue if it matches
      setSelectedGoodsIssue(prev => 
        prev?.goodsIssueId === goodsIssueId 
          ? { ...prev, status: 'Rejected' }
          : prev
      )

      // Refresh data in background to get full updated info
      await loadGoodsIssues()
    } catch (error) {
      console.error('Error rejecting goods issue:', error)
      throw error
    }
  }, [loadGoodsIssues])
  
  const handlePrepare = useCallback(async (goodsIssueId: number) => {
    try {
      await goodsIssueService.prepareGoodsIssue(goodsIssueId)
      
      // Update the specific issue in state immediately for real-time UI update
      setGoodsIssues(prev => 
        prev.map(issue => 
          issue.goodsIssueId === goodsIssueId 
            ? { ...issue, status: 'InPreparation' }
            : issue
        )
      )

      // Update selected issue if it matches
      setSelectedGoodsIssue(prev => 
        prev?.goodsIssueId === goodsIssueId 
          ? { ...prev, status: 'InPreparation' }
          : prev
      )

      // Refresh data in background to get full updated info
      await loadGoodsIssues()
    } catch (error) {
      console.error('Error preparing goods issue:', error)
      throw error
    }
  }, [loadGoodsIssues])
  
  const handleConfirmDelivery = useCallback(async (goodsIssueId: number, deliveryAddress?: string, notes?: string) => {
    try {
      await goodsIssueService.confirmDelivery(goodsIssueId, deliveryAddress, notes)
      
      // Update the specific issue in state immediately for real-time UI update
      setGoodsIssues(prev => 
        prev.map(issue => 
          issue.goodsIssueId === goodsIssueId 
            ? { ...issue, status: 'Delivered', deliveryAddress, deliveryNotes: notes }
            : issue
        )
      )

      // Update selected issue if it matches
      setSelectedGoodsIssue(prev => 
        prev?.goodsIssueId === goodsIssueId 
          ? { ...prev, status: 'Delivered', deliveryAddress, deliveryNotes: notes }
          : prev
      )

      // Refresh data in background to get full updated info
      await loadGoodsIssues()
    } catch (error) {
      console.error('Error confirming delivery:', error)
      throw error
    }
  }, [loadGoodsIssues])
  
  const handleComplete = useCallback(async (goodsIssueId: number, notes?: string) => {
    try {
      await goodsIssueService.completeGoodsIssue(goodsIssueId, notes)
      
      // Update the specific issue in state immediately for real-time UI update
      setGoodsIssues(prev => 
        prev.map(issue => 
          issue.goodsIssueId === goodsIssueId 
            ? { ...issue, status: 'Completed' }
            : issue
        )
      )

      // Update selected issue if it matches
      setSelectedGoodsIssue(prev => 
        prev?.goodsIssueId === goodsIssueId 
          ? { ...prev, status: 'Completed' }
          : prev
      )

      // Refresh data in background to get full updated info
      await loadGoodsIssues()
    } catch (error) {
      console.error('Error completing goods issue:', error)
      throw error
    }
  }, [loadGoodsIssues])
  
  const handleCancel = useCallback(async (goodsIssueId: number) => {
    try {
      await goodsIssueService.cancelGoodsIssue(goodsIssueId)
      
      // Update the specific issue in state immediately for real-time UI update
      setGoodsIssues(prev => 
        prev.map(issue => 
          issue.goodsIssueId === goodsIssueId 
            ? { ...issue, status: 'Cancelled' }
            : issue
        )
      )

      // Update selected issue if it matches
      setSelectedGoodsIssue(prev => 
        prev?.goodsIssueId === goodsIssueId 
          ? { ...prev, status: 'Cancelled' }
          : prev
      )

      // Refresh data in background to get full updated info
      await loadGoodsIssues()
    } catch (error) {
      console.error('Error cancelling goods issue:', error)
      throw error
    }
  }, [loadGoodsIssues])
  
  const handleResubmit = useCallback(async (goodsIssueId: number) => {
    try {
      await goodsIssueService.resubmitGoodsIssue(goodsIssueId)
      
      // Update the specific issue in state immediately for real-time UI update
      setGoodsIssues(prev => 
        prev.map(issue => 
          issue.goodsIssueId === goodsIssueId 
            ? { ...issue, status: 'AwaitingApproval' }
            : issue
        )
      )

      // Update selected issue if it matches
      setSelectedGoodsIssue(prev => 
        prev?.goodsIssueId === goodsIssueId 
          ? { ...prev, status: 'AwaitingApproval' }
          : prev
      )

      // Refresh data in background to get full updated info
      await loadGoodsIssues()
    } catch (error) {
      console.error('Error resubmitting goods issue:', error)
      throw error
    }
  }, [loadGoodsIssues])
  
  const handleResendEmail = useCallback(async (goodsIssueId: number) => {
    try {
      await goodsIssueService.sendGoodsIssueEmail(goodsIssueId)
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }, [])
  
  const handleExportPDF = useCallback(async (goodsIssueId: number) => {
    try {
      // Find the issue to export
      const issue = goodsIssues.find(gi => gi.goodsIssueId === goodsIssueId) || selectedGoodsIssue;
      if (!issue) {
        throw new Error('Issue not found for PDF export');
      }
      
      // Import PDF service dynamically
      const pdfServiceModule = await import('@/services/pdfService');
      await pdfServiceModule.pdfService.downloadGoodsIssuePDF(issue);
    } catch (error) {
      console.error('Error exporting PDF:', error)
      throw error
    }
  }, [goodsIssues, selectedGoodsIssue])
  
  // View mode handlers
  const handleEdit = useCallback(async (issue: GoodsIssue) => {
    try {
      setLoading(true)
      const fullIssue = await goodsIssueService.getGoodsIssueById(issue.goodsIssueId)
      setSelectedGoodsIssue(fullIssue)
      setViewMode('edit')
    } catch (error) {
      console.error('Error loading goods issue details:', error)
      setSelectedGoodsIssue(issue)
      setViewMode('edit')
    } finally {
      setLoading(false)
    }
  }, [])
  
  const handleView = useCallback(async (issue: GoodsIssue) => {
    try {
      setLoading(true)
      const fullIssue = await goodsIssueService.getGoodsIssueById(issue.goodsIssueId)
      setSelectedGoodsIssue(fullIssue)
      setViewMode('view')
    } catch (error) {
      console.error('Error loading goods issue details:', error)
      setSelectedGoodsIssue(issue)
      setViewMode('view')
    } finally {
      setLoading(false)
    }
  }, [])
  
  const handleCreate = useCallback(() => {
    setSelectedGoodsIssue(null)
    setViewMode('create')
  }, [])
  
  return {
    // Data state
    goodsIssues,
    customers,
    products,
    currentUser,
    selectedGoodsIssue,
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
    setSelectedGoodsIssue,
    setCurrentPage,
    setPageSize,
    updateFilters,
    clearFilters,
    
    // CRUD operations
    handleFormSubmit,
    handleDeleteGoodsIssue,
    refreshData,
    
    // Workflow operations
    handleApprove,
    handleReject,
    handlePrepare,
    handleConfirmDelivery,
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
