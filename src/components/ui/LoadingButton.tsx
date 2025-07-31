import React from 'react'

interface LoadingButtonProps {
  isLoading: boolean
  loadingText: string
  children: React.ReactNode
  successText?: string
  isSuccess?: boolean
  successIcon?: string
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText,
  children,
  successText,
  isSuccess = false,
  successIcon = '✅'
}) => {
  if (isSuccess && successText) {
    return (
      <div className="flex items-center justify-center">
        <span className="mr-2">{successIcon}</span>
        {successText}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        {loadingText}
      </div>
    )
  }

  return <>{children}</>
}

export default LoadingButton
