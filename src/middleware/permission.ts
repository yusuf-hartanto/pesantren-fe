import { can, normalizeResource } from '@/libs/permission'
import type { PermissionMap } from '@/types/permission'

export function canAccessRoute(
  permissions: PermissionMap | null,
  pathname: string
): boolean {
  const resource = normalizeResource(pathname)

  return can(permissions, resource, 'view')
}
