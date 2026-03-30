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
import { deleteBobotPenilaian, fetchBobotPenilaianPage, resetRedux } from '../slice/index'

import { tableColumn } from '@views/onevour/table/TableViewBuilder'
import TableView from '@views/onevour/table/TableView'
import DialogDelete from '@views/onevour/components/dialog-delete'

const RowAction = ({ row, onDeleteSuccess }: { row: any; onDeleteSuccess: (id: string) => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const canEdit = true
  const canDelete = true

  return (
    <TableCell size='small' sx={{ borderBottom: 0 }}>
      <IconButton size='small' onClick={(e) => setAnchorEl(e.currentTarget)}>
        <i className='tabler-dots-vertical' />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem component={Link} href={`/app/jenis-penilaian-bobot/form?id=${row.id_bobot}&view=true`}>
          <i className='tabler-eye' style={{ marginRight: 8 }} /> View
        </MenuItem>
        {canEdit && (
          <MenuItem component={Link} href={`/app/jenis-penilaian-bobot/form?id=${row.id_bobot}`}>
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
        id={`Bobot ${row.nama_penilaian}`}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        handleOk={() => {
          onDeleteSuccess(row.id_bobot)
          setOpenConfirm(false)
        }}
        handleClose={() => setOpenConfirm(false)}
      />
    </TableCell>
  )
}

const JenisPenilaianBobotList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.jenis_penilaian_bobot)

  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const fetchData = useCallback(() => {
    dispatch(fetchBobotPenilaianPage({ page, perPage, keyword: filter }))
  }, [dispatch, page, perPage, filter])

  useEffect(() => {
    const timer = setTimeout(fetchData, 500)
    return () => clearTimeout(timer)
  }, [fetchData])

  useEffect(() => {
    if (store.delete?.status) {
      toast.success('Konfigurasi bobot berhasil dihapus')
      fetchData()
      dispatch(resetRedux())
    }
  }, [store.delete, dispatch, fetchData])

  const renderOption = (row: any) => {
    return <RowAction row={row} onDeleteSuccess={(id) => dispatch(deleteBobotPenilaian(id))} />
  }

  const buildTable = () => {
    const { dataPage } = store
    return {
      page: page,
      fields: [
        tableColumn('OPTION', 'act-x', 'left', renderOption as any),
        tableColumn('PENILAIAN', 'penilaian_display'),
        tableColumn('LEMBAGA & TINGKAT', 'lembaga_display'),
        tableColumn('TAHUN AJARAN', 'tahun_ajaran'),
        tableColumn('BOBOT', 'bobot_display'),
        tableColumn('STATUS', 'status_display'),
      ],
      values: (dataPage?.values || []).map((row: any) => ({
        ...row,
        penilaian_display: (
          <Box>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
              {row.nama_penilaian}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Tipe: {row.lembaga_type}
            </Typography>
          </Box>
        ),
        lembaga_display: (
          <Box>
            <Typography variant='body2'>
              {row.lembaga?.nama_lembaga || '-'}
            </Typography>
            <Typography variant='caption' sx={{ color: 'primary.main', fontWeight: 500 }}>
              Tingkat: {row.tingkat || 'Semua Tingkat'}
            </Typography>
          </Box>
        ),
        bobot_display: (
          <Chip
            label={`${row.bobot}%`}
            size='small'
            color='info'
            variant='tonal'
            sx={{ fontWeight: 'bold' }}
          />
        ),
        status_display: (
          <Chip
            label={row.status}
            size='small'
            color={row.status === 'Aktif' ? 'success' : 'secondary'}
            variant='tonal'
          />
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
            title='Konfigurasi Bobot Penilaian'
            subheader='Manajemen presentase nilai per tahun ajaran dan tingkat pendidikan'
          />
          <Toolbar sx={{ gap: 2, mb: 4, px: '1.5rem !important' }}>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => router.push('/app/jenis-penilaian-bobot/form')}
            >
              Tambah Bobot
            </Button>
            <Typography sx={{ flex: '1 1 auto' }} />
            <TextField
              size='small'
              placeholder='Cari penilaian, lembaga, atau tingkat...'
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            />
          </Toolbar>
          <TableView changeSort={() => { }} model={buildTable()} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default JenisPenilaianBobotList
