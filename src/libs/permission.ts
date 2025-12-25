import type { Ability, AbilityItem, PermissionMap, Resource } from '@/types/permission';

export function can(
  permissions: PermissionMap | null | undefined,
  resource: Resource,
  abilities: Ability | Ability[]
): boolean {
  if (!permissions) return false;

  const key = normalizeResource(resource);
  const permission = permissions[key];

  if (!permission) return false;

  const required = Array.isArray(abilities)
    ? abilities
    : [abilities];

  return required.every(
    (ability) => permission[ability] === true
  );
}

export const cannot = (
  permissions: PermissionMap | null | undefined,
  resource: Resource,
  abilities: Ability | Ability[]
) => !can(permissions, resource, abilities);

export function normalizeAbility(
  abilities: AbilityItem[]
): PermissionMap {
  return abilities.reduce<PermissionMap>((acc, item) => {
    const key = normalizeResource(item.module_name);

    acc[key] = {
      view: item.role_menu_view === 1,
      create: item.role_menu_create === 1,
      edit: item.role_menu_edit === 1,
      delete: item.role_menu_delete === 1,
      import: item.role_menu_import === 1,
      export: item.role_menu_export === 1,
    };

    return acc;
  }, {});
}

export function normalizeResource(path: string): string {
  return path
    .toLowerCase()
    .split('?')[0]
    .replace(/\/(list|form|edit|detail|access)(\/.*)?$/, '')
    .replace(/\/$/, '');
}
