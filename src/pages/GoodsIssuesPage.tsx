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
    handleSubmitForApproval,
    handleApprove,
    handleReject,
    handlePrepare,
    handleMarkReadyForDelivery,
    handleStartDelivery,
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

  const handleStatusFilter = (status: GoodsIssueStatus | undefined) => {
    updateFilters({ status })
  }

  const handleCustomerFilter = (customerId: number | undefined) => {
    updateFilters({ customerId })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  const renderTableView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-gray-900">
            Quản lý xuất kho
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý các phiếu xuất kho và theo dõi tiến trình giao hàng
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            variant="primary"
            onClick={handleCreate}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu xuất
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm theo số phiếu
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10"
                placeholder="Nhập số phiếu xuất..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khách hàng
            </label>
            <select
              value={filters.customerId || ''}
              onChange={(e) => handleCustomerFilter(e.target.value ? parseInt(e.target.value) : undefined)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Tất cả khách hàng</option>
              {customers.map(customer => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.customerName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value as GoodsIssueStatus || undefined)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Draft">Nháp</option>
              <option value="AwaitingApproval">Chờ phê duyệt</option>
              <option value="Approved">Đã phê duyệt</option>
              <option value="InPreparation">Đang chuẩn bị</option>
              <option value="ReadyForDelivery">Sẵn sàng giao hàng</option>
              <option value="InTransit">Đang vận chuyển</option>
              <option value="Delivered">Đã giao hàng</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
              <option value="Rejected">Bị từ chối</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleSearch}
              className="flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách phiếu xuất kho
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tìm thấy {totalCount} phiếu xuất kho
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value={10}>10 / trang</option>
                <option value={25}>25 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
              </select>
            </div>
          </div>
        </div>

        <GoodsIssueTable
          goodsIssues={goodsIssues}
          loading={loading}
          onRowClick={handleView}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, totalCount)} của {totalCount} kết quả
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderFormView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() => setViewMode('table')}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>

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
  )

  const renderDetailView = () => (
    <div className="space-y-6">
      {selectedGoodsIssue && (
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
          onSubmitForApproval={async (issue) => {
            await handleSubmitForApproval(issue.goodsIssueId)
            await refreshData()
          }}
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
          onMarkReadyForDelivery={async (issue) => {
            await handleMarkReadyForDelivery(issue.goodsIssueId)
            await refreshData()
          }}
          onStartDelivery={async (issue) => {
            const address = issue.deliveryAddress || 'Địa chỉ mặc định'
            await handleStartDelivery(issue.goodsIssueId, address)
            await refreshData()
          }}
          onConfirmDelivery={async (issue) => {
            await handleConfirmDelivery(issue.goodsIssueId)
            await refreshData()
          }}
          onComplete={async (issue) => {
            await handleComplete(issue.goodsIssueId)
            await refreshData()
          }}
          onCancel={async (issue) => {
            await handleCancel(issue.goodsIssueId, 'Hủy phiếu xuất')
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
      )}
    </div>
  )

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
      case 'edit':
        return renderFormView()
      case 'view':
        return renderDetailView()
      default:
        return renderTableView()
    }
  }

  return (
    <Layout>
      {renderContent()}
    </Layout>
  )
}

export default GoodsIssuesPage
