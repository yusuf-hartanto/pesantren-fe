// ** React Imports
import { Fragment, useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

// ** Columns
import { columns } from './columns'

// ** Store & Actions
import { getDataStatistikPenggunaProvince } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'
import { AbilityContext } from '@src/utility/context/Can'

import Spinner from '@src/layouts/components/Spinner'

// ** Third Party Components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Row, Col, Label, CustomInput, Button } from 'reactstrap'
import useDebounce from '@hooks/useDebounce'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { convertToRupiah } from '@utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

const ClassList = ({active}) => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.statistikpenggunaprovinces),
    ability = useContext(AbilityContext)

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Pengguna',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.9)'
      }
    ]
  })

  const debouncedSearch = useDebounce(searchTerm, 500)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false
      },
      datalabels: {
        backgroundColor(context) {
          return context.dataset.backgroundColor
        },
        borderRadius: 4,
        color: 'white',
        font: {
          weight: 'bold'
        },
        formatter(value) {
          return convertToRupiah(value)
        },
        padding: 6
      }
    }
  }

  // ** redirect
  const history = useHistory()

  // ** Get data on mount
  useEffect(() => {
    if (active) {
      dispatch(
        getDataStatistikPenggunaProvince({
          page: currentPage,
          perPage: rowsPerPage,
          q: searchTerm
        })
      )
    }

    setMounted(true)
  }, [dispatch, active])

  useEffect(() => {
    if (mounted) {
      dispatch(
        getDataStatistikPenggunaProvince({
          page: currentPage,
          perPage: rowsPerPage,
          q: debouncedSearch
        })
      )
    }

  }, [debouncedSearch, currentPage, rowsPerPage])

  useEffect(() => {
    if (store.data.length > 0) {

      const labels = store.data.map(d => d.provinces)
      const data = store.data.map(d => d.total_pengguna)

      setData({
        labels,
        datasets: [
          {
            label: 'Pengguna',
            data,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
          }
        ]
      })
    }
  }, [store.data])

  return (
    <Fragment>
      <Card>
        <CardBody>
          <Line options={options} data={data} />
          {store.loading && data.datasets.length === 0 && <Spinner/>}
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ClassList
