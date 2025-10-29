import { useContext, useEffect, useState } from 'react'
import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody } from 'reactstrap'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getStatistikDasboard } from './store/action'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Styles
import '@styles/react/apps/app-users.scss'

//** Element
import StatsCard from '@src/views/element/StatsCard'
import StatPengguna from '@src/views/backend/statistik_pengguna/list/Table'
import StatPenggunaKomunitas from '@src/views/backend/statistik_pengguna_komunitas/list/Table'
import StatArtikelKomunitas from '@src/views/backend/statistik_artikel_komunitas/list/Table'
import StatArtikelTema from '@src/views/backend/statistik_artikel_tema/list/Table'
import StatPenggunaProvince from '@src/views/backend/statistik_pengguna_provinsi/list/Table'
import StatPenggunaProvinceKomunitas from '@src/views/backend/statistik_pengguna_provinsi_komunitas/list/Table'

const Dashboard = () => {

  // ** Store Vars
  const store = useSelector(state => state.profile),
  dispatch = useDispatch()

  const [userData, setUserData] = useState(null)
  const [isMounted, setIsMounted] = useState(false)
  const [statDashboard, setStatDashboard] = useState(null)

  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      const user = JSON.parse(localStorage.getItem('userData'))
      setUserData(user.userdata)
    }

    dispatch(getStatistikDasboard(d => {
      setStatDashboard(d.data)
    }))

    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div id='dashboard' className="px-1">
      <Row className='match-height'>
        <Col xs='12'>
          <StatsCard cols={{ lg: '4' }} datas={statDashboard} />
        </Col>
        <Col xs='12'>
          <Card>
            <CardBody>
              <Nav tabs justified>
                <NavItem>
                  <NavLink
                    active={active === '1'}
                    onClick={() => {
                      toggle('1')
                    }}
                  >
                    Pengguna
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '2'}
                    onClick={() => {
                      toggle('2')
                    }}
                  >
                    Pengguna Per Komunitas
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '3'}
                    onClick={() => {
                      toggle('3')
                    }}
                  >
                    Artikel Per Komunitas
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '4'}
                    onClick={() => {
                      toggle('4')
                    }}
                  >
                    Artikel Per Tema
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '5'}
                    onClick={() => {
                      toggle('5')
                    }}
                  >
                    Pengguna Semua Provinsi
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '6'}
                    onClick={() => {
                      toggle('6')
                    }}
                  >
                    Pengguna Semua Provinsi Per Komunitas
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='1'>
                  <StatPengguna />
                </TabPane>
                <TabPane tabId='2'>
                  <StatPenggunaKomunitas active={active === '2'} />
                </TabPane>
                <TabPane tabId='3'>
                  <StatArtikelKomunitas active={active === '3'} />
                </TabPane>
                <TabPane tabId='4'>
                  <StatArtikelTema active={active === '4'} />
                </TabPane>
                <TabPane tabId='5'>
                  <StatPenggunaProvince active={active === '5'} />
                </TabPane>
                <TabPane tabId='6'>
                  <StatPenggunaProvinceKomunitas active={active === '6'} />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
