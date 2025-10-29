// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getContent, deleteContent } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Media } from 'reactstrap'
import { MoreVertical, Trash2, Archive } from 'react-feather'
import { FormattedMessage } from 'react-intl'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import logoDefault from '@src/assets/images/avatars/picture-blank.png'

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
      store.dispatch(deleteContent(row.id))
    }
  })
}

const statusObj = {
  1: {
    color: 'light-success',
    value: 'Active'
  },
  2: {
    color: 'light-danger',
    value: 'Deactive'
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
      maxWidth: '50px',
      cell: row => (
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu right>
            {ability.can('edit', 'content') &&
              <DropdownItem
                tag={Link}
                to={`/content/edit/${row.id}`}
                className='w-100'
                onClick={() => store.dispatch(getContent(row))}
              >
                <Archive size={14} className='mr-50' />
                <span className='align-middle'>Edit</span>
              </DropdownItem>
            }
            {ability.can('delete', 'content') &&
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
      maxWidth: '50px',
      selector: 'status',
      sortable: false,
      cell: row => (
        <Badge className='text-capitalize' color={statusObj[row.status]?.color} pill>
          {statusObj[row.status]?.value}
        </Badge>
      )
    },
    {
      name: 'Image',
      maxWidth: '50px',
      selector: 'image',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          <Media object className='rounded mr-50' src={`${process.env.REACT_APP_BASE_URL}${row.image ?? ''}`} onError={(e) => (e.target.src = logoDefault)} height='50' width='50' />
        </div>
      )
    },
    {
      name: 'Header',
      maxWidth: '200px',
      selector: 'header',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center hide-long-text'>
          {row.header}
        </div>
      )
    },
    {
      name: 'Judul',
      maxWidth: '300px',
      selector: 'title',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center hide-long-text'>
          {row.title}
        </div>
      )
    },
    {
      name: 'Deskripsi Pendek',
      maxWidth: '200px',
      selector: 'sort_description',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center hide-long-text'>
          {row.sort_description}
        </div>
      )
    },
    {
      name: 'Urutan',
      maxWidth: '50px',
      selector: 'seq',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.seq}
        </div>
      )
    }
  ]
}
