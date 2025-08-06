import React, { useState, useEffect, useCallback } from 'react'
import { Button, Input } from '@/components/ui'
import { Pagination, DeleteConfirmModal, Notification } from '@/components/common'
import { Layout } from '@/components/layout'
import { GoodsReceiptTable, GoodsReceiptForm } from '@/features/goodsReceipts'
import { useGoodsReceipts, useGoodsReceiptActions } from '@/hooks/useGoodsReceipt'
import { productService, supplierService } from '@/services'
import type { GoodsReceipt, GoodsReceiptFilterDto, CreateGoodsReceiptDto, UpdateGoodsReceiptDto, GoodsReceiptStatus } from '@/types'
import { DEFAULT_PAGE_SIZE, SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/goodsReceipt'

interface Product {
  productId: number
  productName: string
  productSku: string
}

interface Supplier {
  supplierId: number
  supplierName: string
}

const GoodsReceiptsPage: React.FC = () => {
  // State for filters and pagination
  const [filters, setFilters] = useState<GoodsReceiptFilterDto>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedGoodsReceipt, setSelectedGoodsReceipt] = useState<GoodsReceipt | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  // State for supporting data
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loadingSuppliers, setLoadingSuppliers] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  
  // State for notifications
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  // Hooks
  const { data: goodsReceiptsData, loading: loadingGoodsReceipts, error, refetch } = useGoodsReceipts(filters)
  const { 
    deleting, 
    createGoodsReceipt, 
    updateGoodsReceipt, 
    deleteGoodsReceipt,
    canDelete 
  } = useGoodsReceiptActions()

  // Load supporting data
  const loadSuppliers = useCallback(async () => {
    setLoadingSuppliers(true)
    try {
      const result = await supplierService.getSuppliers({ pageSize: 1000 })
      setSuppliers(result.items.map(s => ({
        supplierId: s.supplierId,
        supplierName: s.supplierName
      })))
    } catch (error) {
      console.error('Error loading suppliers:', error)
      showNotification('Có lỗi khi tải danh sách nhà cung cấp', 'error')
    } finally {
      setLoadingSuppliers(false)
    }
  }, [])

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true)
    try {
      const result = await productService.getProducts({ pageSize: 1000 })
      setProducts(result.items.map(p => ({
        productId: p.productId,
        productName: p.productName,
        productSku: p.sku
      })))
    } catch (error) {
      console.error('Error loading products:', error)
      showNotification('Có lỗi khi tải danh sách sản phẩm', 'error')
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  useEffect(() => {
    loadSuppliers()
    loadProducts()
  }, [loadSuppliers, loadProducts])

  // Notification helper
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  // Handle search
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      receiptNumber: searchTerm,
      supplierName: searchTerm,
      pageNumber: 1
    }))
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setFilters(prev => ({
      ...prev,
      receiptNumber: undefined,
      supplierName: undefined,
      pageNumber: 1
    }))
  }

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    setFilters(prev => ({
      ...prev,
      status: (status as GoodsReceiptStatus) || undefined,
      pageNumber: 1
    }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }))
  }

  // Handle create
  const handleCreate = () => {
    setSelectedGoodsReceipt(null)
    setIsEditMode(false)
    setIsFormModalOpen(true)
  }

  // Handle edit
  const handleEdit = (goodsReceipt: GoodsReceipt) => {
    setSelectedGoodsReceipt(goodsReceipt)
    setIsEditMode(true)
    setIsFormModalOpen(true)
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

  const confirmDelete = async () => {
    if (!selectedGoodsReceipt) return

    const success = await deleteGoodsReceipt(selectedGoodsReceipt.goodsReceiptId!)
    if (success) {
      showNotification(SUCCESS_MESSAGES.DELETE_SUCCESS, 'success')
      refetch()
    } else {
      showNotification(ERROR_MESSAGES.DELETE_ERROR, 'error')
    }
    
    setIsDeleteModalOpen(false)
    setSelectedGoodsReceipt(null)
  }

  // Handle form submit
  const handleFormSubmit = async (data: CreateGoodsReceiptDto | UpdateGoodsReceiptDto) => {
    try {
      if (isEditMode && 'goodsReceiptId' in data) {
        const result = await updateGoodsReceipt(data.goodsReceiptId, data)
        if (result) {
          showNotification(SUCCESS_MESSAGES.UPDATE_SUCCESS, 'success')
          refetch()
        } else {
          showNotification(ERROR_MESSAGES.UPDATE_ERROR, 'error')
        }
      } else {
        const result = await createGoodsReceipt(data as CreateGoodsReceiptDto)
        if (result) {
          showNotification(SUCCESS_MESSAGES.CREATE_SUCCESS, 'success')
          refetch()
        } else {
          showNotification(ERROR_MESSAGES.CREATE_ERROR, 'error')
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMessage = isEditMode ? ERROR_MESSAGES.UPDATE_ERROR : ERROR_MESSAGES.CREATE_ERROR
      showNotification(errorMessage, 'error')
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

  const goodsReceipts = goodsReceiptsData?.items || []
  const totalCount = goodsReceiptsData?.totalCount || 0
  const totalPages = goodsReceiptsData?.totalPages || 1
  const currentPage = goodsReceiptsData?.pageNumber || 1

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý phiếu nhập kho</h1>
              <p className="text-sm text-gray-600">Quản lý và theo dõi các phiếu nhập hàng hóa vào kho</p>
            </div>
            <Button 
              onClick={handleCreate}
              disabled={loadingSuppliers || loadingProducts}
            >
              Tạo phiếu nhập
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          <div className="p-6">
            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Tìm kiếm theo số phiếu hoặc nhà cung cấp..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} variant="secondary">
                      Tìm kiếm
                    </Button>
                    {searchTerm && (
                      <Button onClick={handleClearSearch} variant="secondary">
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <div className="text-sm text-gray-600">
                Hiển thị {goodsReceipts.length} trong tổng số {totalCount} phiếu nhập
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-700">{error}</div>
              </div>
            )}

            {/* Table */}
            <div className="mb-6">
              <GoodsReceiptTable
                goodsReceipts={goodsReceipts}
                loading={loadingGoodsReceipts}
                onEdit={handleEdit}
                onDelete={handleDelete}
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

        {/* Form Modal */}
        <GoodsReceiptForm
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          goodsReceipt={selectedGoodsReceipt}
          suppliers={suppliers}
          products={products}
          isEdit={isEditMode}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Xác nhận xóa phiếu nhập"
          message={`Bạn có chắc chắn muốn xóa phiếu nhập "${selectedGoodsReceipt?.receiptNumber}"? Hành động này không thể hoàn tác.`}
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
