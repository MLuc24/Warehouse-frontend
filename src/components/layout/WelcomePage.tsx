import React from 'react';
import { Button } from '@/components/ui';

interface WelcomePageProps {
  onOpenAuth: (type?: 'login' | 'register') => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation Header */}
      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3zm0 0L5.25 21M19.5 3l-.75 18M9 21V9l3-3 3 3v12M12 9v12" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Warehouse Management</span>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => onOpenAuth('register')}
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-4 py-2"
              >
                Đăng ký
              </Button>
              <Button
                variant="primary"
                onClick={() => onOpenAuth('login')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2"
              >
                Đăng nhập
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3zm0 0L5.25 21M19.5 3l-.75 18M9 21V9l3-3 3 3v12M12 9v12" />
              </svg>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">Hệ thống quản lý</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Kho hàng thông minh
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Giải pháp toàn diện giúp doanh nghiệp quản lý kho hàng hiệu quả, 
              tối ưu hóa quy trình và nâng cao năng suất
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenAuth('register')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Bắt đầu miễn phí
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onOpenAuth('login')}
                className="border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold transition-all duration-200"
              >
                Đăng nhập
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tính năng chính
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tất cả công cụ cần thiết để quản lý kho hàng hiệu quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quản lý sản phẩm
              </h3>
              <p className="text-gray-600">
                Theo dõi thông tin chi tiết của từng sản phẩm và quản lý tồn kho
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quản lý nhà cung cấp
              </h3>
              <p className="text-gray-600">
                Duy trì mối quan hệ với nhà cung cấp và theo dõi hiệu suất
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Báo cáo & Phân tích
              </h3>
              <p className="text-gray-600">
                Phân tích dữ liệu với báo cáo chi tiết và biểu đồ trực quan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Đăng ký ngay hôm nay và trải nghiệm hệ thống quản lý kho hàng hiện đại
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onOpenAuth('register')}
            className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Đăng ký miễn phí
          </Button>
        </div>
      </section>
    </div>
  );
};
