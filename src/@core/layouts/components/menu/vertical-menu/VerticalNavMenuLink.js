// ** React Imports
import { useEffect, useState } from 'react'
import { NavLink, useLocation, matchPath, useParams } from 'react-router-dom'

// ** Third Party Components
import { Badge, UncontrolledTooltip } from 'reactstrap'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'

import { useSelector } from 'react-redux'

// ** Utils
import { isNavLinkActive, search, getAllParents } from '@layouts/utils'

const VerticalNavMenuLink = ({
  item,
  groupActive,
  setGroupActive,
  activeItem,
  setActiveItem,
  groupOpen,
  setGroupOpen,
  toggleActiveGroup,
  parentItem,
  routerProps,
  currentActiveItem
}) => {

  // ** States & Vars
  const store = useSelector(state => state.navigations)
  const [navigations, setNavigations] = useState([])

  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink

  // ** URL Vars
  const location = useLocation()
  const currentURL = location.pathname

  // ** To match path
  const match = matchPath(currentURL, {
    path: `${item.navLink}/:param`,
    exact: true,
    strict: false
  })

  // ** Search for current item parents
  const searchParents = (navigation, currentURL) => {
    const parents = search(navigation, currentURL, routerProps) // Search for parent object
    const allParents = getAllParents(parents, 'id') // Parents Object to Parents Array
    return allParents
  }

  // ** URL Vars
  const resetActiveGroup = navLink => {
    const parents = search(navigations, navLink, match)
    toggleActiveGroup(item.id, parents)
  }

  // ** Reset Active & Open Group Arrays
  const resetActiveAndOpenGroups = () => {
    setGroupActive([])
    setGroupOpen([])
  }

  // ** Checks url & updates active item
  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(currentActiveItem)
      const arr = searchParents(navigations, currentURL)
      setGroupActive([...arr])
    }
  }, [location])

  useEffect(() => {
    if (store.allData.length > 0) {

      const menus = store.allData.map(r => {

        if (r.children?.length > 0) {
          return {
            id: `${r.module_name}-${r.menu_id}`,
            title: r.menu_name,
            navLink: `/${r.module_name}/list`,
            action: 'read',
            resource: r.module_name !== '#' ? r.module_name.toLowerCase() : `#${r.menu_id}`,
            children: r.children.map(rs => {

              if (rs.children?.length > 0) {
                return {
                  id: `${rs.module_name}-${rs.menu_id}`,
                  title: rs.menu_name,
                  navLink: `/${rs.module_name}/list`,
                  action: 'read',
                  resource: rs.module_name !== '#' ? rs.module_name.toLowerCase() : `#${rs.menu_id}`,
                  children: rs.children.map(res => {

                    return {
                      id: `${res.module_name}-${res.menu_id}`,
                      title: res.menu_name,
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
    <li
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      })}
    >
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
            href: item.navLink || '/'
          }
          : {
            to: item.navLink || '/',
            isActive: (match, location) => {
              if (!match) {
                return false
              }

              if (match.url && match.url !== '' && match.url === item.navLink) {
                currentActiveItem = item.navLink
              }
            }
          })}
        /*eslint-enable */
        onClick={e => {
          if (!item.navLink.length) {
            e.preventDefault()
          }
          parentItem ? resetActiveGroup(item.navLink) : resetActiveAndOpenGroups()
        }}
      >
        {item.icon}
        <span className='menu-item text-truncate' id={`menu-item-${item.id.replace('#-', '')}`}>
          {item.title}
        </span>
        <UncontrolledTooltip placement='right' target={`menu-item-${item.id.replace('#-', '')}`}>
          {item.title}
        </UncontrolledTooltip>
        {item.badge && item.badgeText ? (
          <Badge className='ml-auto mr-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
