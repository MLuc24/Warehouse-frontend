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
        onClose()
      } else {
        setError(response.message || 'Đăng nhập thất bại')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || 'Đăng nhập thất bại')
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
      title="Đăng nhập"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <Input
            label="Username"
            type="text"
            {...register('username')}
            error={errors.username?.message}
            placeholder="Nhập username của bạn"
          />
        </div>

        <div>
          <Input
            label="Mật khẩu"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="Nhập mật khẩu"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
          >
            Quên mật khẩu?
          </button>
          
          <div className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-500 hover:underline font-medium"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default LoginModal
