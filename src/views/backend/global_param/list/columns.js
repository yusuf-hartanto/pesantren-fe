// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getGlobalParam, deleteGlobalParam } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { MoreVertical, Trash2, Archive } from 'react-feather'
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
      store.dispatch(deleteGlobalParam(row.id))
    }
  })
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
      minWidth: '100px',
      cell: row => (
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu right>
            {ability.can('edit', 'global_param') &&
              <DropdownItem
                tag={Link}
                to={`/global_param/edit/${row.id}`}
                className='w-100'
                onClick={() => store.dispatch(getGlobalParam(row))}
              >
                <Archive size={14} className='mr-50' />
                <span className='align-middle'>Edit</span>
              </DropdownItem>
            }
            {ability.can('delete', 'global_param') &&
              <DropdownItem className='w-100' onClick={() => handleDelete(row)}>
                <Trash2 size={14} className='mr-50' />
                <span className='align-middle'><FormattedMessage id='Delete'/></span>
              </DropdownItem>
            }
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    },
    {
      name: 'Status',
      minWidth: '100px',
      selector: 'status',
      sortable: false,
      cell: row => (
        <Badge className='text-capitalize' color={statusObj[row.status]?.color} pill>
          {statusObj[row.status]?.value}
        </Badge>
      )
    },
    {
      name: 'Param Key',
      minWidth: '200px',
      selector: 'param_key',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.param_key}
        </div>
      )
    },
    {
      name: 'Param Value',
      minWidth: '200px',
      selector: 'param_value',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center hide-long-text'>
          {row.param_value}
        </div>
      )
    },
    {
      name: 'Param description',
      minWidth: '300px',
      selector: 'param_desc',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center hide-long-text'>
          {row.param_desc}
        </div>
      )
    }
  ]
}
