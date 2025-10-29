// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getReportArticle, deleteReportArticle } from '../store/action'
import { getArticle } from '@src/views/backend/article/store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Media } from 'reactstrap'
import { MoreVertical, Trash2, Archive, Eye, CheckCircle, Link2 } from 'react-feather'
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
      store.dispatch(deleteReportArticle(row.id))
    }
  })
}

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

const statusObjArticle = {
  1: {
    color: 'light-success',
    value: 'Publish'
  },
  2: {
    color: 'light-warning',
    value: 'Unpublish'
  },
  3: {
    color: 'light-secondary',
    value: 'Draft'
  },
  4: {
    color: 'light-warning',
    value: 'Dilaporkan'
  },
  5: {
    color: 'light-danger',
    value: 'Suspend'
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
                window.open(`${process.env.REACT_APP_BASE_FE_URL}/forum/${row.article?.slug}`, '_blank')
              }}
            >
              <Link2 size={14} className='mr-50' />
              <span className='align-middle'>Link Artikel</span>
            </DropdownItem>
            {ability.can('edit', 'report_article') &&
              <DropdownItem
                tag={Link}
                to={`/report_article/edit/${row.id}`}
                className='w-100'
                onClick={() => {
                  store.dispatch(getArticle(row.article))
                  store.dispatch(getReportArticle(row))
                }}
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
      minWidth: '50px',
      selector: 'status',
      sortable: false,
      cell: row => (
        <Badge className='text-capitalize' color={statusObj[row.status]?.color} pill>
          {statusObj[row.status]?.value}
        </Badge>
      )
    },
    {
      name: 'Status Artikel',
      minWidth: '50px',
      selector: 'status',
      sortable: false,
      cell: row => (
        <Badge className='text-capitalize' color={statusObjArticle[row.article?.status]?.color} pill>
          {statusObjArticle[row.article?.status]?.value}
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
          <Media object className='rounded mr-50' src={`${process.env.REACT_APP_BASE_URL}${row.article?.path_thumbnail ?? ''}`} onError={(e) => (e.target.src = logoDefault)} height='50' width='50' />
        </div>
      )
    },
    {
      name: 'Jenis Laporan',
      minWidth: '150px',
      selector: 'jenis_laporan',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.jenis_laporan}
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
          {row.article?.title}
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
