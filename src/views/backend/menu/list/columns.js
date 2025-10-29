// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getMenu, deleteMenu } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import * as Feather from 'react-feather'
import { FormattedMessage } from 'react-intl'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const handleDelete = (row) => {
  return MySwal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger ml-1'
    },
    buttonsStyling: false
  }).then(function (result) {
    if (result.value) {
      store.dispatch(deleteMenu(row.menu_id))
    }
  })
}

// ** Renders Menu Columns
const renderMenu = row => {

  const Icon = row.menu_icon ? Feather[row.menu_icon] : Feather['Circle']

  return (
    <span className='text-truncate align-middle'>
      <Icon size={18} className={`text-primary mr-50`} />
      {row.menu_name}
    </span>
  )
}

const statusObj = {
  1: {
    color: 'light-success',
    value: 'Active'
  },
  2: {
    color: 'light-secondary',
    value: 'Not Active'
  }
}

export const columns = (number, ability) => {
  return [
    {
      name: '#',
      cell: (row, index) => (index + 1) + number,
      grow: 0
    },
    {
      name: 'Actions',
      maxWidth: '10%',
      cell: row => (
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <Feather.MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu right>
            {ability.can('edit', 'menu') &&
              <DropdownItem
                tag={Link}
                to={`/menu/edit/${row.menu_id}`}
                className='w-100'
                onClick={() => store.dispatch(getMenu(row))}
              >
                <Feather.Archive size={14} className='mr-50' />
                <span className='align-middle'>Edit</span>
              </DropdownItem>
            }
            {ability.can('delete', 'menu') &&
              <DropdownItem className='w-100' onClick={() => handleDelete(row)}>
                <Feather.Trash2 size={14} className='mr-50' />
                <span className='align-middle'><FormattedMessage id='Delete'/></span>
              </DropdownItem>
            }
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    },
    {
      name: 'Status',
      maxWidth: '10%',
      selector: 'status',
      sortable: false,
      cell: row => (
        <Badge className='text-capitalize' color={statusObj[row.status]?.color} pill>
          {statusObj[row.status]?.value}
        </Badge>
      )
    },
    {
      name: 'Menu',
      minWidth: '100px',
      selector: 'menu_name',
      sortable: false,
      cell: row => renderMenu(row)
    }
  ]
}
