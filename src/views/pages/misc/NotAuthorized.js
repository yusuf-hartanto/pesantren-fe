import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import notAuthImg from '@src/assets/images/pages/not-authorized.svg'
import logo from '@src/assets/images/logo/logo.jpg'

import '@styles/base/pages/page-misc.scss'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'

const NotAuthorized = () => {

  // ** Store Vars
  const dispatch = useDispatch()
  
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <img className='img-fluid' width="40px" src={logo} />
        <h2 className='brand-text text-primary ml-1'>Bawaslu</h2>
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='text-center d-flex flex-column align-items-center'>
          <h2 className='mb-1'>You are not authorized! 🔐</h2>
          <p className='mb-2'>
            The Webtrends Marketing Lab website in IIS uses the default IUSR account credentials to access the web pages
            it serves.
          </p>
          <img className='img-fluid mb-2' src={notAuthImg} alt='Not authorized page' />
          <Button tag={Link} to='/' onClick={dispatch(handleLogout())} color='primary' className='btn-sm-block mb-1'>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  )
}
export default NotAuthorized
