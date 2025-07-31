import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuth } from '../../hooks/useAuth'

const loginSchema = z.object({
  username: z.string().min(1, 'Username không được để trống'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
  onSwitchToForgotPassword: () => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgotPassword
}) => {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await login(data)
      if (response.success) {
        reset()
        onClose() // Chỉ đóng modal khi login thành công
      } else {
        setError(response.message || 'Đăng nhập thất bại')
        // Không đóng modal khi có lỗi, để user có thể thử lại
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || 'Đăng nhập thất bại')
      // Không đóng modal khi có lỗi
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Chào mừng trở lại!"
      headerColor="blue"
      icon="👋"
    >
      <div className="space-y-6">
        {/* Greeting text */}
        <p className="text-gray-600 text-center">
          Đăng nhập để tiếp tục quản lý kho hàng
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-md text-sm">
              <div className="flex items-center">
                <span className="text-red-500">⚠️</span>
                <span className="ml-2">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Username hoặc Email"
              type="text"
              {...register('username')}
              error={errors.username?.message}
              placeholder="Nhập username hoặc email"
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <Input
              label="Mật khẩu"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Nhập mật khẩu"
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang đăng nhập...
              </div>
            ) : (
              'Đăng nhập'
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          <div className="text-center space-y-3">
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Quên mật khẩu?
            </button>
            
            <div className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default LoginModal
