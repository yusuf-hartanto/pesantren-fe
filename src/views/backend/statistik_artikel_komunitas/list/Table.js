// ** React Imports
import { Fragment, useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

// ** Columns
import { columns } from './columns'

// ** Store & Actions
import { getDataStatistikArtikelKomunitas, getStatistikArtikelKomunitas } from '../store/action'
import {  getProvince, getRegency } from '@src/views/backend/user/store/action'
import {  getAllDataKomunitas } from '@src/views/backend/komunitas/store/action'
import { useDispatch, useSelector } from 'react-redux'
import { AbilityContext } from '@src/utility/context/Can'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { selectThemeColors } from '@utils'
import { Card, CardHeader, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import useDebounce from '@hooks/useDebounce'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ handleCreate, handlePerPage, rowsPerPage, handleFilter, searchTerm, ability }) => {
  return (
    <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <Label for='rows-per-page'>Show</Label>
            <CustomInput
              className='form-control mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{
                width: '5rem',
                padding: '0 0.8rem',
                backgroundPosition: 'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0'
              }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </CustomInput>
            <Label for='rows-per-page'>Entries</Label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
        >
          <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
            <Label className='mb-0' for='search-invoice'>
              Search:
            </Label>
            <Input
              id='search-invoice'
              className='ml-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

const ClassList = ({active}) => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.statistikartikelkomunitass),
    ability = useContext(AbilityContext)

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [mounted, setMounted] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState({label: 'Pilih Provinsi'})
  const [selectedRegency, setSelectedRegency] = useState({label: 'Pilih Kota / Kabupaten'})
  const [selectedKomunitas, setSelectedKomunitas] = useState({label: 'Komunitas'})
  const [dataProvince, setDataProvince] = useState([])
  const [dataRegency, setDataRegency] = useState([])
  const [dataKomunitas, setDataKomunitas] = useState([])

  const debouncedSearch = useDebounce(searchTerm, 500)

  // ** redirect
  const history = useHistory()

  // ** Get data on mount
  useEffect(() => {
    if (active) {
      if (!store.params) {
        dispatch(
          getDataStatistikArtikelKomunitas({
            page: currentPage,
            perPage: rowsPerPage,
            q: searchTerm
          })
        )
      } else {
        dispatch(
          getDataStatistikArtikelKomunitas(store.params)
        )
        setSearchTerm(store.params.q)
        setCurrentPage(store.params.page)
        setRowsPerPage(store.params.perPage)
      }
  
      setMounted(true)
  
      dispatch(getProvince(d => {
        if (d.status) {
          setDataProvince(d.data.map(r => {
            return {
              label: r.name,
              value: r.id
            }
          }))
        }
      }))
  
      dispatch(getAllDataKomunitas(d => {
        setDataKomunitas(d.map(r => {
          return {
            label: r.komunitas_name,
            value: r.id
          }
        }))
      }))
    }
    
  }, [dispatch, active])

  useEffect(() => {
    if (mounted) {
      dispatch(
        getDataStatistikArtikelKomunitas({
          page: currentPage,
          perPage: rowsPerPage,
          q: debouncedSearch,
          province: selectedProvince?.value,
          regency: selectedRegency?.value,
          komunitas: selectedKomunitas.value
        })
      )
    }
  }, [debouncedSearch, currentPage, rowsPerPage, selectedProvince, selectedRegency, selectedKomunitas])

  // ** Function in get data on page change
  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    setRowsPerPage(value)
  }

  // ** Function in get data on search query change
  const handleFilter = val => {
    setSearchTerm(val)
  }

  // ** Function create
  const handleCreate = e => {
    dispatch(getStatistikArtikelKomunitas(null))
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.total / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pr-1'}
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchTerm
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data.length > 0) {
      return store.data
    } else if (store.data.length === 0 && isFiltered) {
      return []
    } else {
      return store.allData.slice(0, rowsPerPage)
    }
  }

  return (
    <Fragment>
      <Card>
        <Row>
          <Col md='3'>
            <Select
              isClearable={false}
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              options={dataKomunitas}
              value={selectedKomunitas}
              onChange={data => {
                setSelectedKomunitas(data)
              }}
            />
          </Col>
          <Col md='3'>
            <Select
              isClearable={false}
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              options={dataProvince}
              value={selectedProvince}
              onChange={data => {
                setSelectedProvince(data)
                dispatch(getRegency(data.value, d => {
                  if (d.status) {
                    setDataRegency(d.data.map(r => {
                      return {
                        label: r.name,
                        value: r.id
                      }
                    }))
                  }
                }))
              }}
            />
          </Col>
          <Col md='3'>
            <Select
              isClearable={false}
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              options={dataRegency}
              value={selectedRegency}
              onChange={data => {
                setSelectedRegency(data)
              }}
            />
          </Col>
          <Col md='3'>
            <Button.Ripple color='secondary' outline onClick={() => history.go(0)}>Reset</Button.Ripple>
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          subHeader
          responsive
          paginationServer
          columns={columns((currentPage - 1) * rowsPerPage, ability)}
          sortIcon={<ChevronDown />}
          className='react-dataTable'
          paginationComponent={CustomPagination}
          data={dataToRender()}
          subHeaderComponent={
            <CustomHeader
              handleCreate={handleCreate}
              handlePerPage={handlePerPage}
              rowsPerPage={rowsPerPage}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
              ability={ability}
            />
          }
        />
      </Card>
    </Fragment>
  )
}

export default ClassList
