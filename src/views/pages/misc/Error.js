import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import errorImg from '@src/assets/images/pages/error.svg'
import logo from '@src/assets/images/logo/logo.jpg'

import '@styles/base/pages/page-misc.scss'

const Error = () => {
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <img className='img-fluid' width="40px" src={logo} />
        <h2 className='brand-text text-primary ml-1'>Bawaslu</h2>
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='text-center d-flex flex-column align-items-center'>
          <h2 className='mb-1'>Page Not Found 🕵🏻‍♀️</h2>
          <p className='mb-2'>Oops! 😖 The requested URL was not found on this server.</p>
          <img className='img-fluid mb-2' width="200px" src={errorImg} alt='Not authorized page' />
          <Button tag={Link} to='/' color='primary' className='btn-sm-block mb-2'>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  )
}
export default Error
