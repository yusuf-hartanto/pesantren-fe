// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getComplaint, deleteComplaint } from '../store/action'
import { getArticle } from '@src/views/backend/article/store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Media } from 'reactstrap'
import { MoreVertical, Trash2, Archive, Eye, Edit2, Link2, CheckCircle } from 'react-feather'
import { FormattedMessage } from 'react-intl'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import logoDefault from '@src/assets/images/avatars/picture-blank.png'
import moment from 'moment/moment'

const MySwal = withReactContent(Swal)

const statusObj = {
  1: {
    color: 'light-warning',
    value: 'Pengaduan'
  },
  2: {
    color: 'light-success',
    value: 'Verifikasi'
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
            <DropdownItem
              tag={Link}
              to={'#'}
              className='w-100'
              onClick={() => {
                const http = row.link_berita.includes('http') ? '' : 'https://'
                window.open(`${http + row.link_berita}`, '_blank')
              }}
            >
              <Link2 size={14} className='mr-50' />
              <span className='align-middle'>Link Berita</span>
            </DropdownItem>
            {ability.can('edit', 'complaint') &&
              <DropdownItem
                tag={Link}
                to={`/complaint/edit/${row.id}`}
                className='w-100'
                onClick={() => store.dispatch(getComplaint(row))}
              >
                <CheckCircle size={14} className='mr-50' />
                <span className='align-middle'>Verifikasi</span>
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
      name: 'Jenis Aduan',
      minWidth: '200px',
      selector: 'jenis_aduan',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.jenis_aduan}
        </div>
      )
    },
    {
      name: 'Judul',
      minWidth: '400px',
      selector: 'title',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center hide-long-text'>
          {row.title}
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
          {row.province?.name}
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
          {row.regency?.name}
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
      name: 'Provinsi Penulis',
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
      name: 'Kota / Kabupaten Penulis',
      minWidth: '150px',
      selector: 'regency',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.author.regency}
        </div>
      )
    },
    {
      name: 'Tanggal Buat Laporan',
      minWidth: '200px',
      selector: 'created_date',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {moment(row.created_date).format('DD-MM-YYYY HH:mm')}
        </div>
      )
    }
  ]
}
