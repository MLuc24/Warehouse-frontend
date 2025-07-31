import React from 'react';
import { Card } from '@/components/ui';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  description?: string;
}

interface GenericStatsProps {
  title?: string;
  titleIcon?: React.ReactNode;
  stats: StatItem[];
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
}

/**
 * Generic Stats Component
 * Reusable statistics display component
 */
export const GenericStats: React.FC<GenericStatsProps> = ({
  title,
  titleIcon,
  stats,
  loading = false,
  columns = 4
}) => {
  // Color mappings for gradients and text
  const colorMappings = {
    blue: {
      gradient: 'from-blue-50 to-indigo-50',
      icon: 'text-blue-600',
      text: 'text-blue-600'
    },
    green: {
      gradient: 'from-green-50 to-emerald-50',
      icon: 'text-green-600',
      text: 'text-green-600'
    },
    red: {
      gradient: 'from-red-50 to-pink-50',
      icon: 'text-red-600',
      text: 'text-red-600'
    },
    yellow: {
      gradient: 'from-yellow-50 to-orange-50',
      icon: 'text-yellow-600',
      text: 'text-yellow-600'
    },
    purple: {
      gradient: 'from-purple-50 to-violet-50',
      icon: 'text-purple-600',
      text: 'text-purple-600'
    },
    indigo: {
      gradient: 'from-indigo-50 to-blue-50',
      icon: 'text-indigo-600',
      text: 'text-indigo-600'
    }
  };

  // Grid columns mapping
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          {title && <div className="h-6 bg-gray-200 rounded mb-4"></div>}
          <div className={`grid ${gridCols[columns]} gap-4`}>
            {Array.from({ length: stats.length || 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Title Section */}
      {title && (
        <div className="flex items-center mb-6">
          {titleIcon && (
            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
              <div className="w-5 h-5 text-white">
                {titleIcon}
              </div>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {stats.map((stat, index) => {
          const colors = colorMappings[stat.color];
          
          return (
            <div 
              key={index}
              className={`bg-gradient-to-r ${colors.gradient} rounded-lg p-4`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 ${colors.icon}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className={`text-sm font-medium ${colors.text}`}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  {stat.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {stat.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default GenericStats;
