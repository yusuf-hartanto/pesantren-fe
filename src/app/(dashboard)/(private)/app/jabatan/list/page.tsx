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
  deleteJabatan,
  fetchJabatanPage,
  resetRedux
} from '../slice/index'
import { useCan } from '@/hooks/useCan'

import { tableColumn } from '@views/onevour/table/TableViewBuilder'
import TableView from '@views/onevour/table/TableView'
import DialogDelete from '@views/onevour/components/dialog-delete'

/* -----------------------------------------------------------
   RowAction: Menggunakan id_jabatan
----------------------------------------------------------- */
const RowAction = ({ row, onDeleteSuccess }: { row: any; onDeleteSuccess: (id: string) => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const canEdit = true //useCan('edit')
  const canDelete = true // useCan('delete')

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
          href={`/app/jabatan/form?id=${row.id_jabatan}&view=true`}
          onClick={handleClose}
        >
          <i className='tabler-eye' style={{ marginRight: 8 }} /> View
        </MenuItem>

        {canEdit && (
          <MenuItem
            component={Link}
            href={`/app/jabatan/form?id=${row.id_jabatan}`}
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
        id={row.nama_jabatan}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        handleOk={() => {
          onDeleteSuccess(row.id_jabatan)
          setOpenConfirm(false)
        }}
        handleClose={() => setOpenConfirm(false)}
      />
    </TableCell>
  )
}

/* -----------------------------------------------------------
   Main Component: JabatanList
----------------------------------------------------------- */
const JabatanList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.jabatan)

  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const fetchData = useCallback(() => {
    // Mengirim keyword untuk pencarian di Repository Backend
    dispatch(fetchJabatanPage({ page, perPage, keyword: filter }))
  }, [dispatch, page, perPage, filter])

  useEffect(() => {
    const timer = setTimeout(fetchData, 500)
    return () => clearTimeout(timer)
  }, [fetchData])

  useEffect(() => {
    if (store.delete) {
      if (store.delete.status === true) {
        toast.success(store.delete.message || 'Data jabatan berhasil dihapus')
        fetchData()
      } else {
        // Menampilkan error jika jabatan masih memiliki relasi (misal: Pegawai)
        toast.error(store.delete.message || 'Gagal menghapus data')
      }
      dispatch(resetRedux())
    }
  }, [store.delete, dispatch, fetchData])

  const renderOption = (row: any) => {
    return <RowAction row={row} onDeleteSuccess={(id) => dispatch(deleteJabatan(id))} />
  }

  const buildTable = () => {
    const { dataPage } = store
    const values = dataPage?.values || []

    return {
      page: page,
      fields: [
        tableColumn('OPTION', 'act-x', 'left', renderOption as any),
        tableColumn('KODE', 'kode_jabatan'),
        tableColumn('NAMA JABATAN', 'nama_jabatan'),
        tableColumn('UNIT ORGANISASI', 'orgunit_display'),
        tableColumn('SIFAT', 'sifat_display'),
        tableColumn('LEVEL', 'level_display'),
      ],
      values: values.map((row: any) => ({
        ...row,
        // Menampilkan Unit Organisasi dari relasi
        orgunit_display: (
          <Box>
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              {row.orgunit?.nama_orgunit || '-'}
            </Typography>
            <Typography variant='caption' color='text.disabled'>
              {row.orgunit?.jenis_orgunit || ''}
            </Typography>
          </Box>
        ),
        // Chip untuk Sifat Jabatan
        sifat_display: (
          <Chip
            label={row.sifat_jabatan}
            size='small'
            variant='tonal'
            color='secondary'
            sx={{ fontWeight: 500 }}
          />
        ),
        // Menampilkan Level Jabatan
        level_display: (
          <Typography variant='body2'>
            Level {row.level_jabatan}
          </Typography>
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
          <CardHeader
            title='Master Data Jabatan'
            subheader='Kelola posisi dan struktur jabatan organisasi'
          />
          <Toolbar sx={{ gap: 2, mb: 4, px: '1.5rem !important' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                onClick={() => router.push('/app/jabatan/form')}
              >
                Tambah
              </Button>
            </Box>
            <Typography sx={{ flex: '1 1 auto' }} />
            <TextField
              size='small'
              placeholder='Cari nama, kode, atau unit...'
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

export default JabatanList
