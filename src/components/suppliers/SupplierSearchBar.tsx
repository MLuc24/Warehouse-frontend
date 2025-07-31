import React from 'react';
import { Button, Input } from '@/components/ui';

interface SupplierSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
  loading: boolean;
  disabled: boolean;
}

/**
 * Supplier Search Bar Component
 * Atomic level: Molecule - composed of atoms (Input, Buttons)
 */
export const SupplierSearchBar: React.FC<SupplierSearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  onClearSearch,
  loading,
  disabled
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchTermChange(value);
    // Tìm kiếm real-time khi nhập
    onSearch(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          value={searchTerm}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
      {searchTerm && (
        <Button 
          onClick={onClearSearch}
          variant="outline"
          disabled={loading || disabled}
          className="md:w-auto"
        >
          ✕ Xóa bộ lọc
        </Button>
      )}
    </div>
  );
};

export default SupplierSearchBar;
