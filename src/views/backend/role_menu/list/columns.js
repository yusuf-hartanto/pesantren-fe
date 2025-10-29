// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getRoleMenu, deleteRoleMenu } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
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
      store.dispatch(deleteRoleMenu(row.role_menu_id))
    }
  })
}

// ** Renders Role Columns
const renderRole = row => {

  return (
    <span className='text-truncate text-capitalize align-middle'>
      <Feather.User size={18} className={`text-primary mr-50`} />
      {row.role_name}
    </span>
  )
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
      maxWidth: '20%',
      cell: row => (
        <Button 
          tag={Link}
          to={`/role_menu/save`}
          color='secondary' 
          outline
          onClick={() => store.dispatch(getRoleMenu(row))}
          disabled={!ability.can('edit', 'role_menu')}
        >
          Assign Menu
        </Button>
      )
    },
    {
      name: 'Role',
      minWidth: '200px',
      selector: 'role_name',
      sortable: false,
      cell: row => renderRole(row)
    }
  ]
}
