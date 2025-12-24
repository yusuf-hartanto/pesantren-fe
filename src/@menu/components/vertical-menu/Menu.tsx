'use client'

// React Imports
import { createContext, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ForwardRefRenderFunction, MenuHTMLAttributes, MutableRefObject, ReactElement, ReactNode } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'
import { FloatingTree } from '@floating-ui/react'
import type { CSSObject } from '@emotion/styled'

// Type Imports
import type {
  ChildrenType,
  MenuItemStyles,
  RootStylesType,
  RenderExpandIconParams,
  RenderExpandedMenuItemIcon
} from '../../types'

// Hook Imports
import useVerticalNav from '../../hooks/useVerticalNav'

// Util Imports
import { menuClasses } from '../../utils/menuClasses'

// Styled Component Imports
import StyledVerticalMenu from '../../styles/vertical/StyledVerticalMenu'

// Style Imports
import styles from '../../styles/styles.module.css'

// Default Config Imports
import { verticalSubMenuToggleDuration } from '../../defaultConfigs'

export type MenuSectionStyles = {
  root?: CSSObject
  label?: CSSObject
  prefix?: CSSObject
  suffix?: CSSObject
  icon?: CSSObject
}

export type OpenSubmenu = {
  level: number
  label: ReactNode
  active: boolean
  id: string
}

export type VerticalMenuContextProps = {
  browserScroll?: boolean
  triggerPopout?: 'hover' | 'click'
  transitionDuration?: number
  menuSectionStyles?: MenuSectionStyles
  menuItemStyles?: MenuItemStyles
  subMenuOpenBehavior?: 'accordion' | 'collapse'
  renderExpandIcon?: (params: RenderExpandIconParams) => ReactElement
  renderExpandedMenuItemIcon?: RenderExpandedMenuItemIcon
  collapsedMenuSectionLabel?: ReactNode
  popoutMenuOffset?: {
    mainAxis?: number | ((params: { level?: number }) => number)
    alignmentAxis?: number | ((params: { level?: number }) => number)
  }
  textTruncate?: boolean

  /**
   * @ignore
   */
  openSubmenu?: OpenSubmenu[]

  /**
   * @ignore
   */
  openSubmenusRef?: MutableRefObject<OpenSubmenu[]>

  /**
   * @ignore
   */
  toggleOpenSubmenu?: (...submenus: { level: number; label: ReactNode; active?: boolean; id: string }[]) => void
}

export type MenuProps = VerticalMenuContextProps &
  RootStylesType &
  Partial<ChildrenType> &
  MenuHTMLAttributes<HTMLMenuElement> & {
    popoutWhenCollapsed?: boolean
  }

export const VerticalMenuContext = createContext({} as VerticalMenuContextProps)

const Menu: ForwardRefRenderFunction<HTMLMenuElement, MenuProps> = (props, ref) => {
  // Props
  const {
    children,
    className,
    rootStyles,
    menuItemStyles,
    renderExpandIcon,
    renderExpandedMenuItemIcon,
    menuSectionStyles,
    browserScroll = false,
    triggerPopout = 'hover',
    popoutWhenCollapsed = false,
    subMenuOpenBehavior = 'accordion', // accordion, collapse
    transitionDuration = verticalSubMenuToggleDuration,
    collapsedMenuSectionLabel = '-',
    popoutMenuOffset = { mainAxis: 0 },
    textTruncate = true,
    ...rest
  } = props

  // States
  const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu[]>([])

  // Refs
  const openSubmenusRef = useRef<OpenSubmenu[]>([])

  // Hooks
  const pathname = usePathname()
  const { updateVerticalNavState } = useVerticalNav()

  const toggleOpenSubmenu = useCallback(
    (...submenus: { level: number; label: ReactNode; active?: boolean; id: string }[]): void => {
      if (!submenus.length) return

      const openSubmenuCopy: OpenSubmenu[] = [...openSubmenu]
      const isAccordion = subMenuOpenBehavior === 'accordion'

      submenus.forEach(({ level, label, active = false, id }) => {
        if (!id) return
        
        const submenuIndex = openSubmenuCopy.findIndex(submenu => submenu.id === id)
        const submenuExists = submenuIndex >= 0

        // Delete submenu if it exists
        if (submenuExists) {
          openSubmenuCopy.splice(submenuIndex, 1)

          return
        }

          // ✅ ACCORDION: close sibling (LEVEL SAMA)
        if (isAccordion) {
          for (let i = openSubmenuCopy.length - 1; i >= 0; i--) {
            if (openSubmenuCopy[i].level === level) {
              openSubmenuCopy.splice(i, 1)
            }
          }
        }

        // ✅ OPEN
        openSubmenuCopy.push({ level, label, active, id })
      })

      setOpenSubmenu(openSubmenuCopy)
    },
    [openSubmenu, subMenuOpenBehavior]
  )

  const menuData = useMemo(() => {
    if (!children || typeof children !== 'object') return []
    const el = children as any

    return  Array.isArray(el.props?.menuData)
      ? el.props.menuData
      : []
  }, [children])

  const isPathMatch = useCallback(
  (itemPath?: string) => {
    if (!itemPath) return false

    return pathname.startsWith(itemPath)
  }, [pathname])

  useEffect(() => {
    const nextOpen: OpenSubmenu[] = []

    const walk = (items: any[], level = 0) => {
      items.forEach(item => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          const activeChild = item.children.some((child: any) =>
            isPathMatch(child.href)
          )

          if (activeChild && item.id != null) {
            nextOpen.push({
              id: item.id,
              label: item.label,
              level,
              active: true
            })

            walk(item.children, level + 1)
          }
        }
      })
    }

    if (menuData.length > 0) {
      walk(menuData)
    }

    setOpenSubmenu(nextOpen)

  }, [pathname, menuData, isPathMatch])

  // UseEffect, update verticalNav state to set initial values and update values on change
  useEffect(() => {
    updateVerticalNavState({
      isPopoutWhenCollapsed: popoutWhenCollapsed
    })
  }, [popoutWhenCollapsed, updateVerticalNavState])

  const providerValue = useMemo(
    () => ({
      browserScroll,
      triggerPopout,
      transitionDuration,
      menuItemStyles,
      menuSectionStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      openSubmenu,
      openSubmenusRef,
      toggleOpenSubmenu,
      subMenuOpenBehavior,
      collapsedMenuSectionLabel,
      popoutMenuOffset,
      textTruncate
    }),
    [
      browserScroll,
      triggerPopout,
      transitionDuration,
      menuItemStyles,
      menuSectionStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      openSubmenu,
      openSubmenusRef,
      toggleOpenSubmenu,
      subMenuOpenBehavior,
      collapsedMenuSectionLabel,
      popoutMenuOffset,
      textTruncate
    ]
  )

  return (
    <VerticalMenuContext.Provider value={providerValue}>
      <FloatingTree>
        <StyledVerticalMenu
          ref={ref}
          className={classnames(menuClasses.root, className)}
          rootStyles={rootStyles}
          {...rest}
        >
          <ul className={styles.ul}>{children}</ul>
        </StyledVerticalMenu>
      </FloatingTree>
    </VerticalMenuContext.Provider>
  )
}

export default forwardRef(Menu)
