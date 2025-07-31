import React from 'react'

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  icon?: string
  title?: string
  showBorder?: boolean
}

export const Alert: React.FC<AlertProps> = ({ 
  type, 
  message, 
  icon, 
  title,
  showBorder = true
}) => {
  const getAlertClasses = () => {
    const baseClasses = showBorder 
      ? "border-l-4 px-4 py-3 rounded-r-md text-sm"
      : "px-4 py-3 rounded-lg text-sm border"
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 ${showBorder ? 'border-green-500' : 'border-green-200'} text-green-700`
      case 'error':
        return `${baseClasses} bg-red-50 ${showBorder ? 'border-red-500' : 'border-red-200'} text-red-700`
      case 'warning':
        return `${baseClasses} bg-amber-50 ${showBorder ? 'border-amber-500' : 'border-amber-200'} text-amber-700`
      case 'info':
        return `${baseClasses} bg-blue-50 ${showBorder ? 'border-blue-500' : 'border-blue-200'} text-blue-700`
      default:
        return `${baseClasses} bg-gray-50 ${showBorder ? 'border-gray-500' : 'border-gray-200'} text-gray-700`
    }
  }

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return '💡'
      default:
        return '📝'
    }
  }

  return (
    <div className={getAlertClasses()}>
      <div className="flex items-start">
        <span className="mr-3 text-lg flex-shrink-0 mt-0.5">
          {icon || getDefaultIcon()}
        </span>
        <div className="flex-1">
          {title && (
            <div className="font-semibold mb-1">{title}</div>
          )}
          <div>{message}</div>
        </div>
      </div>
    </div>
  )
}

export default Alert
