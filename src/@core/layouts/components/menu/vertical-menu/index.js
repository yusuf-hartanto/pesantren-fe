// ** React Imports
import { Fragment, useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as Feather from 'react-feather'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Vertical Menu Components
import VerticalMenuHeader from './VerticalMenuHeader'
import VerticalNavMenuItems from './VerticalNavMenuItems'

// ** Store & Actions
import { getAllDataNavigation } from '@src/navigation/store/action'

const Sidebar = props => {

  // ** States & Vars
  const store = useSelector(state => state.navigations),
    dispatch = useDispatch()

  // ** Props
  const { menuCollapsed, routerProps, menu, currentActiveItem, skin } = props

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [navigations, setNavigations] = useState([])

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    if (menuCollapsed) {
      setMenuHover(true)
    }
  }

  // ** Scroll Menu
  const scrollMenu = container => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.add('d-block')
      }
    } else {
      if (shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.remove('d-block')
      }
    }
  }

  useEffect(() => {
    dispatch(getAllDataNavigation())
  }, [])

  useEffect(() => {
    if (store.allData.length > 0) {

      const menus = store.allData.map(r => {
        const Icon = r.menu_icon ? Feather[r.menu_icon] : Feather['Circle']

        if (r.children?.length > 0) {

          return {
            id: `${r.module_name}-${r.menu_id}`,
            title: r.menu_name,
            icon: <Icon size={20} />,
            navLink: `/${r.module_name}/list`,
            action: 'read',
            resource: r.module_name !== '#' ? r.module_name.toLowerCase() : `#${r.menu_id}`,
            children: r.children.map(rs => {

              const Icon = rs.menu_icon ? Feather[rs.menu_icon] : Feather['Circle']

              if (rs.children?.length > 0) {
                return {
                  id: `${rs.module_name}-${rs.menu_id}`,
                  title: rs.menu_name,
                  icon: <Icon size={20} />,
                  navLink: `/${rs.module_name}/list`,
                  action: 'read',
                  resource: rs.module_name !== '#' ? rs.module_name.toLowerCase() : `#${rs.menu_id}`,
                  children: rs.children.map(res => {

                    const Icon = res.menu_icon ? Feather[res.menu_icon] : Feather['Circle']

                    return {
                      id: `${res.module_name}-${res.menu_id}`,
                      title: res.menu_name,
                      icon: <Icon size={20} />,
                      navLink: `/${res.module_name}/list`,
                      action: 'read',
                      resource: res.module_name !== '#' ? res.module_name.toLowerCase() : `#${res.menu_id}`
                    }
                  })
                }
              } else {
                return {
                  id: `${rs.module_name}-${rs.menu_id}`,
                  title: rs.menu_name,
                  icon: <Icon size={20} />,
                  navLink: `/${rs.module_name}/list`,
                  action: 'read',
                  resource: rs.module_name !== '#' ? rs.module_name.toLowerCase() : `#${rs.menu_id}`
                }
              }
            })
          }
        } else {
          return {
            id: `${r.module_name}-${r.menu_id}`,
            title: r.menu_name,
            icon: <Icon size={20} />,
            navLink: `/${r.module_name}/list`,
            action: 'read',
            resource: r.module_name !== '#' ? r.module_name.toLowerCase() : `#${r.menu_id}`
          }
        }
      })

      setNavigations([...menus])
    }
  }, [store.allData])

  return (
    <Fragment>
      <div
        className={classnames('main-menu menu-fixed menu-accordion menu-shadow', {
          expanded: menuHover || menuCollapsed === false,
          'menu-light': skin !== 'semi-dark' && skin !== 'dark',
          'menu-dark': skin === 'semi-dark' || skin === 'dark'
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setMenuHover(false)}
      >
        {menu ? (
          menu(props)
        ) : (
          <Fragment>
            {/* Vertical Menu Header */}
            <VerticalMenuHeader setGroupOpen={setGroupOpen} menuHover={menuHover} {...props} />
            {/* Vertical Menu Header Shadow */}
            <div className='shadow-bottom' ref={shadowRef}></div>
            {/* Perfect Scrollbar */}
            <PerfectScrollbar
              className='main-menu-content'
              options={{ wheelPropagation: false }}
              onScrollY={container => scrollMenu(container)}
            >
              <ul className='navigation navigation-main'>
                {navigations.length > 0 &&
                  <VerticalNavMenuItems
                    items={navigations}
                    groupActive={groupActive}
                    setGroupActive={setGroupActive}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    groupOpen={groupOpen}
                    setGroupOpen={setGroupOpen}
                    routerProps={routerProps}
                    menuCollapsed={menuCollapsed}
                    menuHover={menuHover}
                    currentActiveItem={currentActiveItem}
                  />
                }
              </ul>
            </PerfectScrollbar>
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default Sidebar
