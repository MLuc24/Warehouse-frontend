import React, { useState, useMemo } from 'react';
import { GenericList } from '@/components/common';
import { Users, Star, Package2, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import type { Customer } from '@/types';

type StatusFilter = 'all' | 'Active' | 'Inactive';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
  onShowCreate?: () => void;
  loading: boolean;
  // Search props
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  // Permission props
  permissions?: {
    customers: {
      canCreate: boolean;
    };
  };
}

/**
 * Enhanced Customer List Component using GenericList
 * Shows list of customers with click to select functionality
 */
export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onShowCreate,
  loading,
  // Search props
  searchTerm,
  onSearchTermChange,
  onSearch,
  onClearSearch,
  // Pagination props
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  // Permission props
  permissions
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Helper function for customer type display
  const getCustomerTypeDisplay = (type: string) => {
    switch (type) {
      case 'VIP':
        return {
          icon: <Star className="w-4 h-4" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          label: 'VIP'
        };
      case 'Wholesale':
        return {
          icon: <Package2 className="w-4 h-4" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          label: 'Bán sỉ'
        };
      default:
        return {
          icon: <ShieldCheck className="w-4 h-4" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          label: 'Thường'
        };
    }
  };

  // Filter customers based on status
  const filteredCustomers = useMemo(() => {
    if (statusFilter === 'all') return customers;
    return customers.filter(customer => customer.status === statusFilter);
  }, [customers, statusFilter]);

  // Define columns for the generic list
  const columns = useMemo(() => [
    {
      key: 'customerName',
      label: 'Khách hàng',
      render: (customer: Customer) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {customer.customerName}
            </div>
            <div className="text-xs text-gray-500">
              ID: {customer.customerId}
            </div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'customerType',
      label: 'Loại khách hàng',
      render: (customer: Customer) => {
        const typeDisplay = getCustomerTypeDisplay(customer.customerType);
        return (
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${typeDisplay.color} ${typeDisplay.bgColor}`}>
            {typeDisplay.icon}
            <span>{typeDisplay.label}</span>
          </span>
        );
      },
      sortable: true,
      filterable: true
    },
    {
      key: 'contact',
      label: 'Liên hệ',
      render: (customer: Customer) => (
        <div className="space-y-1">
          {customer.email && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Mail className="w-3 h-3" />
              <span>{customer.email}</span>
            </div>
          )}
          {customer.phoneNumber && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{customer.phoneNumber}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      render: (customer: Customer) => (
        customer.address ? (
          <div className="flex items-start space-x-2 text-xs text-gray-600">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2 max-w-xs">{customer.address}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Chưa cập nhật</span>
        )
      )
    },
    {
      key: 'totalOrders',
      label: 'Tổng đơn hàng',
      render: (customer: Customer) => (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">
            {customer.totalOrders?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-gray-500">đơn hàng</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'totalPurchaseValue',
      label: 'Tổng giá trị',
      render: (customer: Customer) => (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">
            {customer.totalPurchaseValue?.toLocaleString() || '0'} VND
          </div>
          <div className="text-xs text-gray-500">tổng mua</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (customer: Customer) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          customer.status === 'Active' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {customer.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
      sortable: true,
      filterable: true
    }
  ], []);

  // Column header click handler for sorting
  const handleColumnHeaderClick = (column: { key: string; label: string }) => {
    // Sorting will be handled by GenericList internally
    console.log('Column clicked:', column.key);
  };

  // Status filter change handler
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status as StatusFilter);
  };

  // Status filter options
  const statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Hoạt động', value: 'Active' },
    { label: 'Không hoạt động', value: 'Inactive' }
  ];

  return (
    <div className="space-y-6">
      <GenericList<Customer>
        // Data props
        items={filteredCustomers}
        selectedItem={selectedCustomer}
        onSelectItem={onSelectCustomer}
        loading={loading}
        
        // Header props
        title="Danh sách khách hàng"
        totalCount={customers.length}
        headerIcon={<Users className="w-6 h-6 text-white" />}
        onShowCreate={onShowCreate}
        createButtonText="Thêm khách hàng"
        
        // Search props
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
        
        // Filter props
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        statusOptions={statusOptions}
        
        // Pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        
        // Table props
        columns={columns}
        getItemKey={(customer) => customer.customerId}
        isItemSelected={(customer, selected) => selected?.customerId === customer.customerId}
        
        // Column interactions
        onColumnHeaderClick={handleColumnHeaderClick}
        
        // Permission props
        permissions={{
          canCreate: permissions?.customers.canCreate ?? false
        }}
        
        // Empty state props
        emptyStateIcon={<Users className="w-12 h-12" />}
        emptyStateMessage="Không có khách hàng nào"
        emptySearchMessage={(term) => `Không tìm thấy khách hàng nào với từ khóa "${term}"`}
        emptyFilterMessage={(filter) => `Không có khách hàng nào ${filter === 'Active' ? 'đang hoạt động' : 'không hoạt động'}`}
      />
    </div>
  );
};

export default CustomerList;
