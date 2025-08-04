import React from 'react'
import { ProductTabNavigation } from './ProductTabNavigation'

interface ProductPageHeaderProps {
  tabs: Array<{
    id: string
    label: string
    description: string
  }>
  activeTab: string
  onTabClick: (tabId: string) => void
}

export const ProductPageHeader: React.FC<ProductPageHeaderProps> = ({ 
  tabs,
  activeTab,
  onTabClick
}) => {
  return (
    <div className="w-full">
      <ProductTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={onTabClick}
      />
    </div>
  )
}

export default ProductPageHeader
