'use client'

import { createContext, useContext, useState } from 'react'

import type { PermissionMap } from '@/types/permission'

type PermissionContextType = {
  permissions: PermissionMap
  setPermissions: (p: PermissionMap) => void
}

const PermissionContext = createContext<PermissionContextType | null>(null)

export function PermissionProvider({
  children,
  initialPermissions
}: {
  children: React.ReactNode
  initialPermissions: PermissionMap
}) {
  const [permissions, setPermissions] = useState<PermissionMap>(initialPermissions)

  return (
    <PermissionContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissionContext() {
  const ctx = useContext(PermissionContext)

  if (!ctx) throw new Error('PermissionProvider missing')
    
  return ctx
}
