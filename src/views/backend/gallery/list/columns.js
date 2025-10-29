// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getGallery, deleteGallery } from '../store/action'
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
      store.dispatch(deleteGallery(row.id))
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
            {ability.can('edit', 'gallery') &&
              <DropdownItem
                tag={Link}
                to={`/gallery/edit/${row.id}`}
                className='w-100'
                onClick={() => store.dispatch(getGallery(row))}
              >
                <Archive size={14} className='mr-50' />
                <span className='align-middle'>Edit</span>
              </DropdownItem>
            }
            {ability.can('delete', 'gallery') &&
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
      name: 'Thumbnail',
      maxWidth: '50px',
      selector: 'path_thumbnail',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          <Media object className='rounded mr-50' src={`${process.env.REACT_APP_BASE_URL}${row.path_thumbnail ?? ''}`} onError={(e) => (e.target.src = logoDefault)} height='50' width='50' />
        </div>
      )
    },
    {
      name: 'Album',
      maxWidth: '400px',
      selector: 'folder_name',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center hide-long-text'>
          {row.folder_name}
        </div>
      )
    },
    {
      name: 'Penulis',
      minWidth: '150px',
      selector: 'author',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.author.full_name}
        </div>
      )
    },
    {
      name: 'Provinsi',
      minWidth: '150px',
      selector: 'province',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.author.province}
        </div>
      )
    },
    {
      name: 'Kota / Kabupaten',
      minWidth: '150px',
      selector: 'regency',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.author.regency}
        </div>
      )
    }
  ]
}
