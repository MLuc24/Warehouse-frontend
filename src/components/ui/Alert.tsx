import React from 'react'

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  icon?: string
}

export const Alert: React.FC<AlertProps> = ({ type, message, icon }) => {
  const getAlertClasses = () => {
    const baseClasses = "border-l-4 px-4 py-3 rounded-r-md text-sm"
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-500 text-green-700`
      case 'error':
        return `${baseClasses} bg-red-50 border-red-500 text-red-700`
      case 'warning':
        return `${baseClasses} bg-amber-50 border-amber-500 text-amber-700`
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-500 text-blue-700`
      default:
        return `${baseClasses} bg-gray-50 border-gray-500 text-gray-700`
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
      <div className="flex items-center">
        <span className="mr-2">{icon || getDefaultIcon()}</span>
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Alert
