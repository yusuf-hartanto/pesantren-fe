import type { VerticalMenuDataType } from "@/types/menuTypes"

const ROOT_ID = '00000000-0000-0000-0000-000000000000'

export const buildMenuTree = (data: any[]) => {
  const map = new Map()

  data.forEach(item => {
    map.set(item.menu_id, { ...item, children: [] })
  })

  const tree: any[] = []

  map.forEach(item => {
    if (item.parent_id === ROOT_ID) {
      tree.push(item)
    } else {
      const parent = map.get(item.parent_id)

      if (parent) parent.children.push(item)
    }
  })

  const sortRecursive = (nodes: any[]) => {
    nodes.sort((a, b) => a.seq_number - b.seq_number)
    nodes.forEach(n => n.children && sortRecursive(n.children))
  }

  sortRecursive(tree)

  return tree
}

export const flattenMenuTree = (
  nodes: any[],
  level = 0
): any[] => {
  let result: any[] = []

  nodes.forEach(node => {
    result.push({
      ...node,
      __level: level
    })

    if (node.children?.length) {
      result = result.concat(
        flattenMenuTree(node.children, level + 1)
      )
    }
  })

  return result
}

type ApiMenu = {
  menu_id: string
  menu_name: string
  menu_icon: string
  module_name: string
  children?: ApiMenu[]
}

export const mapMenu = (menu: ApiMenu): VerticalMenuDataType => {
  const hasChildren = menu.children && menu.children.length > 0

  return {
    label: menu.menu_name,
    icon: menu.menu_icon ?? 'tabler-circle',
    ...(menu.module_name !== '#' && !hasChildren
      ? { href: menu.module_name }
      : {}),
    ...(hasChildren
      ? {
          children: menu.children!.map(child => mapMenu(child))
        }
      : {})
  }
}
