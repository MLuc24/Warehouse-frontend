import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Card } from '@/components/ui';
import { ROUTES } from '@/constants';
import type { LoginRequest } from '@/types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await login(data);
      
      if (response.success) {
        navigate(ROUTES.DASHBOARD);
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào hệ thống
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Warehouse Management System
          </p>
        </div>

        <Card>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Tên đăng nhập hoặc Email"
              type="text"
              autoComplete="username"
              placeholder="Nhập tên đăng nhập hoặc email"
              {...register('username', {
                required: 'Tên đăng nhập hoặc email là bắt buộc',
                minLength: {
                  value: 3,
                  message: 'Tên đăng nhập hoặc email phải từ 3 ký tự trở lên',
                },
              })}
              error={errors.username?.message}
            />

            <Input
              label="Mật khẩu"
              type="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Mật khẩu là bắt buộc',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải từ 6 ký tự trở lên',
                },
              })}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
            >
              Đăng nhập
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
