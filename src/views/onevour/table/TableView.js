import { useState, useEffect } from 'react'

import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'

/*
* = {
    fields: [],
    values: [],
    count: 0,
    rowsPerPage: 0,
    changePage: (row, o) => {
        console.warn("not implement paging callback")
    },
    changePerPage: (row, o) => {
        console.warn("not implement paging callback")
    }
}
* */

const TableView = ({ model, changeSort, ...res }) => {
  const [order, setOrder] = useState('asc') // "asc" | "desc"
  const [orderBy, setOrderBy] = useState('') // field name

  useEffect(() => {
    if (changeSort) {
      changeSort({ order, orderBy })
    }
  }, [order, orderBy])

  // 2 return header
  /*
    <TableRow>
        <TableCell>Action</TableCell>
        <TableCell>Product</TableCell>
        <TableCell align='right'>Category</TableCell>
        <TableCell align='right'>Harga Jual</TableCell>
    </TableRow>
     */
  const renderTableHeader = (model = [], { order, orderBy, onSort }) => {
    if (!model.fields) {
      return <></>
    }

    return (
      <TableRow>
        {model.fields.map((o, i) => {
          const isActive = orderBy === o.key

          return (
            <TableCell key={i} align={o.align} sx={o.sx}>
              {o.sortable ? (
                <TableSortLabel active={isActive} direction={isActive ? order : 'asc'} onClick={() => onSort(o.key)}>
                  {o.title}
                </TableSortLabel>
              ) : (
                o.title
              )}
            </TableCell>
          )
        })}
      </TableRow>
    )
  }

  // 3 return row
  /*
    {store.products.map(row => (
        <TableRow key={row.id} sx={{'&:last-of-type td, &:last-of-type th': {border: 0}}}>
            <RowAction row={row}/>
            <TableCell component='th' scope='row'>{row.name}</TableCell>
            <TableCell align='right'>{row.category}</TableCell>
            <TableCell align='right'>{row.value_last}</TableCell>
        </TableRow>
    ))}

    // backup

    // is moments
    if (moment.isMoment(o[x.key])) {
        if (x.format) {
            return <TableCell key={y}>{x.format(o, o[x.key])}</TableCell>
        } else {
            return <TableCell key={y}>Invalid format</TableCell>
        }
    }

    */
  const renderTableRows = model => {
    return (
      <>
        {model &&
          model.values &&
          model.values.map((o, i) => {

            return (
              <TableRow
                key={i}
                sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                onClick={() => {
                  if (typeof res?.onClick === 'function') {
                    res?.onClick(o)
                  }
                }}
                hover={res.hover || false}
              >
                {model.fields.map((x, y) => {
                  if (x.key === 'act-x') {
                    return <>{x.format(o, o[x.key])}</>
                  }

                  // has format
                  if (x.format) {
                    if (x.key) {
                      return (
                        <TableCell key={y} align={x.align}>
                          {x.format(o, o[x.key])}
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell key={y} align={x.align}>
                        {x.format(o, null)}
                      </TableCell>
                    )
                  }

                  return (
                    <TableCell key={y} align={x.align}>
                      {o[x.key]}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
      </>
    )
  }

  const handleSort = fieldName => {
    const isAsc = orderBy === fieldName && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')

    setOrderBy(fieldName)
  }

  return (
    <>
      {model ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>{renderTableHeader(model, { order, orderBy, onSort: handleSort })}</TableHead>

              <TableBody>{renderTableRows(model)}</TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            page={model.page}
            component='div'
            count={model.count}
            rowsPerPage={model.rowsPerPage}
            onPageChange={model.changePage}
            rowsPerPageOptions={[15, 30, 50]}
            onRowsPerPageChange={model.changePerPage}
          />
        </>
      ) : null}{' '}
    </>
  )
}

export default TableView
