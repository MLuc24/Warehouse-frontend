import React from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
  headerColor?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'default'
  icon?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  headerColor = 'default',
  icon
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getHeaderClasses = () => {
    const baseClasses = "flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl"
    
    switch (headerColor) {
      case 'blue':
        return `${baseClasses} bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200`
      case 'green':
        return `${baseClasses} bg-gradient-to-r from-green-50 to-green-100 border-green-200`
      case 'orange':
        return `${baseClasses} bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200`
      case 'purple':
        return `${baseClasses} bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200`
      case 'red':
        return `${baseClasses} bg-gradient-to-r from-red-50 to-red-100 border-red-200`
      default:
        return baseClasses
    }
  }

  const getTitleClasses = () => {
    switch (headerColor) {
      case 'blue':
        return "text-xl font-bold text-blue-800"
      case 'green':
        return "text-xl font-bold text-green-800"
      case 'orange':
        return "text-xl font-bold text-orange-800"
      case 'purple':
        return "text-xl font-bold text-purple-800"
      case 'red':
        return "text-xl font-bold text-red-800"
      default:
        return "text-xl font-bold text-gray-800"
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop with animation */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" />
        
        {/* Modal with enhanced styling */}
        <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 ${className}`}>
          {/* Header */}
          <div className={getHeaderClasses()}>
            <div className="flex items-center">
              {icon && (
                <div className="mr-3 text-2xl">
                  {icon}
                </div>
              )}
              <h3 className={getTitleClasses()}>
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
