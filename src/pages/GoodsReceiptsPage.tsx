import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Layout } from '@/components/layout/Layout'
import { GoodsReceiptTable } from '@/features/goodsReceipts'
import UnifiedGoodsReceiptForm from '@/features/goodsReceipts/components/forms/UnifiedGoodsReceiptForm'
import { GoodsReceiptDetailView } from '@/features/goodsReceipts/components'
import { useGoodsReceipt } from '@/hooks/useGoodsReceipt'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GoodsReceiptStatus } from '@/types/goodsReceipt'

const GoodsReceiptsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const {
    goodsReceipts,
    loading,
    suppliers,
    products,
    currentUser,
    selectedGoodsReceipt,
    filters,
    viewMode,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    setViewMode,
    setCurrentPage,
    setPageSize,
    handleFormSubmit,
    handleDeleteGoodsReceipt,
    handleEdit,
    handleView,
    handleCreate,
    handleApprove,
    handleReject,
    handleComplete,
    handleCancel,
    handleResubmit,
    handleResendEmail,
    handleExportPDF,
    updateFilters,
    refreshData,
  } = useGoodsReceipt()

  const handleSearch = () => {
    updateFilters({ receiptNumber: searchTerm })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <UnifiedGoodsReceiptForm
              goodsReceipt={selectedGoodsReceipt}
              suppliers={suppliers}
              products={products.map(p => ({
                ...p,
                productSku: p.sku,
              }))}
              onSubmit={handleFormSubmit}
              onCancel={() => setViewMode('table')}
            />
          </div>
        </div>
      </Layout>
    )
  }

  if (viewMode === 'view' && selectedGoodsReceipt) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <GoodsReceiptDetailView
              goodsReceipt={selectedGoodsReceipt}
              onEdit={() => handleEdit(selectedGoodsReceipt)}
              onDelete={() => handleDeleteGoodsReceipt(selectedGoodsReceipt.goodsReceiptId!)}
              onBack={() => setViewMode('table')}
              onRefresh={refreshData}
              currentUserRole={currentUser?.role || ''}
              currentUserId={currentUser?.userId}
              onExportReceipt={() => {
                if (selectedGoodsReceipt?.goodsReceiptId) {
                  handleExportPDF(selectedGoodsReceipt.goodsReceiptId)
                }
              }}
              onApprove={async () => {
                if (selectedGoodsReceipt.goodsReceiptId) {
                  await handleApprove(selectedGoodsReceipt.goodsReceiptId)
                  // Status will be updated via the hook's real-time update
                }
              }}
              onReject={async () => {
                if (selectedGoodsReceipt.goodsReceiptId) {
                  await handleReject(selectedGoodsReceipt.goodsReceiptId)
                  // Status will be updated via the hook's real-time update
                }
              }}
              onComplete={async () => {
                if (selectedGoodsReceipt.goodsReceiptId) {
                  await handleComplete(selectedGoodsReceipt.goodsReceiptId)
                  // Status will be updated via the hook's real-time update
                }
              }}
              onCancel={async () => {
                if (selectedGoodsReceipt.goodsReceiptId) {
                  await handleCancel(selectedGoodsReceipt.goodsReceiptId)
                  // Status will be updated via the hook's real-time update
                }
              }}
              onResubmit={async () => {
                if (selectedGoodsReceipt.goodsReceiptId) {
                  await handleResubmit(selectedGoodsReceipt.goodsReceiptId)
                  // Status will be updated via the hook's real-time update
                }
              }}
              onResendEmail={async () => {
                if (selectedGoodsReceipt.goodsReceiptId) {
                  await handleResendEmail(selectedGoodsReceipt.goodsReceiptId)
                }
              }}
              onExportPDF={handleExportPDF}
            />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header - similar to SuppliersPage */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Quản lý phiếu nhập kho
            </h1>
            <p className="text-sm text-gray-600">
              Theo dõi và quản lý các phiếu nhập hàng hóa từ nhà cung cấp
            </p>
          </div>
        </div>

        {/* Main Content Area - similar to SuppliersPage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          <div className="p-6">
            {/* Quick Stats - compact inline display */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Tổng:</span>
                  <span className="font-medium text-gray-900">{totalCount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Hoàn thành:</span>
                  <span className="font-medium text-green-700">
                    {goodsReceipts.filter(gr => gr.status === 'Completed').length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Chờ duyệt:</span>
                  <span className="font-medium text-yellow-700">
                    {goodsReceipts.filter(gr => gr.status === 'AwaitingApproval').length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-600">Nháp:</span>
                  <span className="font-medium text-gray-700">
                    {goodsReceipts.filter(gr => gr.status === 'Draft').length}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Trang {currentPage} / {totalPages}
              </div>
            </div>

            {/* Filters - compact and inline */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="min-w-0 flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => {
                      const value = e.target.value || undefined
                      updateFilters({ status: value as GoodsReceiptStatus | undefined })
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="Draft">📝 Nháp</option>
                    <option value="AwaitingApproval">⏳ Chờ phê duyệt</option>
                    <option value="Pending">🔄 Chờ nhà cung cấp</option>
                    <option value="Approved">✅ Đã phê duyệt</option>
                    <option value="Completed">🎉 Hoàn thành</option>
                    <option value="Cancelled">❌ Đã hủy</option>
                  </select>
                </div>

                <div className="min-w-0 flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nhà cung cấp</label>
                  <select
                    value={filters.supplierId?.toString() || ''}
                    onChange={(e) => updateFilters({ supplierId: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.supplierId} value={supplier.supplierId}>
                        {supplier.supplierName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0 flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tìm kiếm</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Tìm theo số phiếu..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSearch}
                      className="px-3 py-2 text-sm"
                    >
                      Tìm
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Button - placed above table */}
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleCreate}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo phiếu nhập</span>
              </Button>
            </div>

            {/* Table */}
            <GoodsReceiptTable
              goodsReceipts={goodsReceipts}
              loading={loading}
              onRowClick={handleView}
            />

            {/* Pagination inside the same card - like SuppliersPage */}
            {totalPages > 1 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <span>Hiển thị</span>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>trong tổng số {totalCount} kết quả</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Trước</span>
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1
                        const isCurrentPage = page === currentPage
                        const shouldShow = 
                          page === 1 || 
                          page === totalPages || 
                          Math.abs(page - currentPage) <= 2
                          
                        if (!shouldShow) {
                          if (page === currentPage - 3 || page === currentPage + 3) {
                            return <span key={page} className="px-2 text-gray-500">...</span>
                          }
                          return null
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm rounded ${
                              isCurrentPage
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1"
                    >
                      <span>Sau</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default GoodsReceiptsPage
