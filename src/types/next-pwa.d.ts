declare module 'next-pwa' {
  import type { NextConfig } from 'next'

  type PWAConfig = {
    dest?: string
    disable?: boolean
    register?: boolean
    skipWaiting?: boolean
    runtimeCaching?: any[]
    maximumFileSizeToCacheInBytes?: number
    [key: string]: any
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig

  export default withPWA
}
