import React, { useState, useEffect, useCallback } from 'react'
import { Button, Input } from '@/components/ui'
import { Pagination, Notification, DeleteConfirmModal } from '@/components/common'
import { Layout } from '@/components/layout'
import { 
  GoodsReceiptTable,
  GoodsReceiptDetailView,
  UnifiedGoodsReceiptForm
} from '@/features/goodsReceipts'
import { useGoodsReceipts, useGoodsReceiptActions } from '@/hooks/useGoodsReceipt'
import { productService, supplierService, goodsReceiptService } from '@/services'
import { AuthService } from '@/services/auth'
import type { GoodsReceipt, GoodsReceiptFilterDto, CreateGoodsReceiptDto, UpdateGoodsReceiptDto, GoodsReceiptStatus, User } from '@/types'
import { DEFAULT_PAGE_SIZE, SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/goodsReceipt'
import { Plus, Filter, Search } from 'lucide-react'

interface Product {
  productId: number
  productName: string
  productSku: string
  unitPrice?: number
  purchasePrice?: number
  currentStock?: number
  unit?: string
  imageUrl?: string
  category?: string
}

interface Supplier {
  supplierId: number
  supplierName: string
}

type ViewMode = 'table' | 'detail' | 'create' | 'edit'

const GoodsReceiptsPage: React.FC = () => {
  // View Mode State
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedGoodsReceipt, setSelectedGoodsReceipt] = useState<GoodsReceipt | null>(null)
  
  // State for filters and pagination
  const [filters, setFilters] = useState<GoodsReceiptFilterDto>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // State for modals (only delete modal now)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // State for supporting data
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // State for notifications
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  // Hooks
  const {
    data: goodsReceiptsData,
    loading: loadingGoodsReceipts,
    error: goodsReceiptsError,
    refetch
  } = useGoodsReceipts(filters)

  const {
    createGoodsReceipt,
    updateGoodsReceipt,
    deleteGoodsReceipt,
    canDelete,
    creating,
    updating,
    deleting
  } = useGoodsReceiptActions()

  // Show notification helper
  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }, [])

  // Load supporting data
  useEffect(() => {
  const loadCurrentUser = async () => {
    try {
      const authService = AuthService.getInstance()
      const user = await authService.getCurrentUser()
      console.log('🔍 Current User Loaded:', user) // Debug logging
      setCurrentUser(user)
    } catch (error) {
      console.error('Error loading current user:', error)
    }
  }

  const loadSuppliers = async () => {
      try {
        const suppliersData = await supplierService.getSuppliers({})
        setSuppliers(suppliersData.items || [])
      } catch (error) {
        console.error('Error loading suppliers:', error)
        showNotification('Lỗi khi tải danh sách nhà cung cấp', 'error')
      }
    }

    const loadProducts = async () => {
      try {
        // Use getActiveProducts for better performance and only active products
        const productsData = await productService.getActiveProducts()
        setProducts(productsData.map((p) => ({
          productId: p.productId,
          productName: p.productName,
          productSku: p.sku || `SKU-${p.productId}`,
          unitPrice: p.sellingPrice || 0,
          purchasePrice: p.purchasePrice || 0,
          currentStock: p.currentStock || 0,
          unit: p.unit,
          imageUrl: p.imageUrl,
          category: p.categoryName
        })) || [])
      } catch (error) {
        console.error('Error loading products:', error)
        showNotification('Lỗi khi tải danh sách sản phẩm', 'error')
      }
    }

    loadCurrentUser()
    loadSuppliers()
    loadProducts()
  }, [showNotification])

  // Update filters when search or status changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        pageNumber: 1,
        searchTerm: searchTerm || undefined,
        status: statusFilter as GoodsReceiptStatus || undefined
      }))
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, statusFilter])

  // Handle errors
  useEffect(() => {
    if (goodsReceiptsError) {
      showNotification('Lỗi khi tải dữ liệu phiếu nhập', 'error')
    }
  }, [goodsReceiptsError, showNotification])

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }))
  }

  // Handler functions for view mode changes
  const handleCreate = () => {
    setSelectedGoodsReceipt(null)
    setViewMode('create')
  }

  const handleRowClick = (goodsReceipt: GoodsReceipt) => {
    setSelectedGoodsReceipt(goodsReceipt)
    setViewMode('detail')
  }

  const handleBackToTable = () => {
    setSelectedGoodsReceipt(null)
    setViewMode('table')
  }

  // Refresh function that updates both list and selected item
  const refreshData = useCallback(async () => {
    // Refresh the list
    refetch()
    
    // If there's a selected item, refresh its details too
    if (selectedGoodsReceipt?.goodsReceiptId) {
      try {
        const updatedGoodsReceipt = await goodsReceiptService.getGoodsReceiptById(selectedGoodsReceipt.goodsReceiptId)
        setSelectedGoodsReceipt(updatedGoodsReceipt)
      } catch (error) {
        console.error('Error refreshing selected goods receipt:', error)
      }
    }
  }, [refetch, selectedGoodsReceipt?.goodsReceiptId])

  // Handle edit
  const handleEdit = (goodsReceipt: GoodsReceipt) => {
    setSelectedGoodsReceipt(goodsReceipt)
    setViewMode('edit')
  }

  // Handle delete
  const handleDelete = async (goodsReceipt: GoodsReceipt) => {
    const canDeleteResult = await canDelete(goodsReceipt.goodsReceiptId!)
    if (!canDeleteResult) {
      showNotification('Không thể xóa phiếu nhập này', 'error')
      return
    }
    
    setSelectedGoodsReceipt(goodsReceipt)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedGoodsReceipt?.goodsReceiptId) return

    try {
      const result = await deleteGoodsReceipt(selectedGoodsReceipt.goodsReceiptId)
      if (result) {
        showNotification(SUCCESS_MESSAGES.DELETE_SUCCESS, 'success')
        setIsDeleteModalOpen(false)
        setSelectedGoodsReceipt(null)
        refreshData()
      } else {
        showNotification(ERROR_MESSAGES.DELETE_ERROR, 'error')
      }
    } catch (error) {
      console.error('Error deleting goods receipt:', error)
      showNotification(ERROR_MESSAGES.DELETE_ERROR, 'error')
    }
  }

  // Handle form submit
  const handleFormSubmit = async (data: CreateGoodsReceiptDto | UpdateGoodsReceiptDto) => {
    try {
      const isEdit = 'goodsReceiptId' in data
      if (isEdit && 'goodsReceiptId' in data) {
        const result = await updateGoodsReceipt(data.goodsReceiptId, data)
        if (result) {
          showNotification(SUCCESS_MESSAGES.UPDATE_SUCCESS, 'success')
          refreshData()
        } else {
          showNotification(ERROR_MESSAGES.UPDATE_ERROR, 'error')
        }
      } else {
        const result = await createGoodsReceipt(data as CreateGoodsReceiptDto)
        if (result) {
          showNotification(SUCCESS_MESSAGES.CREATE_SUCCESS, 'success')
          refreshData()
        } else {
          showNotification(ERROR_MESSAGES.CREATE_ERROR, 'error')
        }
      }
      
      // Back to table view
      setViewMode('table')
      setSelectedGoodsReceipt(null)
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMessage = 'goodsReceiptId' in data ? ERROR_MESSAGES.UPDATE_ERROR : ERROR_MESSAGES.CREATE_ERROR
      showNotification(errorMessage, 'error')
    }
  }

  // Workflow handlers
  const handleApprove = async (goodsReceiptId: number) => {
    try {
      await goodsReceiptService.approveOrReject({
        goodsReceiptId,
        action: 'Approve'
      })
      showNotification('Phiếu nhập đã được phê duyệt', 'success')
      refreshData()
    } catch (error) {
      console.error('Error approving goods receipt:', error)
      showNotification('Lỗi khi phê duyệt phiếu nhập', 'error')
    }
  }

  const handleReject = async (goodsReceiptId: number) => {
    try {
      await goodsReceiptService.approveOrReject({
        goodsReceiptId,
        action: 'Reject',
        notes: 'Từ chối phiếu nhập'
      })
      showNotification('Phiếu nhập đã bị từ chối', 'success')
      refreshData()
    } catch (error) {
      console.error('Error rejecting goods receipt:', error)
      showNotification('Lỗi khi từ chối phiếu nhập', 'error')
    }
  }

  const handleComplete = async (goodsReceiptId: number) => {
    try {
      await goodsReceiptService.completeReceipt(goodsReceiptId, {
        goodsReceiptId
      })
      showNotification('Phiếu nhập đã được hoàn thành', 'success')
      refreshData()
    } catch (error) {
      console.error('Error completing goods receipt:', error)
      showNotification('Lỗi khi hoàn thành phiếu nhập', 'error')
    }
  }

  const handleResendEmail = async (goodsReceiptId: number) => {
    try {
      await goodsReceiptService.resendSupplierEmail(goodsReceiptId)
      showNotification('Email đã được gửi lại cho nhà cung cấp', 'success')
      refreshData()
    } catch (error) {
      console.error('Error resending email:', error)
      showNotification('Lỗi khi gửi lại email', 'error')
    }
  }

  const handleCancel = async (goodsReceiptId: number) => {
    try {
      await goodsReceiptService.cancelReceipt(goodsReceiptId)
      showNotification('Phiếu nhập đã được hủy', 'success')
      refreshData()
    } catch (error) {
      console.error('Error cancelling goods receipt:', error)
      showNotification('Lỗi khi hủy phiếu nhập', 'error')
    }
  }

  const handleResubmit = async (goodsReceiptId: number) => {
    try {
      await goodsReceiptService.resubmitReceipt(goodsReceiptId)
      showNotification('Phiếu nhập đã được gửi lại để phê duyệt', 'success')
      refreshData()
    } catch (error) {
      console.error('Error resubmitting goods receipt:', error)
      showNotification('Lỗi khi gửi lại phiếu nhập', 'error')
    }
  }

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'Draft', label: 'Nháp' },
    { value: 'Pending', label: 'Chờ xử lý' },
    { value: 'Completed', label: 'Hoàn thành' },
    { value: 'Cancelled', label: 'Đã hủy' }
  ]

  // Extract data from API response
  const goodsReceipts = goodsReceiptsData?.items || []
  const totalCount = goodsReceiptsData?.totalCount || 0
  const totalPages = goodsReceiptsData?.totalPages || 1
  const currentPage = goodsReceiptsData?.pageNumber || 1

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Conditional Rendering Based on View Mode */}
        {viewMode === 'table' && (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý phiếu nhập kho</h1>
                    <p className="text-gray-600">Tạo và quản lý các phiếu nhập hàng hóa từ nhà cung cấp</p>
                  </div>
                  <Button onClick={handleCreate} className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo phiếu nhập
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tìm kiếm
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Tìm theo số phiếu, nhà cung cấp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button variant="secondary" className="flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      Lọc
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <GoodsReceiptTable
                  goodsReceipts={goodsReceipts}
                  loading={loadingGoodsReceipts}
                  onRowClick={handleRowClick}
                />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  pageSize={filters.pageSize || DEFAULT_PAGE_SIZE}
                  onPageChange={handlePageChange}
                  loading={loadingGoodsReceipts}
                />
              )}
            </div>
          </div>
        )}

        {/* Detail View */}
        {viewMode === 'detail' && selectedGoodsReceipt && (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <GoodsReceiptDetailView
                goodsReceipt={selectedGoodsReceipt}
                onEdit={() => handleEdit(selectedGoodsReceipt)}
                onDelete={() => handleDelete(selectedGoodsReceipt)}
                onBack={handleBackToTable}
                onRefresh={refreshData}
                currentUserRole={currentUser?.role || ''}
                currentUserId={currentUser?.userId}
                onApprove={handleApprove}
                onReject={handleReject}
                onComplete={handleComplete}
                onResendEmail={handleResendEmail}
                onCancel={handleCancel}
                onResubmit={handleResubmit}
              />
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {(viewMode === 'create' || viewMode === 'edit') && (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <UnifiedGoodsReceiptForm
                onSubmit={handleFormSubmit}
                onCancel={handleBackToTable}
                goodsReceipt={viewMode === 'edit' ? selectedGoodsReceipt : null}
                suppliers={suppliers}
                products={products}
                isEdit={viewMode === 'edit'}
                isSubmitting={creating || updating}
                variant="inline"
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Xác nhận xóa phiếu nhập"
          message={`Bạn có chắc chắn muốn xóa phiếu nhập ${selectedGoodsReceipt?.receiptNumber || ''}? Hành động này không thể hoàn tác.`}
          itemName={selectedGoodsReceipt ? `#${selectedGoodsReceipt.receiptNumber} - ${selectedGoodsReceipt.supplierName}` : ''}
          loading={deleting}
        />

        {/* Notification */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </Layout>
  )
}

export default GoodsReceiptsPage
