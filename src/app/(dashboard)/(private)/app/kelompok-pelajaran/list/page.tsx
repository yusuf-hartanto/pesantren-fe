'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ** MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'

import CardHeader from '@mui/material/CardHeader'
import { TextField, Toolbar } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { deleteKelompokPelajaran, fetchKelompokPelajaranPage, resetRedux } from '../slice/index'
import { tableColumn } from '@views/onevour/table/TableViewBuilder'
import TableView from '@views/onevour/table/TableView'
import CustomChip from '@core/components/mui/Chip'
import DialogDelete from '@views/onevour/components/dialog-delete'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { flattenMenuTree } from '@/@core/utils/menuHelpers'
import { useCan } from '@/hooks/useCan'

const statusObj: Record<string, { color: any; value: string }> = {
  'A': {
    color: 'success',
    value: 'Aktif'
  },
  'N': {
    color: 'secondary',
    value: 'Nonaktif'
  }
}

function RowAction(data: any) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(false)
  const dispatch = useAppDispatch()

  const canEdit = useCan('edit')
  const canDelete = useCan('delete')

  const rowOptionsOpen = Boolean(anchorEl)

  const setOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const optionsOnClose = () => {
    setAnchorEl(null)
  }

  const handleView = () => {
    optionsOnClose()
  }

  const handleDelete = (id: string) => {
    dispatch(deleteKelompokPelajaran(id))
    optionsOnClose()
  }

  return (
    <TableCell size='small'>
      <IconButton aria-controls='long-menu' size='small' aria-haspopup='true' onClick={setOpen}>
        <i className='tabler-dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={optionsOnClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: { style: { minWidth: '8rem' } }
        }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={`/app/kelompok-pelajaran/form?id=${data.row.id_kelpelajaran}&view=true`}
          onClick={handleView}
        >
          <i className='tabler-eye' />
          View
        </MenuItem>

        {canEdit &&
          <MenuItem
            key="edit"
            component={Link}
            sx={{ '& svg': { mr: 2 } }}
            href={`/app/kelompok-pelajaran/form?id=${data.row.id_kelpelajaran}`}
            onClick={handleView}
          >
            <i className='tabler-edit' />
            Edit
          </MenuItem>
        }

        {canDelete && [
          <MenuItem
            key="delete"
            onClick={() => setOpenConfirm(true)} sx={{ '& svg': { mr: 2 } }}>
            <i className='tabler-trash' />
            Delete
          </MenuItem>,
          <DialogDelete
            key="dialog-delete"
            id={data.row.nama_kelpelajaran}
            open={openConfirm}
            onClose={(event: any, reason: any) => {
              if (reason !== 'backdropClick') {
                setOpenConfirm(false)
              }
            }}
            handleOk={() => {
              handleDelete(data.row.id_kelpelajaran)
              setOpenConfirm(false)
            }}
            handleClose={() => {
              setOpenConfirm(false)
            }}
            disableEscapeKeyDown={true}
          />
        ]}
      </Menu>
    </TableCell>
  )
}

const Table = () => {
  // ** Hooks
  const router = useRouter()
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.kelompok_pelajaran)
  const canCreate = useCan('create')

  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  useEffect(() => {
    if (store.delete) {
      dispatch(fetchKelompokPelajaranPage({ page: 1, perPage: perPage, q: filter }))

      dispatch(resetRedux())
    }
  }, [dispatch, filter, perPage, store.delete])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)

      dispatch(fetchKelompokPelajaranPage({ page: 1, perPage: perPage, q: filter }))
    }, 500)

    return () => clearTimeout(timer)
  }, [dispatch, filter, perPage])

  const onSubmit = () => {
    router.replace('/app/kelompok-pelajaran/form')
  }

  const handleFilter = (event: any) => {
    setFilter(event.target.value)
  }

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage)
    dispatch(fetchKelompokPelajaranPage({ page: newPage, perPage: perPage, q: filter }))
  }

  const handleChangePerPage = (event: any) => {
    const newPerPage = parseInt(event.target.value, 10)

    setPage(1)
    setPerPage(newPerPage)
    dispatch(fetchKelompokPelajaranPage({ page: 1, perPage: newPerPage, q: filter }))
  }

  const renderOption = (row: any) => {
    return <RowAction row={row} />
  }

  const buildTable = () => {
    const { dataPage } = store

    if (dataPage) {
      const { values, total } = dataPage

      const flatValues = flattenMenuTree(values)

      return {
        page: page,
        fields: [
          tableColumn('OPTION', 'act-x', 'left', renderOption as any),
          tableColumn('NAME', 'nama_kelpelajaran'),
          tableColumn('Keterangan', 'keterangan'),
          tableColumn('NOMOR URUT', 'nomor_urut'),
          tableColumn('STATUS', 'status'),
          tableColumn('TERAKHIR DIUBAH', 'updated_at'),
        ],
        values: flatValues?.map((row: any) => {
          return {
            ...row,
            nama_kelpelajaran: (
              <div
                style={{
                  paddingLeft: row.__level * 24,
                  fontWeight: row.__level === 0 ? 600 : 400
                }}
              >
                {row.nama_kelpelajaran}
              </div>
            ),
            status: (
              <CustomChip
                round='true'
                size='small'
                label={statusObj[row.status]?.value}
                color={statusObj[row.status]?.color}
                sx={{ textTransform: 'capitalize' }}
              />
            )
          }
        }),
        count: total,
        perPage: perPage,
        changePage: (event: any, newPage: number) => {
          handleChangePage(event, newPage)
        },
        changePerPage: (event: any, o: any) => {
          handleChangePerPage(event)
        }
      }
    }
  }

  return (
    <Grid container spacing={6} sx={{ width: '100%' }}>
      <Grid size={12}>
        <Card>
          <CardHeader title='Menu' sx={{ paddingBottom: 0 }} />
          <Toolbar sx={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}>
            {canCreate &&
              <Tooltip title='Add'>
                <Button size='medium' variant='outlined' onClick={onSubmit}>
                  Add
                </Button>
              </Tooltip>
            }
            <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'></Typography>
            <Tooltip title='Search'>
              <TextField id='outlined-basic' fullWidth label='Search' size='small' onChange={handleFilter} />
            </Tooltip>
          </Toolbar>
          <TableView model={buildTable()} changeSort={null} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default Table
