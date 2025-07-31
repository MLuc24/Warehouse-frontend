import React from 'react';
import { Button } from '@/components/ui';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

/**
 * Pagination Component
 * Atomic level: Molecule - composed of atoms (Buttons, Text)
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  loading
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(
      <Button
        key={i}
        onClick={() => onPageChange(i)}
        variant={i === currentPage ? 'primary' : 'outline'}
        size="sm"
        disabled={loading}
      >
        {i}
      </Button>
    );
  }

  return (
    <div className="flex justify-between items-center mt-6">
      <p className="text-sm text-gray-600">
        Hiển thị {Math.min((currentPage - 1) * pageSize + 1, totalCount)} - {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} nhà cung cấp
      </p>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          variant="outline"
          size="sm"
          disabled={currentPage === 1 || loading}
        >
          ← Trước
        </Button>
        {pages}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages || loading}
        >
          Sau →
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
