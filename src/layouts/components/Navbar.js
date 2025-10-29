// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Dropdowns Imports
import UserDropdown from './navbar/UserDropdown'
import NotificationDropdown from './navbar/NotificationDropdown'

// ** Custom Components
import NavbarBookmarks from './navbar/NavbarBookmarks'

// ** Third Party Components
import { Sun, Moon } from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'

const CustomNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  //** ComponentDidMount
  useEffect(() => {

  }, [])

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>
      <ul className='nav navbar-nav align-items-center ml-auto'>
        <NotificationDropdown />
        <UserDropdown />
      </ul>
    </Fragment>
  )
}

export default CustomNavbar
