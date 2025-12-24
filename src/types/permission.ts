export type Ability =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'import'
  | 'export';

export type Resource = string;

export type AbilityItem = {
  module_name: string
  role_menu_view: number
  role_menu_create: number
  role_menu_edit: number
  role_menu_delete: number
  role_menu_import: number
  role_menu_export: number
}

export type PermissionMap = Record<
  Resource,
  Partial<Record<Ability, boolean>>
>;
