import { useEffect, useRef, useState } from 'react'

interface PerformanceMetrics {
  renderTime: number
  componentName: string
  timestamp: number
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStart = useRef<number>(Date.now())
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    const renderEnd = Date.now()
    const renderTime = renderEnd - renderStart.current

    const newMetrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: renderEnd
    }

    setMetrics(newMetrics)

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > 100) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime}ms`)
    }

    // Log to performance monitoring service if available
    if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
      window.performance.mark(`${componentName}-render-end`)
      window.performance.measure(
        `${componentName}-render`,
        `${componentName}-render-start`,
        `${componentName}-render-end`
      )
    }
  }, [componentName])

  useEffect(() => {
    renderStart.current = Date.now()
    if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
      window.performance.mark(`${componentName}-render-start`)
    }
  })

  return metrics
}

export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null>(null)

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        })
      }
    }

    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return memoryInfo
}

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
