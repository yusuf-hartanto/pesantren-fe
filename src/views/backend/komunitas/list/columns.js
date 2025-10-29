// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getKomunitas, deleteKomunitas } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Media } from 'reactstrap'
import { MoreVertical, Trash2, Archive } from 'react-feather'
import { FormattedMessage } from 'react-intl'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import logoDefault from '@src/assets/images/avatars/picture-blank.png'
import moment from 'moment/moment'

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
      store.dispatch(deleteKomunitas(row.id))
    }
  })
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
      maxWidth: '50px',
      cell: row => (
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu right>
            {ability.can('edit', 'komunitas') &&
              <DropdownItem
                tag={Link}
                to={`/komunitas/edit/${row.id}`}
                className='w-100'
                onClick={() => store.dispatch(getKomunitas(row))}
              >
                <Archive size={14} className='mr-50' />
                <span className='align-middle'>Edit</span>
              </DropdownItem>
            }
            {ability.can('delete', 'komunitas') &&
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
      name: 'Icon',
      maxWidth: '50px',
      selector: 'icon_image',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          <Media object className='rounded mr-50' src={`${process.env.REACT_APP_BASE_URL}${row.icon_image ?? ''}`} onError={(e) => (e.target.src = logoDefault)} height='50' width='50' />
        </div>
      )
    },
    {
      name: 'Nama Komunitas',
      minWidth: '70%',
      selector: 'komunitas_name',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.komunitas_name}
        </div>
      )
    },
    {
      name: 'Urutan',
      minWidth: '200px',
      selector: 'show_order',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.show_order}
        </div>
      )
    }
  ]
}
