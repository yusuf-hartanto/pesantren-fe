'use client'

import type { Ability, Resource } from '@/types/permission'
import { useCan } from './useCan'

export function useCannot(resource: Resource, abilities: Ability | Ability[]): boolean {
  return !useCan(abilities)
}
