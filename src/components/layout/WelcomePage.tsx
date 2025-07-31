import React from 'react';
import { Button } from '@/components/ui';

interface WelcomePageProps {
  onOpenAuth: () => void;
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
            
            {/* Login Button */}
            <Button
              variant="primary"
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2"
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="mx-auto h-24 w-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3zm0 0L5.25 21M19.5 3l-.75 18M9 21V9l3-3 3 3v12M12 9v12" />
              </svg>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">Warehouse</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Management System
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Hệ thống quản lý kho hàng hiện đại, giúp doanh nghiệp tối ưu hóa 
              quy trình vận hành và nâng cao hiệu quả quản lý tồn kho
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Bắt đầu sử dụng ngay
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold transition-all duration-200"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Giải pháp toàn diện cho việc quản lý kho hàng của doanh nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quản lý sản phẩm
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Theo dõi thông tin chi tiết của từng sản phẩm, quản lý SKU, giá cả và tồn kho một cách dễ dàng.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l2.25 2.25L15 10.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Nhập xuất kho
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Quản lý quy trình nhập xuất hàng hóa hiệu quả với hệ thống theo dõi chi tiết và báo cáo đầy đủ.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m6.75 4.5v-3a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5v3m-6 0h6m-6-3h6m3.75-6.75V8.25a1.125 1.125 0 00-1.125-1.125h-3a1.125 1.125 0 00-1.125 1.125v3.75m4.5 0a2.25 2.25 0 104.5 0m-6.75 0a2.25 2.25 0 11-4.5 0m2.25 0V8.25a1.125 1.125 0 011.125-1.125h1.5a1.125 1.125 0 011.125 1.125v8.25" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quản lý nhà cung cấp
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Duy trì mối quan hệ với nhà cung cấp, theo dõi hiệu suất và quản lý hợp đồng một cách hiệu quả.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Báo cáo & Thống kê
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Phân tích dữ liệu kho hàng với các báo cáo chi tiết và biểu đồ trực quan để ra quyết định tốt hơn.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-1.499-1.499-1.499-3.93 0-5.428m13.788 0c1.499 1.499 1.499 3.93 0 5.428M12 12h.008v.008H12V12zm0 0V9a3 3 0 013 3m-3 0a3 3 0 01-3-3m3 0a1.5 1.5 0 011.5-1.5m-1.5 1.5a1.5 1.5 0 01-1.5-1.5m3 3a1.5 1.5 0 011.5-1.5m-1.5 1.5a1.5 1.5 0 01-1.5-1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Theo dõi thời gian thực
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cập nhật thông tin kho hàng theo thời gian thực với hệ thống thông báo và cảnh báo tự động.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>  
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Bảo mật & An toàn
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Bảo vệ dữ liệu với hệ thống bảo mật cao cấp và phân quyền người dùng linh hoạt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Sẵn sàng nâng cao hiệu quả quản lý kho hàng?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Bắt đầu sử dụng ngay hôm nay và trải nghiệm sự khác biệt
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={onOpenAuth}
            className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Đăng nhập ngay
          </Button>
        </div>
      </section>
    </div>
  );
};
