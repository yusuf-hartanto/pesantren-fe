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
  deleteOrgUnit,
  fetchOrgUnitPage,
  resetRedux
} from '../slice/index'
import { useCan } from '@/hooks/useCan'

import { tableColumn } from '@views/onevour/table/TableViewBuilder'
import TableView from '@views/onevour/table/TableView'
import DialogDelete from '@views/onevour/components/dialog-delete'

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
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          component={Link}
          href={`/app/organisasi/form?id=${row.id_orgunit}&view=true`}
          onClick={handleClose}
        >
          <i className='tabler-eye' style={{ marginRight: 8 }} /> View
        </MenuItem>

        {canEdit && (
          <MenuItem
            component={Link}
            href={`/app/organisasi/form?id=${row.id_orgunit}`}
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
        id={row.nama_orgunit}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        handleOk={() => {
          onDeleteSuccess(row.id_orgunit)
          setOpenConfirm(false)
        }}
        handleClose={() => setOpenConfirm(false)}
      />
    </TableCell>
  )
}

const OrganizationUnitList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.organisasi_unit)

  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const fetchData = useCallback(() => {
    dispatch(fetchOrgUnitPage({ page, perPage, keyword: filter }))
  }, [dispatch, page, perPage, filter])

  useEffect(() => {
    const timer = setTimeout(fetchData, 500)
    return () => clearTimeout(timer)
  }, [fetchData])

  useEffect(() => {
    if (store.delete) {
      toast.success('Data unit organisasi berhasil dihapus')
      fetchData()
      dispatch(resetRedux())
    }

    if (store.crud?.status === false) {
      toast.error(store.crud?.message || 'Gagal menghapus data')
      dispatch(resetRedux())
    }
  }, [store.delete, store.crud, dispatch, fetchData])

  const renderOption = (row: any) => {
    return <RowAction row={row} onDeleteSuccess={(id) => dispatch(deleteOrgUnit(id))} />
  }

  const buildTable = () => {
    const { dataPage } = store
    const values = dataPage?.values || []

    return {
      page: page,
      fields: [
        tableColumn('OPSI', 'act-x', 'left', renderOption as any),
        tableColumn('NAMA UNIT', 'unit_display'),
        tableColumn('JENIS', 'jenis_display'),
        tableColumn('INDUK UNIT', 'parent_display'),
        tableColumn('CABANG / LEMBAGA', 'relasi_display'),
        tableColumn('LVL', 'level_orgunit', 'center'),
      ],
      values: values.map((row: any) => ({
        ...row,
        unit_display: (
          <Box sx={{ pl: (row.level_orgunit || 0) * 2 }}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {row.nama_orgunit}
            </Typography>
            <Typography variant='caption' color='text.disabled'>
              {row.keterangan || '-'}
            </Typography>
          </Box>
        ),
        jenis_display: (
          <Chip
            label={row.jenis_orgunit}
            size='small'
            variant='tonal'
            color={row.jenis_orgunit === 'Lembaga' ? 'success' : 'primary'}
          />
        ),
        // Menggunakan 'parent_nama' dari Backend Repository
        parent_display: (
          <Typography variant='body2' sx={{ color: row.parent_nama ? 'text.primary' : 'text.disabled' }}>
            {row.parent_nama || 'ROOT'}
          </Typography>
        ),
        // Menggunakan 'nama_cabang' dan objek 'lembaga' hasil json_build_object
        relasi_display: (
          <Box>
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              {row.nama_cabang || 'Pusat'}
            </Typography>
            {row.lembaga?.nama_lembaga && (
              <Typography variant='caption' sx={{ display: 'block', color: 'primary.main' }}>
                {`[${row.lembaga_type}] ${row.lembaga.nama_lembaga}`}
              </Typography>
            )}
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
          <CardHeader title='Master Struktur Organisasi' />
          <Toolbar sx={{ gap: 2, mb: 4, px: '1.5rem !important' }}>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => router.push('/app/organisasi/form')}
            >
              Tambah Unit
            </Button>
            <Typography sx={{ flex: '1 1 auto' }} />
            <TextField
              size='small'
              placeholder='Cari unit, cabang, atau lembaga...'
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

export default OrganizationUnitList
