import classnames from 'classnames'
import Avatar from '@components/avatar'
import { TrendingUp, User, Image, AlertOctagon } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'
import { convertToRupiah } from '@utils'
import { Link } from 'react-router-dom'

const StatsCard = ({ cols, datas }) => {
  const data = [
    {
      title: convertToRupiah(datas?.pengguna || 0),
      subtitle: 'Pengguna',
      color: 'light-info',
      icon: <User size={24} />,
      link: '/user/list'
    },
    {
      title: convertToRupiah(datas?.gallery || 0),
      subtitle: 'Galeri',
      color: 'light-info',
      icon: <Image size={24} />,
      link: '/gallery/list'
    },
    {
      title: convertToRupiah(datas?.article || 0),
      subtitle: 'Forum Artikel',
      color: 'light-success',
      icon: <TrendingUp size={24} />,
      link: '/article/list'
    },
    {
      title: convertToRupiah(datas?.bawaslu_update || 0),
      subtitle: 'Bawaslu Update',
      color: 'light-success',
      icon: <TrendingUp size={24} />,
      link: '/bawaslu_update/list'
    },
    {
      title: convertToRupiah(datas?.laporan_aduan || 0),
      subtitle: 'Pengaduan Daring',
      color: 'light-warning',
      icon: <AlertOctagon size={24} />,
      link: '/complaint/list'
    },
    {
      title: convertToRupiah(datas?.laporan_article || 0),
      subtitle: 'Pengaduan Artikel',
      color: 'light-warning',
      icon: <AlertOctagon size={24} />,
      link: '/report_article/list'
    }
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const margin = Object.keys(cols)

      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin[0]}-1`]: index !== data.length - 1
          })}
        >
          <Link to={item.link}>
            <Media>
              <Avatar color={item.color} icon={item.icon} className='mr-2' />
              <Media className='my-auto' body>
                <h4 className='font-weight-bolder mb-0'>{item.title}</h4>
                <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
              </Media>
            </Media>
          </Link>
        </Col>
      )
    })
  }

  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>Statistik</CardTitle>
        <CardText className='card-text font-small-2 mr-25 mb-0'></CardText>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
