import React, { useState } from 'react';
import { Button, Input, Card } from '@/components/ui';

interface SearchAndFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (filters: WarehouseFilters) => void;
  onExport?: () => void;
  searchPlaceholder?: string;
  className?: string;
}

interface WarehouseFilters {
  hasInventory?: 'all' | 'with-items' | 'empty';
  sortBy?: 'name' | 'createdAt' | 'totalItems';
  sortOrder?: 'asc' | 'desc';
}

/**
 * SearchAndFilter - Clean and simplified component
 */
export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilter,
  onExport,
  searchPlaceholder = 'Tìm kiếm kho hàng...',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<WarehouseFilters>({
    hasInventory: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (newFilters: Partial<WarehouseFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={filters.hasInventory}
            onChange={(e) => handleFilterChange({ hasInventory: e.target.value as 'all' | 'with-items' | 'empty' })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả kho</option>
            <option value="with-items">Có hàng</option>
            <option value="empty">Trống</option>
          </select>
          
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value as 'name' | 'createdAt' | 'totalItems' })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Theo tên</option>
            <option value="createdAt">Theo ngày</option>
            <option value="totalItems">Theo số lượng</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>

          {onExport && (
            <Button
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              onClick={onExport}
              variant="secondary"
              size="sm"
            >
              Xuất Excel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SearchAndFilter;
