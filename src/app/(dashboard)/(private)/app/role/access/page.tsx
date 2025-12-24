'use client'

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Card, CardHeader, CardContent } from '@mui/material'
import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import { useSession } from 'next-auth/react'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchRoleMenuById, postRoleMenu, resetRedux, setNavigation } from '../slice'
import { field, fieldBuildSubmit, formColumn } from '@/views/onevour/form/AppFormBuilder'
import { fetchMenuAll } from '../../menu/slice'
import { buildMenuTree } from '@/@core/utils/menuHelpers'
import { normalizeResource } from '@/libs/permission'

const actions = ['view', 'create', 'edit', 'delete', 'import', 'export'] as const

type ActionType = (typeof actions)[number]

interface MenuItem {
  menu_id: string
  menu_name: string
  module_name: string
  menu_icon: string
  children?: MenuItem[]
}

interface MenuPermission {
  menu_id: string
  module_name: string
  view: number
  create: number
  edit: number
  delete: number
  import: number
  export: number
  status: number
  children?: MenuPermission[]
}

interface RoleOption {
  value: string
  label: string
}

interface RoleMenuUpdate {
  role_id: RoleOption
  menu: MenuPermission[]
}

type PermissionMap = Record<string, MenuPermission>

interface FormData {
  role_id: string
  role_name: string
  menu: MenuPermission[]
}

const defaultValues: FormData = {
  role_id: '',
  role_name: '',
  menu: [],
}

const FormValidationBasic = () => {
  const router = useRouter()

  const { update } = useSession()

  const submittedMenuRef = useRef<RoleMenuUpdate>({
    role_id: { value: "", label: "" },
    menu: [],
  })

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.role)
  const navigation = useAppSelector(state => state.role.navigation)

  const [state, setState] = useState<FormData>(defaultValues)
  const [loading, setLoading] = useState(false)
  const [roleMenus, setRoleMenus] = useState<MenuPermission[]>([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({defaultValues})

  const permissionMap = useMemo(() => {
    const map: PermissionMap = {}

    state.menu.forEach(p => {
      map[p.menu_id] = p
    })
    
    return map
  }, [state.menu])

  const roleMenusSafe = useMemo(
    () => Array.isArray(roleMenus) ? roleMenus : [],
    [roleMenus]
  )

  const buildDefaultPermissions = (items: MenuItem[]) => {
    const result: MenuPermission[] = []

    const walk = (menus: MenuItem[]) => {
      menus.forEach(menu => {
        result.push({
          menu_id: menu.menu_id,
          module_name: menu.module_name,
          view: 0,
          create: 0,
          edit: 0,
          delete: 0,
          import: 0,
          export: 0,
          status: 1
        })

        if (Array.isArray(menu.children)) {
          walk(menu.children)
        }
      })
    }

    walk(items)
    
    return result
  }

  useEffect(() => {
    dispatch(fetchMenuAll({})).then(res => {
      const datas = res?.payload?.data

      if (!Array.isArray(datas)) return

      const tree = buildMenuTree(datas)
      
      dispatch(setNavigation(tree))
    })

    if (!id) return

    dispatch(fetchRoleMenuById(id)).then(res => {
      const datas = res?.payload?.data

      if (!datas) return

      setState(prev => ({
        ...prev,
        role_id: datas.role_id,
        role_name: datas.role_name
      }))

      reset({
        role_id: datas.role_id,
        role_name: datas.role_name
      })

      setRoleMenus(datas.menu ?? [])
    })

  }, [dispatch, id, reset])


  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/role/list')
  }, [dispatch, router])

  useEffect(() => {
    if (!store.crud) return

    if (store.crud.status) {
      toast.success('Success saved')

      update({
        permissions: submittedMenuRef?.current?.menu.reduce((acc, m) => {
          const key = normalizeResource(m.module_name)

          acc[key] = {
            view: m.view === 1,
            create: m.create === 1,
            edit: m.edit === 1,
            delete: m.delete === 1,
            import: m.import === 1,
            export: m.export === 1,
          }
          
          return acc
        }, {} as Record<string, any>)
      })

      onCancel()
    } else {
      toast.error('Error saved: ' + store.crud.message)

      setLoading(false)
    }
  }, [onCancel, store, update])

  const mergePermissions = (
    defaults: MenuPermission[],
    roleMenus: MenuPermission[]
  ) => {
    const map = new Map(roleMenus.map(m => [m.menu_id, m]))

    return defaults.map(def =>
      map.has(def.menu_id)
        ? { ...def, ...map.get(def.menu_id)! }
        : def
    )
  }

  useEffect(() => {
    if (!navigation.length) return

    const defaults = buildDefaultPermissions(navigation)

    const merged = mergePermissions(
      defaults,
      roleMenusSafe
    )

    setState(prev => ({
      ...prev,
      menu: merged
    }))
  }, [navigation, roleMenusSafe])

  const hasAnyChecked = (
    menu: MenuItem,
    action: ActionType,
    map: PermissionMap
  ): boolean => {
    if (!menu.children?.length) {
      return map[menu.menu_id]?.[action] === 1
    }

    return menu.children.some(child =>
      hasAnyChecked(child, action, map)
    )
  }

  const setAllChildren = (
    menu: MenuPermission,
    action: keyof MenuPermission,
    value: boolean
  ): MenuPermission => ({
    ...menu,
    [action]: value,
    children: menu.children?.map(child =>
      setAllChildren(child, action, value)
    )
  })

  const isAllChecked = (action: ActionType) =>
    state.menu.length > 0 &&
    state.menu.every(menu => menu[action] === 1)

  const isSomeChecked = (action: ActionType) =>
    state.menu.some(menu => menu[action] === 1) &&
    !isAllChecked(action)

  const onCheckAll = (action: ActionType, value: boolean) => {
    setState(prev => ({
      ...prev,
      menu: prev.menu.map(m => ({
        ...m,
        [action]: value ? 1 : 0
      }))
    }))
  }

  const resetActionsExceptView = (menu: MenuPermission): MenuPermission => ({
    ...menu,
    create: 0,
    edit: 0,
    delete: 0,
    import: 0,
    export: 0,
    children: menu.children?.map(resetActionsExceptView)
  })

  const togglePermission = (
    menuId: string,
    action: ActionType,
    checked: boolean
  ) => {
    setState(prev => ({
      ...prev,
      menu: prev.menu.map(menu => {
        if (menu.menu_id !== menuId) return menu

        if (action === 'view' && !checked) {
          return {
            ...resetActionsExceptView(menu),
            view: 0
          }
        }

        if (action !== 'view' && checked) {
          return {
            ...menu,
            view: 1,
            [action]: 1
          }
        }

        return {
          ...menu,
          [action]: checked ? 1 : 0
        }
      })
    }))
  }

  const renderMenu = (items: MenuItem[], level = 0) =>
  items.map(item => (
    <Fragment key={item.menu_id}>
      <tr className="hover:bg-gray-50">
        <td className="px-3 py-2">
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: level * 20 }}
          >
            {item.menu_icon && <i className={item.menu_icon} />}
            <span className={level === 0 ? 'font-semibold' : ''}>
              {item.menu_name}
            </span>
          </div>
        </td>

        {actions.map(action => (
          <td key={action} className="px-3 py-2 text-center">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={
                permissionMap[item.menu_id]?.[action] === 1 ||
                hasAnyChecked(item, action, permissionMap)
              }
              disabled={action !== 'view' && permissionMap[item.menu_id]?.view === 0}
              onChange={e =>
                togglePermission(item.menu_id, action, e.target.checked)
              }
            />
          </td>
        ))}
      </tr>

      {Array.isArray(item.children) &&
        renderMenu(item.children, level + 1)}
    </Fragment>
  ))

  const onSubmit = () => {
    if (loading) return
    setLoading(true)

    const payload = {
      role_id: {
        value: state.role_id,
        label: state.role_name,
      },
      menu: state.menu.filter(menu =>
        actions.some(action => menu[action] === 1)
      ),
    }

    submittedMenuRef.current = payload

    dispatch(postRoleMenu([payload]))
  }

  const fields = () => [
    field({
      type: 'text',
      key: 'role_name',
      label: 'Role Name',
      placeholder: 'Input role name',
      required: true,
      readOnly: true,
    }),
    field({
      type: 'custom',
      key: 'menu',
      render: () => (
        <table className="table w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left">Menu</th>
              {actions.map(action => (
                <th key={action} className="px-3 py-2 text-center">
                  <div className="capitalize">{action}</div>
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={isAllChecked(action)}
                    ref={el => {
                      if (el) el.indeterminate = isSomeChecked(action)
                    }}
                    onChange={e => onCheckAll(action, e.target.checked)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderMenu(navigation)}
          </tbody>
        </table>
      )
    }),
    fieldBuildSubmit({ onCancel, loading })
  ]

  return (
    <Card>
      <CardHeader title="Form Role" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {formColumn({
            control,
            errors,
            state,
            setState,
            fields: fields()
          })}
        </form>
      </CardContent>
    </Card>
  )
}

export default FormValidationBasic
