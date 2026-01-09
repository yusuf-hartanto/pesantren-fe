'use client'

import { PermissionProvider } from '@/contexts/PermissionContext'

type Props = {
  children: React.ReactNode
  initialPermissions: Record<string, any>
}

export default function AppClientLayout({
  children,
  initialPermissions,
}: Props) {
  return (
    <PermissionProvider initialPermissions={initialPermissions}>
      {children}
    </PermissionProvider>
  )
}
