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
import { deleteJenisPenilaian, fetchJenisPenilaianPage, resetRedux } from '../slice/index'

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
        <MenuItem component={Link} href={`/app/jenis-penilaian/form?id=${row.id_penilaian}&view=true`}>
          <i className='tabler-eye' style={{ marginRight: 8 }} /> View
        </MenuItem>
        {canEdit && (
          <MenuItem component={Link} href={`/app/jenis-penilaian/form?id=${row.id_penilaian}`}>
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
        id={row.jenis_pengujian}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        handleOk={() => {
          onDeleteSuccess(row.id_penilaian)
          setOpenConfirm(false)
        }}
        handleClose={() => setOpenConfirm(false)}
      />
    </TableCell>
  )
}

const JenisPenilaianList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.jenis_penilaian) // Pastikan nama state sesuai di store

  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const fetchData = useCallback(() => {
    dispatch(fetchJenisPenilaianPage({ page, perPage, keyword: filter }))
  }, [dispatch, page, perPage, filter])

  useEffect(() => {
    const timer = setTimeout(fetchData, 500)
    return () => clearTimeout(timer)
  }, [fetchData])

  useEffect(() => {
    if (store.delete?.status) {
      toast.success('Jenis Penilaian berhasil dihapus')
      fetchData()
      dispatch(resetRedux())
    }
  }, [store.delete, dispatch, fetchData])

  const renderOption = (row: any) => {
    return <RowAction row={row} onDeleteSuccess={(id) => dispatch(deleteJenisPenilaian(id))} />
  }

  const buildTable = () => {
    const { dataPage } = store
    return {
      page: page,
      fields: [
        tableColumn('OPTION', 'act-x', 'left', renderOption as any),
        tableColumn('JENIS PENGUJIAN', 'pengujian_display'),
        tableColumn('LEMBAGA', 'lembaga_display'),
        tableColumn('UJIAN', 'ujian_display'),
        tableColumn('STATUS', 'status_display'),
      ],
      values: (dataPage?.values || []).map((row: any) => ({
        ...row,
        pengujian_display: (
          <Box>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
              {row.jenis_pengujian}
            </Typography>
            <Typography variant='caption'>{row.singkatan || '-'}</Typography>
          </Box>
        ),
        lembaga_display: (
          <Chip
            label={row.lembaga_type}
            size='small'
            color={row.lembaga_type === 'FORMAL' ? 'primary' : 'warning'}
            variant='tonal'
          />
        ),
        ujian_display: (
          <Chip
            label={row.is_ujian === 1 ? 'Ya' : 'Tidak'}
            size='small'
            color={row.is_ujian === 1 ? 'info' : 'default'}
          />
        ),
        status_display: (
          <Chip
            label={row.status.toUpperCase()}
            size='small'
            color={row.status === 'active' ? 'success' : 'error'}
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
            title='Master Jenis Penilaian'
            subheader='Pengaturan kategori pengujian untuk lembaga Formal dan Pesantren'
          />
          <Toolbar sx={{ gap: 2, mb: 4, px: '1.5rem !important' }}>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => router.push('/app/jenis-penilaian/form')}
            >
              Tambah Jenis
            </Button>
            <Typography sx={{ flex: '1 1 auto' }} />
            <TextField
              size='small'
              placeholder='Cari jenis atau singkatan...'
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            />
          </Toolbar>
          <TableView changeSort={() => { }} model={buildTable()} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default JenisPenilaianList
