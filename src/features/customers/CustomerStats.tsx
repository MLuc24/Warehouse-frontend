import React from 'react';
import { Card } from '@/components/ui';
import { Users, ShoppingCart, TrendingUp, Calendar } from 'lucide-react';

interface CustomerStatsProps {
  stats: {
    totalCustomers: number;
    activeCustomers: number;
    vipCustomers: number;
    recentRegistrations: number;
  };
  loading?: boolean;
}

/**
 * Customer Statistics Component
 * Displays customer-related statistics in a card layout
 */
export const CustomerStats: React.FC<CustomerStatsProps> = ({ stats, loading = false }) => {
  const statItems = [
    {
      label: 'Tổng khách hàng',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Khách hàng hoạt động',
      value: stats.activeCustomers,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Khách hàng VIP',
      value: stats.vipCustomers,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Đăng ký gần đây',
      value: stats.recentRegistrations,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        
        return (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.value.toLocaleString()}
                </p>
              </div>
              <div className={`${item.bgColor} ${item.color} p-3 rounded-lg`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
