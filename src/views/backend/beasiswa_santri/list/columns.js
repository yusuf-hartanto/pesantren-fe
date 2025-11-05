// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getBeasiswaSantri, deleteBeasiswaSantri } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { MoreVertical, Trash2, Archive } from 'react-feather'
import { FormattedMessage } from 'react-intl'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { status } from '../../../../utility/Constants'

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
      store.dispatch(deleteBeasiswaSantri(row.id_beasiswasantri))
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
      minWidth: '100px',
      cell: row => (
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu right>
            {ability.can('edit', 'beasiswa_santri') &&
              <DropdownItem
                tag={Link}
                to={`/beasiswa_santri/edit/${row.id_beasiswasantri}`}
                className='w-100'
                onClick={() => store.dispatch(getBeasiswaSantri(row))}
              >
                <Archive size={14} className='mr-50' />
                <span className='align-middle'>Edit</span>
              </DropdownItem>
            }
            {ability.can('delete', 'beasiswa_santri') &&
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
      maxWidth: '10%',
      selector: 'status',
      sortable: true,
      cell: row => (
        <Badge className='text-capitalize' color={status().find(r => r.value === row.status)?.color} pill>
          {status().find(r => r.value === row.status)?.value}
        </Badge>
      )
    },
    {
      name: 'Kode Beasiswa',
      minWidth: '200px',
      selector: 'kode_beasiswa',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.kode_beasiswa}
        </div>
      )
    },
    {
      name: 'Nama Beasiswa',
      minWidth: '200px',
      selector: 'nama_beasiswa',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.nama_beasiswa}
        </div>
      )
    },
    {
      name: 'Keterangan',
      minWidth: '200px',
      selector: 'keterangan',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center hide-long-text'>
          {row.keterangan}
        </div>
      )
    },
    {
      name: 'Nomor Urut',
      minWidth: '300px',
      selector: 'nomor_urut',
      sortable: true,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center hide-long-text'>
          {row.nomor_urut}
        </div>
      )
    }
  ]
}
