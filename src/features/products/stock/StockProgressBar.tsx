import React from 'react'
import { Progress } from '@/components/ui'

interface StockProgressBarProps {
  current: number
  min: number
  max?: number
  showLabel?: boolean
}

export const StockProgressBar: React.FC<StockProgressBarProps> = ({ 
  current, 
  min, 
  max, 
  showLabel = true 
}) => {
  // Calculate stock percentage
  const getStockPercentage = (current: number, min: number, max?: number) => {
    if (!max || max <= min) return 100
    const percentage = ((current - min) / (max - min)) * 100
    return Math.max(0, Math.min(100, percentage))
  }

  const percentage = getStockPercentage(current, min, max)

  const getProgressColor = () => {
    if (current <= min) return 'bg-red-500'
    if (current <= min * 1.5) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-1">
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-2"
        />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>Min: {min}</span>
          <span>Hiện tại: {current}</span>
          {max && <span>Max: {max}</span>}
        </div>
      )}
    </div>
  )
}
