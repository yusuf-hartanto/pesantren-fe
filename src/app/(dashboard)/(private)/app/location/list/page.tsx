'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  Box,
  Chip
} from '@mui/material'

import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import {
  deleteLocation,
  fetchLocationPage,
  postExportLocation,
  resetRedux
} from '../slice/index'
import { useCan } from '@/hooks/useCan'

import { tableColumn } from '@views/onevour/table/TableViewBuilder'
import TableView from '@views/onevour/table/TableView'
import DialogDelete from '@views/onevour/components/dialog-delete'

/* -----------------------------------------------------------
   RowAction: Menggunakan id_lokasi
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
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          component={Link}
          href={`/app/location/form?id=${row.id_lokasi}&view=true`}
          onClick={handleClose}
        >
          <i className='tabler-eye' style={{ marginRight: 8 }} /> View
        </MenuItem>

        {/* {canEdit && ( */}
        <MenuItem
          component={Link}
          href={`/app/location/form?id=${row.id_lokasi}`}
          onClick={handleClose}
        >
          <i className='tabler-edit' style={{ marginRight: 8 }} /> Edit
        </MenuItem>
        {/* )} */}

        {canDelete && (
          <MenuItem onClick={() => setOpenConfirm(true)} sx={{ color: 'error.main' }}>
            <i className='tabler-trash' style={{ marginRight: 8 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      <DialogDelete
        id={row.nama_lokasi}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        handleOk={() => {
          onDeleteSuccess(row.id_lokasi)
          setOpenConfirm(false)
        }}
        handleClose={() => setOpenConfirm(false)}
      />
    </TableCell>
  )
}

/* -----------------------------------------------------------
   Main Component
----------------------------------------------------------- */
const LocationList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.location)

  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [loadingExport, setLoadingExport] = useState(false)

  const fetchData = useCallback(() => {
    // Pastikan params dikirim sebagai keyword agar dibaca oleh Repository
    dispatch(fetchLocationPage({ page, perPage, keyword: filter }))
  }, [dispatch, page, perPage, filter])

  useEffect(() => {
    const timer = setTimeout(fetchData, 500)
    return () => clearTimeout(timer)
  }, [fetchData])

  useEffect(() => {
    if (store.delete) {
      toast.success('Data lokasi berhasil dihapus')
      fetchData()
      dispatch(resetRedux())
    }
  }, [store.delete, dispatch, fetchData])

  const renderOption = (row: any) => {
    return <RowAction row={row} onDeleteSuccess={(id) => dispatch(deleteLocation(id))} />
  }

  const buildTable = () => {
    const { dataPage } = store
    const values = dataPage?.values || []

    return {
      page: page,
      fields: [
        tableColumn('OPTION', 'act-x', 'left', renderOption as any),
        tableColumn('KODE', 'kode_lokasi'),
        tableColumn('NAMA LOKASI', 'nama_lokasi'),
        tableColumn('JENIS', 'jenis_display'),
        tableColumn('INDUK LOKASI', 'parent_display'), // Self-referencing display
        tableColumn('KAPASITAS', 'kapasitas_display'),
      ],
      values: values.map((row: any) => ({
        ...row,
        // Chip untuk Jenis Lokasi
        jenis_display: (
          <Chip
            label={row.jenis_lokasi}
            size='small'
            variant='tonal'
            color='primary'
            sx={{ fontWeight: 500 }}
          />
        ),
        // Menampilkan Nama Parent (Induk Lokasi)
        parent_display: (
          <Typography variant='body2' sx={{ color: row.parent ? 'text.primary' : 'text.disabled' }}>
            {row.parent?.nama_lokasi || '-'}
          </Typography>
        ),
        // Menampilkan Kapasitas & Lantai
        kapasitas_display: (
          <Box>
            <Typography variant='body2'>{row.kapasitas ? `${row.kapasitas} Orang` : '-'}</Typography>
            <Typography variant='caption' color='text.disabled'>
              {row.lantai ? `Lantai ${row.lantai}` : ''}
            </Typography>
          </Box>
        )
      })),
      count: dataPage?.total || 0,
      perPage: perPage,
      changePage: (_: any, n: number) => setPage(n + 1),
      changePerPage: (e: any) => {
        setPerPage(parseInt(e.target.value, 10))
        setPage(1)
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Card>
          <CardHeader title='Master Data Lokasi' />
          <Toolbar sx={{ gap: 2, mb: 4, px: '1.5rem !important' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                onClick={() => router.push('/app/location/form')}
              >
                Tambah
              </Button>
            </Box>
            <Typography sx={{ flex: '1 1 auto' }} />
            <TextField
              size='small'
              placeholder='Cari lokasi, jenis, atau induk...'
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

export default LocationList
