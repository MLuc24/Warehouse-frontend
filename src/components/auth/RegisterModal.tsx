import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { authService } from '../../services/auth'

const registerSchema = z.object({
  username: z.string().min(3, 'Username phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
  onSuccess: () => void
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const registerData = {
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        password: data.password
      }
      const response = await authService.register(registerData)
      
      if (response.success) {
        setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.')
        reset()
        setTimeout(() => {
          onSuccess()
          onSwitchToLogin()
        }, 2000)
      } else {
        setError(response.message || 'Đăng ký thất bại')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    setSuccess(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đăng ký tài khoản"
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Username"
              type="text"
              {...register('username')}
              error={errors.username?.message}
              placeholder="Nhập username"
            />
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="Nhập email"
            />
          </div>
        </div>

        <div>
          <Input
            label="Họ và tên"
            type="text"
            {...register('fullName')}
            error={errors.fullName?.message}
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Mật khẩu"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div>
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="Nhập lại mật khẩu"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !!success}
        >
          {isLoading ? 'Đang đăng ký...' : success ? 'Đăng ký thành công!' : 'Đăng ký'}
        </Button>

        <div className="text-center">
          <div className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-500 hover:underline font-medium"
              disabled={isLoading}
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default RegisterModal
