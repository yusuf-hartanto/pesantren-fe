'use client'

import { usePathname } from 'next/navigation'

import { useSession } from 'next-auth/react'

import type { Ability } from '@/types/permission'
import { can, normalizeResource } from '@/libs/permission'


export function useCan(abilities: Ability | Ability[]): boolean {
  const { data: session } = useSession()

  const pathname = usePathname()
  const resource = normalizeResource(pathname)

  return can(session?.permissions, resource, abilities)
}
