import React from 'react';
import { Card } from '@/components/ui';

interface SupplierStatsProps {
  totalCount: number;
  currentCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Supplier Statistics Component
 * Atomic level: Organism - composed of multiple stat cards
 */
export const SupplierStats: React.FC<SupplierStatsProps> = ({
  totalCount,
  currentCount,
  currentPage,
  totalPages
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Tổng nhà cung cấp</h3>
        <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Hiện tại</h3>
        <p className="text-2xl font-bold text-green-600">{currentCount}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Trang</h3>
        <p className="text-2xl font-bold text-purple-600">{currentPage}/{totalPages}</p>
      </Card>
    </div>
  );
};

export default SupplierStats;
