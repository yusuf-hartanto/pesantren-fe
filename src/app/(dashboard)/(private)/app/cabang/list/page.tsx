'use client'

// ** React Imports
import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ** MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import {
  TextField,
  Toolbar,
  Button,
  Typography,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  Box
} from '@mui/material'

// ** Third Party Imports
import { toast } from 'react-toastify'

// ** Redux & Hooks
import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import {
  deleteCabang,
  fetchCabangPage,
  postExportCabang,
  resetRedux
} from '../slice/index'
import { useCan } from '@/hooks/useCan'

// ** Custom Components
import { tableColumn } from '@views/onevour/table/TableViewBuilder'
import TableView from '@views/onevour/table/TableView'
import DialogDelete from '@views/onevour/components/dialog-delete'

// ** Icons
import '@assets/iconify-icons/generated-icons.css'

/* -----------------------------------------------------------
   Component: RowAction
   Menangani menu Edit, View, dan Delete per baris
----------------------------------------------------------- */
const RowAction = ({ row, onDeleteSuccess }: { row: any; onDeleteSuccess: (id: string) => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const canEdit = useCan('edit')
  const canDelete = useCan('delete')

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <TableCell size='small' sx={{ borderBottom: 0 }}>
      <IconButton size='small' onClick={handleOpen}>
        <i className='tabler-dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          component={Link}
          href={`/app/cabang/form?id=${row.id_cabang}&view=true`}
          onClick={handleClose}
        >
          <i className='tabler-eye' style={{ marginRight: 8 }} /> View
        </MenuItem>

        {canEdit && (
          <MenuItem
            component={Link}
            href={`/app/cabang/form?id=${row.id_cabang}`}
            onClick={handleClose}
          >
            <i className='tabler-edit' style={{ marginRight: 8 }} /> Edit
          </MenuItem>
        )}

        {canDelete && (
          <MenuItem onClick={() => setOpenConfirm(true)} sx={{ color: 'error.main' }}>
            <i className='tabler-trash' style={{ marginRight: 8 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      <DialogDelete
        id={row.nama_cabang}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        handleOk={() => {
          onDeleteSuccess(row.id_cabang)
          setOpenConfirm(false)
        }}
        handleClose={() => setOpenConfirm(false)}
      />
    </TableCell>
  )
}

/* -----------------------------------------------------------
   Main Component: CabangList
----------------------------------------------------------- */
const CabangList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.cabang)

  // Permission Hooks
  const canCreate = useCan('create')
  const canImport = useCan('import')
  const canExport = useCan('export')

  // Local States
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [loadingExport, setLoadingExport] = useState(false)

  // Fetch Data Logic
  const fetchData = useCallback(() => {
    dispatch(fetchCabangPage({ page, perPage, q: filter }))
  }, [dispatch, page, perPage, filter])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchData])

  // Handle Action Success
  useEffect(() => {
    if (store.delete) {
      toast.success('Data cabang berhasil dihapus')
      fetchData()
      dispatch(resetRedux())
    }
  }, [store.delete, dispatch, fetchData])

  const handleDelete = (id: string) => {
    dispatch(deleteCabang(id))
  }

  // Logic Export CSV
  const handleExport = async () => {
    try {
      setLoadingExport(true)
      const res = await dispatch(postExportCabang({ q: filter })).unwrap()
      if (res?.data) {
        window.open(`${process.env.NEXT_PUBLIC_API_URL}${res.data}`, '_blank')
        toast.success('Export berhasil dimulai')
      } else {
        toast.error(res?.message || 'Gagal export data')
      }
    } catch {
      toast.error('Terjadi kesalahan sistem saat export')
    } finally {
      setLoadingExport(false)
    }
  }

  /* -----------------------------------------------------------
     Table Builder
  ----------------------------------------------------------- */
  const renderOption = (row: any) => {
    return <RowAction row={row} onDeleteSuccess={handleDelete} />
  }

  const buildTable = () => {
    const { dataPage } = store
    const values = dataPage?.values || []
    const total = dataPage?.total || 0

    return {
      page: page,
      fields: [
        tableColumn('OPTION', 'act-x', 'left', renderOption as any),
        tableColumn('NAMA CABANG', 'nama_cabang'),
        tableColumn('KONTAK', 'contact_display'),
        tableColumn('WILAYAH', 'wilayah_display'),
        tableColumn('ALAMAT', 'alamat_summary'),
        tableColumn('TGL UPDATE', 'updated_at'),
      ],
      values: values.map((row: any) => ({
        ...row,
        // Custom display untuk Kontak & Email
        contact_display: (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>{row.contact || '-'}</Typography>
            <Typography variant='caption' color='text.secondary'>{row.email || '-'}</Typography>
          </Box>
        ),
        // Custom display untuk Nama Kota & Provinsi
        wilayah_display: (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='body2'>{row.city?.name || '-'}</Typography>
            <Typography variant='caption' color='text.disabled'>{row.province?.name || '-'}</Typography>
          </Box>
        ),
        // Ringkasan Alamat
        alamat_summary: (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='body2'>
              {row.alamat || '-'}
            </Typography>
          </Box>
        )
      })),
      count: total,
      perPage: perPage,
      changePage: (_: any, newPage: number) => setPage(newPage + 1),
      changePerPage: (event: any) => {
        setPerPage(parseInt(event.target.value, 10))
        setPage(1)
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Card>
          <CardHeader
            title='Daftar Cabang'
            subheader='Kelola informasi kantor cabang dan wilayah area'
          />

          <Toolbar sx={{ gap: 2, mb: 4, px: '1.5rem !important', flexWrap: 'wrap' }}>
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {canCreate && (
                <Button
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  onClick={() => router.push('/app/cabang/form')}
                >
                  Tambah
                </Button>
              )}

              {canImport && (
                <Button
                  color='success'
                  variant='outlined'
                  startIcon={<i className='tabler-upload' />}
                  onClick={() => router.push('/app/cabang/import')}
                >
                  Import
                </Button>
              )}

              {canExport && (
                <Button
                  color='secondary'
                  variant='outlined'
                  startIcon={<i className='tabler-download' />}
                  onClick={handleExport}
                  disabled={loadingExport}
                >
                  {loadingExport ? 'Processing...' : 'Export'}
                </Button>
              )}
            </Box>

            <Typography sx={{ flex: '1 1 auto' }} />

            {/* Search Filter */}
            <TextField
              size='small'
              placeholder='Cari cabang...'
              sx={{ width: { xs: '100%', sm: 250 } }}
              onChange={(e) => {
                setFilter(e.target.value)
                setPage(1)
              }}
            />
          </Toolbar>

          <TableView changeSort={() => { }} model={buildTable()} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CabangList
