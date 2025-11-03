import { useState, useContext, Fragment, useEffect } from 'react'
import classnames from 'classnames'
import Avatar from '@components/avatar'
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import { handleLogin } from '@store/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import { Link, useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { isObjEmpty, selectThemeColors } from '@utils'
import { HelpCircle, Coffee } from 'react-feather'
import {
  Alert,
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Input,
  FormGroup,
  Label,
  CustomInput,
  Button,
  UncontrolledTooltip
} from 'reactstrap'

import Logo from '@src/assets/images/logo/logo.jpg'

import '@styles/base/pages/page-auth.scss'

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully logged in as an {role} user to Pesantren. Now you can start to explore. Enjoy!</span>
    </div>
  </Fragment>
)

const Login = props => {
  const [skin, setSkin] = useSkin()
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorResponse, setErrorRespone] = useState('')

  const { register, errors, handleSubmit, setError, control } = useForm()
  const source = require(`@src/assets/images/pages/login.svg`).default

  const onSubmit = data => {
    if (isObjEmpty(errors)) {
      setErrorRespone('')
      useJwt
        .login({ username, password })
        .then(res => {

          if (res.data.status) {
            const {userdata, access_token, refresh_token} = res.data.data

            let menus = []
            if (userdata.role?.role_name === "administrator") {
              menus = [
                {
                  action: 'manage',
                  subject: 'all'
                }
              ]
            } else {

              for (const key in userdata.ability) {

                menus.push({
                  action: 'read',
                  subject: userdata.ability[key].module_name !== '#' ? userdata.ability[key].module_name.toLowerCase() : `#${userdata.ability[key].menu_id}`
                })
                
                if (userdata.ability[key].role_menu_create === 1) {
                  menus.push({
                    action: 'create',
                    subject: userdata.ability[key].module_name !== '#' ? userdata.ability[key].module_name.toLowerCase() : `#${userdata.ability[key].menu_id}`
                  })
                }

                if (userdata.ability[key].role_menu_edit === 1) {
                  menus.push({
                    action: 'edit',
                    subject: userdata.ability[key].module_name !== '#' ? userdata.ability[key].module_name.toLowerCase() : `#${userdata.ability[key].menu_id}`
                  })
                }

                if (userdata.ability[key].role_menu_delete === 1) {
                  menus.push({
                    action: 'delete',
                    subject: userdata.ability[key].module_name !== '#' ? userdata.ability[key].module_name.toLowerCase() : `#${userdata.ability[key].menu_id}`
                  })
                }

                if (userdata.ability[key].role_menu_approve === 1) {
                  menus.push({
                    action: 'approve',
                    subject: userdata.ability[key].module_name !== '#' ? userdata.ability[key].module_name.toLowerCase() : `#${userdata.ability[key].menu_id}`
                  })
                }
              }

              menus.push({
                action: 'read',
                subject: 'profile'
              })
            }

            const abilitys = {
              ability: menus
            }

            Object.assign(res.data.data, abilitys)

            const data = { ...res.data.data, access_token, refresh_token }
            dispatch(handleLogin(data))

            ability.update(menus)
            history.push('/')
            toast.success(
              <ToastContent name={userdata.full_name || 'Admin'} role={userdata.full_name || 'Admin'} />,
              { transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
          } else {
            setErrorRespone(res.data.message)
          }
        })
        .catch(err => {

          const {response} = err
          if (response?.status === 422) {
            const {data} = response
            setError(data.message.property, {
              message: data.message
            })
            setErrorRespone(data.message)
          } else if (response?.status === 400) {
            const {data} = response
            setErrorRespone(data.message)
          } else if (response?.status === 404) {
            const {data} = response
            setErrorRespone(data.message)
          }
        })
    }
  }

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/'>
          <img src={Logo} width="40"/>
          <h2 className='brand-text text-primary ml-1'>Pesantren</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login V2' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='font-weight-bold mb-1'>
              Welcome to Pesantren! 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            {errorResponse && 
              <Alert color='primary'>
                <div className='alert-body font-small-2'>
                  <p>
                    <small className='mr-50'>
                      <span className='font-weight-bold'>{errorResponse}</span>
                    </small>
                  </p>
                </div>
                <HelpCircle
                  id='login-tip'
                  className='position-absolute'
                  size={18}
                  style={{ top: '10px', right: '10px' }}
                />
                <UncontrolledTooltip target='login-tip' placement='left'>
                  Error response
                </UncontrolledTooltip>
              </Alert>
            }
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label className='form-label' for='username'>
                  Username
                </Label>
                <Input
                  autoFocus
                  type='username'
                  value={username}
                  id='username'
                  name='username'
                  placeholder='username'
                  onChange={e => setUsername(e.target.value)}
                  className={classnames({ 'is-invalid': errors['username'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='password'>
                    Password
                  </Label>
                </div>
                <InputPasswordToggle
                  value={password}
                  id='password'
                  name='password'
                  onChange={e => setPassword(e.target.value)}
                  className={classnames({ 'is-invalid': errors['password'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              <Button.Ripple type='submit' color='primary' block>
                Sign in
              </Button.Ripple>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
