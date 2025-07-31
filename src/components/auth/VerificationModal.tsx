import React, { useState, useRef, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  contact: string
  type: 'Email' | 'Phone'
  purpose: 'Registration' | 'ForgotPassword'
  onVerificationSuccess: (verificationCode: string) => void
  onResendCode: () => Promise<{ success: boolean; message: string }>
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  contact,
  type,
  purpose,
  onVerificationSuccess,
  onResendCode
}) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(60)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (isOpen) {
      setCountdown(60)
      setCanResend(false)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError(null)

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
    setCode(newCode.slice(0, 6))
    
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const codeString = code.join('')
    if (codeString.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { authService } = await import('../../services/auth')
      const response = await authService.verifyCode(contact, codeString, type, purpose)
      
      if (response.success) {
        setSuccess('Xác thực thành công!')
        setTimeout(() => {
          onVerificationSuccess(codeString)
        }, 1000)
      } else {
        setError(response.message || 'Mã xác thực không hợp lệ')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || 'Có lỗi xảy ra khi xác thực')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await onResendCode()
      if (response.success) {
        setSuccess('Mã xác thực mới đã được gửi!')
        setCountdown(60)
        setCanResend(false)
        
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              setCanResend(true)
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(response.message || 'Không thể gửi lại mã xác thực')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi lại mã')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setCode(['', '', '', '', '', ''])
    setError(null)
    setSuccess(null)
    onClose()
  }

  const getTitle = () => {
    return purpose === 'Registration' ? 'Xác thực đăng ký' : 'Xác thực khôi phục mật khẩu'
  }

  const getDescription = () => {
    const contactDisplay = type === 'Email' ? 'email' : 'số điện thoại'
    return `Chúng tôi đã gửi mã xác thực 6 chữ số đến ${contactDisplay}: ${contact}`
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getTitle()}
      className="max-w-md"
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
            {success}
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-6">
            {getDescription()}
          </p>
          
          <div className="flex justify-center space-x-2 mb-6" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el }}
                type="text"
                value={digit}
                onChange={e => handleInputChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                maxLength={1}
                disabled={isLoading || !!success}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleVerify}
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || code.join('').length !== 6 || !!success}
        >
          {isLoading ? 'Đang xác thực...' : success ? 'Xác thực thành công!' : 'Xác thực'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Không nhận được mã?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-500 hover:underline font-medium"
                disabled={isLoading}
              >
                Gửi lại
              </button>
            ) : (
              <span className="text-gray-400">
                Gửi lại sau {countdown}s
              </span>
            )}
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default VerificationModal
