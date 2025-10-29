// ** React Imports
import { Fragment, useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

// ** Columns
import { columns } from './columns'

// ** Store & Actions
import { getDataStatistikPenggunaProvinceKomunitas } from '../store/action'
import {  getAllDataKomunitas } from '@src/views/backend/komunitas/store/action'
import { useDispatch, useSelector } from 'react-redux'
import { AbilityContext } from '@src/utility/context/Can'
import ChartDataLabels from 'chartjs-plugin-datalabels'

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
import { Card, CardBody } from 'reactstrap'
import useDebounce from '@hooks/useDebounce'
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
  const store = useSelector(state => state.statistikpenggunaprovincekomunitass),
    ability = useContext(AbilityContext)

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(1000)
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState({
    labels: [],
    datasets: []
  })

  const debouncedSearch = useDebounce(searchTerm, 500)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
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
        getDataStatistikPenggunaProvinceKomunitas({
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
        getDataStatistikPenggunaProvinceKomunitas({
          page: currentPage,
          perPage: rowsPerPage,
          q: debouncedSearch
        })
      )
    }

  }, [debouncedSearch, currentPage, rowsPerPage])

  useEffect(() => {
    if (store.data.length > 0) {

      dispatch(getAllDataKomunitas(d => {
        let labels = null
        let datasets = []
        for (const v of d) {
          if (!labels) {
            labels = store.data.filter(d => d.komunitas_id === v.id).map(d => d.provinces)
          }

          const x = Math.floor(Math.random() * 256)
          const y = Math.floor(Math.random() * 256)
          const z = Math.floor(Math.random() * 256)

          datasets = datasets.concat({
            label: v.komunitas_name,
            data: store.data.filter(d => d.komunitas_id === v.id).map(d => d.total_pengguna),
            borderColor: `rgb(${x}, ${y}, ${z})`,
            backgroundColor: `rgb(${x}, ${y}, ${z}, 0.9)`,
            hidden: true
          })
        }

        setData({
          labels,
          datasets
        })
      }))
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
