import React from 'react';
import { Button, Input } from '@/components/ui';

interface FilterOption {
  label: string;
  value: string;
}

interface SortOption {
  label: string;
  value: string;
}

interface GenericListColumn<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  render: (item: T) => React.ReactNode;
}

interface GenericListProps<T> {
  // Data
  items: T[];
  selectedItem: T | null;
  onSelectItem: (item: T) => void;
  loading: boolean;
  
  // Header
  title: string;
  totalCount: number;
  headerIcon: React.ReactNode;
  onShowCreate?: () => void;
  createButtonText?: string;
  
  // Search
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
  searchPlaceholder?: string;
  
  // Filters & Sorting
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  statusOptions: FilterOption[];
  
  dateSort: string;
  onDateSortChange: (sort: string) => void;
  sortOptions: SortOption[];
  
  // Table
  columns: GenericListColumn<T>[];
  getItemKey: (item: T) => string | number;
  isItemSelected: (item: T, selectedItem: T | null) => boolean;
  
  // Permissions
  permissions?: {
    canCreate: boolean;
  };
  
  // Empty state
  emptyStateIcon?: React.ReactNode;
  emptyStateMessage?: string;
  emptySearchMessage?: (searchTerm: string) => string;
  emptyFilterMessage?: (filterLabel: string) => string;
}

/**
 * Generic List Component
 * Reusable list component with search, filter, sort, and table functionality
 */
export const GenericList = <T,>({
  // Data props
  items,
  selectedItem,
  onSelectItem,
  loading,
  
  // Header props
  title,
  totalCount,
  headerIcon,
  onShowCreate,
  createButtonText = "Thêm mới",
  
  // Search props
  searchTerm,
  onSearchTermChange,
  onSearch,
  onClearSearch,
  searchPlaceholder = "Tìm kiếm...",
  
  // Filter & Sort props
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  dateSort,
  onDateSortChange,
  sortOptions,
  
  // Table props
  columns,
  getItemKey,
  isItemSelected,
  
  // Permission props
  permissions,
  
  // Empty state props
  emptyStateIcon,
  emptyStateMessage = "Chưa có dữ liệu",
  emptySearchMessage = (term: string) => `Không tìm thấy kết quả với từ khóa "${term}"`,
  emptyFilterMessage = (filter: string) => `Không có dữ liệu với bộ lọc "${filter}"`
}: GenericListProps<T>) => {
  // Handle input change for search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(e.target.value);
  };

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    onClearSearch();
  };

  // Get empty state message
  const getEmptyStateMessage = () => {
    const currentFilterOption = statusOptions.find(opt => opt.value === statusFilter);
    
    if (currentFilterOption && statusFilter !== 'all') {
      return emptyFilterMessage(currentFilterOption.label);
    }
    
    if (searchTerm) {
      return emptySearchMessage(searchTerm);
    }
    
    return emptyStateMessage;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Search and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Create Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                {headerIcon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Tổng cộng: <span className="font-semibold text-blue-600">{totalCount}</span> bản ghi
                </p>
              </div>
            </div>
            
            {permissions?.canCreate && onShowCreate && (
              <Button
                onClick={onShowCreate}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {createButtonText}
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
            {/* Search Input */}
            <div className="relative flex-1 lg:w-80">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Date Sort */}
            <select
              value={dateSort}
              onChange={(e) => onDateSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        {column.icon && <div className="w-4 h-4 mr-2">{column.icon}</div>}
                        {column.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr
                    key={getItemKey(item)}
                    onClick={() => onSelectItem(item)}
                    className={`cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                      isItemSelected(item, selectedItem)
                        ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm'
                        : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4">
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 text-gray-400 mb-4 mx-auto">
              {emptyStateIcon || (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2m16-7H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
                </svg>
              )}
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {getEmptyStateMessage()}
            </p>
            {(statusFilter !== 'all' || searchTerm) ? (
              <Button
                onClick={() => {
                  onStatusFilterChange('all');
                  handleClearSearch();
                }}
                variant="secondary"
                className="mt-4"
              >
                Xóa bộ lọc
              </Button>
            ) : permissions?.canCreate && onShowCreate && (
              <Button
                onClick={onShowCreate}
                className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                {createButtonText}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericList;
