"use client"

import React, { useEffect, useState } from 'react'

import Link, { } from 'next/link'
import { useRouter } from 'next/navigation'

import { useDispatch, useSelector } from 'react-redux'

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

import { deleteRole, fetchRolePage, resetRedux } from '../slice/index'
import { tableColumn } from '@views/onevour/table/TableViewBuilder'
import TableView from '@views/onevour/table/TableView'
import CustomChip from '@core/components/mui/Chip'
import DialogDelete from '@views/onevour/components/dialog-delete'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

const statusObj = {
  1: {
    color: 'success',
    value: 'Aktif'
  },
  2: {
    color: 'secondary',
    value: 'Nonaktif'
  }
}

const RowAction = (data) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(false)
  const dispatch = useDispatch()

  const rowOptionsOpen = Boolean(anchorEl)

  const setOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const optionsOnClose = () => {
    setAnchorEl(null)
  }

  const handleView = () => {
    optionsOnClose()
  }

  const handleDelete = (id) => {
    dispatch(deleteRole(id))
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
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={`/app/role/form?id=${data.row.role_id}&view=true`}
          onClick={handleView}
        >
          <i className='tabler-eye' />
          View
        </MenuItem>

        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={`/app/role/form?id=${data.row.role_id}`}
          onClick={handleView}
        >
          <i className='tabler-edit' />
          Edit
        </MenuItem>

        <MenuItem onClick={() => setOpenConfirm(true)} sx={{ '& svg': { mr: 2 } }}>
          <i className='tabler-trash' />
          Delete
        </MenuItem>
        <DialogDelete
          id={data.row.role_name}
          open={openConfirm}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              setOpenConfirm(false)
            }
          }}
          handleOk={() => {
            handleDelete(data.row.id)
            setOpenConfirm(false)
          }}
          handleClose={() => {
            setOpenConfirm(false)
          }}
          disableEscapeKeyDown={true}
        />
      </Menu>
    </TableCell>
  )
}

const Table = () => {
  // ** Hooks
  const router = useRouter()

  const dispatch = useDispatch()

  const store = useSelector((state) => state.role)

  const [filter, setFilter] = useState('')

  const [page, setPage] = useState(1)

  const [rowsPerPage, setRowsPerPage] = useState(15)

  useEffect(() => {

    if (store.delete) {

      dispatch(resetRedux())

    }
  }, [dispatch, store.delete])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)

      dispatch(fetchRolePage({ page: 1, rowsPerPage: rowsPerPage, filter: filter }))

    }, 500)

    return () => clearTimeout(timer)
  }, [filter])

  const onSubmit = () => {
    router.replace('/app/role/form')
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    dispatch(fetchRolePage({ page: newPage, rowsPerPage: rowsPerPage, filter: filter }))
  }

  const handleChangeRowsPerPage = (event) => {
    const newRorPerPage = parseInt(event.target.value, 10)

    setPage(1)
    setRowsPerPage(newRorPerPage)
    dispatch(fetchRolePage({ page: 1, rowsPerPage: newRorPerPage, filter: filter }))
  }

  const renderOption = (row) => {
    return <RowAction row={row} />
  }

  const buildTable = () => {
    const { dataPage } = store

    if (dataPage) {
      const { values, total } = dataPage

      return {
        page: page,
        fields: [
          tableColumn('OPTION', 'act-x', 'left', renderOption),
          tableColumn('NAME', 'role_name'),
          tableColumn('STATUS', 'status'),
          tableColumn('CREATED BY', 'created_by'),
          tableColumn('UPDATED BY', 'modified_by')
        ],
        values: values?.map(row => {
          return {
            ...row,
            status: (
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={statusObj[row.status]?.value}
                color={statusObj[row.status]?.color}
                sx={{ textTransform: 'capitalize' }}
              />
            )
          }
        }),
        count: total,
        rowsPerPage: rowsPerPage,
        changePage: (event, newPage) => {
          handleChangePage(event, newPage)
        },
        changePerPage: (event, o) => {
          handleChangeRowsPerPage(event)
        }
      }
    }
  }

  return (
    <Grid container spacing={6} sx={{ width: '100%' }}>
      <Grid item size={12}>
        <Card>
          <CardHeader title='Role' sx={{ paddingBottom: 0 }} />
          <Toolbar sx={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}>
            <Tooltip title='Add'>
              <Button size='medium' variant='outlined' onClick={onSubmit}>
                Add
              </Button>
            </Tooltip>
            <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'></Typography>
            <Tooltip title='Search'>
              <TextField id='outlined-basic' label='Search' size='small' onChange={handleFilter} />
            </Tooltip>
          </Toolbar>
          <TableView model={buildTable()} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default Table
