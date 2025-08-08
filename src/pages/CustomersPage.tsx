import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { CustomerList, CustomerInline, CustomerStats } from '@/features/customers';
import { useCustomer } from '@/hooks/useCustomer';
import { Modal } from '@/components/ui';
import { Users, Plus, RefreshCw } from 'lucide-react';
import type { Customer, CreateCustomer, UpdateCustomer } from '@/types';

/**
 * Main Customers Management Page
 * Combines customer listing, creation, editing, and statistics
 * Provides complete customer management functionality
 */
export const CustomersPage: React.FC = () => {
  // Customer hook for data management
  const {
    customers,
    loading,
    creating,
    updating,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    clearError
  } = useCustomer();

  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedForEdit, setSelectedForEdit] = useState<Customer | null>(null);

  // Mock pagination data
  const pageSize = 10;
  const totalPages = Math.ceil(customers.length / pageSize);

  // Mock stats for demo until API is fully implemented
  const mockStats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'Active').length,
    vipCustomers: customers.filter(c => c.customerType === 'VIP').length,
    recentRegistrations: customers.filter(c => {
      const createdDate = new Date(c.createdAt || '');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length
  };

  // Load initial data
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Clear error when component mounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Handle customer selection
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  // Handle customer creation
  const handleCreateCustomer = async (data: CreateCustomer) => {
    try {
      await createCustomer(data);
      setIsCreateModalOpen(false);
      console.log('Thêm khách hàng thành công!');
    } catch (error) {
      console.error('Có lỗi xảy ra khi thêm khách hàng:', error);
    }
  };

  // Handle customer update
  const handleUpdateCustomer = async (data: UpdateCustomer) => {
    if (!selectedForEdit) return;
    
    try {
      await updateCustomer(selectedForEdit.customerId, data);
      setIsEditModalOpen(false);
      setSelectedForEdit(null);
      console.log('Cập nhật khách hàng thành công!');
    } catch (error) {
      console.error('Có lỗi xảy ra khi cập nhật khách hàng:', error);
    }
  };

  // Unified save handler for both create and update
  const handleSaveCustomer = async (data: CreateCustomer | UpdateCustomer) => {
    if (selectedForEdit) {
      // Update mode
      await handleUpdateCustomer(data as UpdateCustomer);
    } else {
      // Create mode
      await handleCreateCustomer(data as CreateCustomer);
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchCustomers();
    console.log('Dữ liệu đã được cập nhật!');
  };

  // Handle edit click
  const handleEditClick = (customer: Customer) => {
    setSelectedForEdit(customer);
    setIsEditModalOpen(true);
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
              <p className="text-sm text-gray-500">Quản lý thông tin khách hàng và theo dõi hoạt động mua hàng</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            <button
              onClick={() => setIsStatsVisible(!isStatsVisible)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isStatsVisible ? 'Ẩn thống kê' : 'Hiện thống kê'}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm khách hàng
            </button>
          </div>
        </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      {/* Statistics */}
      {isStatsVisible && (
        <CustomerStats stats={mockStats} />
      )}

      {/* Customer List */}
      <CustomerList
        customers={filteredCustomers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={handleSelectCustomer}
        onShowCreate={() => setIsCreateModalOpen(true)}
        loading={loading}
        // Search props
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        // Pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        // Permission props
        permissions={{
          customers: {
            canCreate: true // TODO: Get from user permissions
          }
        }}
      />

      {/* Create Customer Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm khách hàng mới"
      >
        <CustomerInline
          onSave={handleCreateCustomer}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={creating}
        />
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa khách hàng"
      >
        {selectedForEdit && (
          <CustomerInline
            customer={selectedForEdit}
            onSave={handleSaveCustomer}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={updating}
          />
        )}
      </Modal>

      {/* Edit Mode Trigger */}
      {selectedCustomer && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => handleEditClick(selectedCustomer)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Chỉnh sửa khách hàng"
          >
            <Users className="w-6 h-6" />
          </button>
        </div>
      )}
      </div>
    </Layout>
  );
};

export default CustomersPage;
