import { useState, useEffect, Fragment } from 'react'

import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'

const TableView = ({ model, changeSort, ...res }) => {
  const [order, setOrder] = useState('asc') // "asc" | "desc"
  const [orderBy, setOrderBy] = useState('') // field name

  useEffect(() => {
    if (changeSort) {
      changeSort({ order, orderBy })
    }
  }, [changeSort, order, orderBy])

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
                    return <Fragment key={y}>{x.format(o, o[x.key])}</Fragment>
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
            page={model.page - 1}
            component='div'
            count={model.count}
            rowsPerPage={model.perPage}
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
