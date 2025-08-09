import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Layout } from '@/components/layout/Layout'
import { GoodsIssueTable } from '@/features/goodsIssues'
import UnifiedGoodsIssueForm from '@/features/goodsIssues/components/forms/UnifiedGoodsIssueForm'
import { GoodsIssueDetailView } from '@/features/goodsIssues/components'
import { useGoodsIssue } from '@/hooks/useGoodsIssue'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GoodsIssueStatus } from '@/types/goodsIssue'

const GoodsIssuesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const {
    goodsIssues,
    loading,
    customers,
    products,
    currentUser,
    selectedGoodsIssue,
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
    handleDeleteGoodsIssue,
    handleEdit,
    handleView,
    handleCreate,
    handleApprove,
    handleReject,
    handlePrepare,
    handleConfirmDelivery,
    handleComplete,
    handleCancel,
    handleResubmit,
    handleResendEmail,
    updateFilters,
    refreshData,
  } = useGoodsIssue()

  const handleSearch = () => {
    updateFilters({ issueNumber: searchTerm })
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
            <UnifiedGoodsIssueForm
              goodsIssue={selectedGoodsIssue}
              customers={customers}
              products={products.map(p => ({
                ...p,
                productSku: p.sku || '',
              }))}
              onSubmit={handleFormSubmit}
              onCancel={() => setViewMode('table')}
              loading={loading}
            />
          </div>
        </div>
      </Layout>
    )
  }

  if (viewMode === 'view' && selectedGoodsIssue) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <GoodsIssueDetailView
              goodsIssue={selectedGoodsIssue}
              currentUserId={currentUser?.userId}
              userRole={currentUser?.role}
              onEdit={handleEdit}
              onDelete={async (issue) => {
                await handleDeleteGoodsIssue(issue.goodsIssueId)
                setViewMode('table')
              }}
              onBack={() => setViewMode('table')}
              onApprove={async (issue) => {
                await handleApprove(issue.goodsIssueId)
                await refreshData()
              }}
              onReject={async (issue) => {
                await handleReject(issue.goodsIssueId, 'Từ chối phiếu xuất')
                await refreshData()
              }}
              onPrepare={async (issue) => {
                await handlePrepare(issue.goodsIssueId)
                await refreshData()
              }}
              onConfirmDelivery={async (issue) => {
                const address = issue.deliveryAddress || 'Địa chỉ mặc định'
                await handleConfirmDelivery(issue.goodsIssueId, address)
                await refreshData()
              }}
              onComplete={async (issue) => {
                await handleComplete(issue.goodsIssueId)
                await refreshData()
              }}
              onCancel={async (issue) => {
                await handleCancel(issue.goodsIssueId)
                await refreshData()
              }}
              onResubmit={async (issue) => {
                await handleResubmit(issue.goodsIssueId)
                await refreshData()
              }}
              onResendEmail={async (issue) => {
                await handleResendEmail(issue.goodsIssueId)
              }}
              loading={loading}
            />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header - similar to GoodsReceiptsPage */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Quản lý phiếu xuất kho
            </h1>
            <p className="text-sm text-gray-600">
              Theo dõi và quản lý các phiếu xuất hàng hóa cho khách hàng
            </p>
          </div>
        </div>

        {/* Main Content Area - similar to GoodsReceiptsPage */}
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
                    {goodsIssues.filter(gi => gi.status === 'Completed').length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Chờ duyệt:</span>
                  <span className="font-medium text-yellow-700">
                    {goodsIssues.filter(gi => gi.status === 'AwaitingApproval').length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-600">Nháp:</span>
                  <span className="font-medium text-gray-700">
                    {goodsIssues.filter(gi => gi.status === 'Draft').length}
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
                      updateFilters({ status: value as GoodsIssueStatus | undefined })
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="Draft">📝 Nháp</option>
                    <option value="AwaitingApproval">⏳ Chờ phê duyệt</option>
                    <option value="Approved">✅ Đã phê duyệt</option>
                    <option value="Preparing">🔄 Đang chuẩn bị</option>
                    <option value="Delivered">🚚 Đã giao hàng</option>
                    <option value="Completed">🎉 Hoàn thành</option>
                    <option value="Cancelled">❌ Đã hủy</option>
                    <option value="Rejected">❌ Bị từ chối</option>
                  </select>
                </div>

                <div className="min-w-0 flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Khách hàng</label>
                  <select
                    value={filters.customerId?.toString() || ''}
                    onChange={(e) => updateFilters({ customerId: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả</option>
                    {customers.map(customer => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.customerName}
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
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo phiếu xuất</span>
              </Button>
            </div>

            {/* Table */}
            <GoodsIssueTable
              goodsIssues={goodsIssues}
              loading={loading}
              onRowClick={handleView}
            />

            {/* Pagination inside the same card - like GoodsReceiptsPage */}
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
                                ? 'bg-green-600 text-white'
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

export default GoodsIssuesPage
