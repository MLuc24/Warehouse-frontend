import React from 'react'
import { Card } from '@/components/ui'

interface ComingSoonPlaceholderProps {
  title: string
  description: string
  expectedWeeks?: number
  features?: string[]
}

export const ComingSoonPlaceholder: React.FC<ComingSoonPlaceholderProps> = ({
  title,
  description,
  expectedWeeks = 10,
  features = []
}) => {
  const defaultFeatures = [
    'Giao diện tương tác trực quan',
    'Tính năng tìm kiếm và lọc nâng cao',
    'Báo cáo và phân tích chi tiết',
    'Tích hợp với hệ thống hiện tại',
    'Hỗ trợ xuất/nhập dữ liệu'
  ]

  const displayFeatures = features.length > 0 ? features : defaultFeatures

  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <Card className="max-w-2xl w-full p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🚧</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {description}
        </p>

        {/* Timeline */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <span className="text-sm font-medium">
              🗓️ Dự kiến hoàn thành: Tuần {expectedWeeks}
            </span>
          </div>
        </div>

        {/* Features Preview */}
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ✨ Tính năng sắp ra mắt:
          </h3>
          <ul className="space-y-2">
            {displayFeatures.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Tiến độ phát triển</span>
            <span>25%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: '25%' }}
            ></div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">
            💡 Có ý tưởng hoặc yêu cầu cho tính năng này?
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
            📝 Gửi feedback
          </button>
        </div>
      </Card>
    </div>
  )
}

export default ComingSoonPlaceholder
