// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile } from './store/action'

// ** Third Party Components
import { User, Info, Share2, MapPin, Check, X } from 'react-feather'
import { Card, CardBody, Row, Col, Alert, Button, Label, FormGroup, Input, CustomInput, Form, Media } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { FormattedMessage, useIntl } from 'react-intl'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import Select from 'react-select'
import logoDefault from '@src/assets/images/avatars/avatar-blank.png'
import ModalCamera from '@src/layouts/components/Camera'

const ToastContent = ({ text }) => {
  if (text) {
    return (
      <Fragment>
        <div className='toastify-header'>
          <div className='title-wrapper'>
            <Avatar size='sm' color='danger' icon={<X size={12} />} />
            <h6 className='toast-title font-weight-bold'>Error</h6>
          </div>
          <div className='toastify-body'>
            <span>{text}</span>
          </div>
        </div>
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <div className='toastify-header'>
          <div className='title-wrapper'>
            <Avatar size='sm' color='success' icon={<Check size={12} />} />
            <h6 className='toast-title font-weight-bold'>Success</h6>
          </div>
        </div>
      </Fragment>
    )
  }
}

// ** Styles
import '@styles/react/apps/app-users.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

// ** Utils
import { isObjEmpty, dataURLtoFile, isUserLoggedIn, selectThemeColors } from '@utils'

const ProfileSave = () => {
  // ** States & Vars
  const store = useSelector(state => state.profile),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl()

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger, setError } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [logo, setLogo] = useState({file: null, link: null})
  const [userData, setUserData] = useState(null)
  const [modalCamera, setModalCamera] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedRegency, setSelectedRegency] = useState(null)

  // ** redirect
  const history = useHistory()

  // ** Function to get user on mount
  useEffect(() => {

    if (isUserLoggedIn() !== null) {
      const dataProfile = JSON.parse(localStorage.getItem('userData'))
      setUserData(dataProfile.userdata)
    }
  }, [])

  useEffect(() => {
    if (store.selected !== null && store.selected !== undefined) {
      const linkLogo = `${process.env.REACT_APP_BASE_URL}${store.selected.image_foto}`
      setLogo({...logo, link: linkLogo})
    }
  }, [store.selected])

  useEffect(() => {

  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
    } else if (store.error) {
      toast.error(
        <ToastContent text={store.error} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
    }
  }, [store.loading])

  const onChangeLogo = e => {

    const reader = new FileReader(),
      files = e.target.files

    if (files.length <= 0) return

    reader.onload = function () {
      const blobURL = URL.createObjectURL(files[0])
      setLogo({file: files[0], link: blobURL})
    }
    reader.readAsDataURL(files[0])
  }

  const onSubmit = data => {

    if (isObjEmpty(errors)) {

      setData(data)
      const datas = new FormData()

      if (data.password !== data.password_confirm) {
        setError('password_confirm', {
          message: 'Password not match'
        })
        return null
      }

      if (data.password) {
        if (data.password.length < 8) {
          setError('password', {
            message: 'Password min. 8'
          })
          return null
        }
        datas.append('password', data.password)
      }

      datas.append('email', data.email)
      datas.append('image_foto', logo.file)
      datas.append('full_name', data.full_name)
      datas.append('place_of_birth', data.place_of_birth)
      datas.append('date_of_birth', data.date_of_birth)
      datas.append('telepon', data.telepon)
      datas.append('province_id', JSON.stringify(selectedProvince))
      datas.append('regency_id', JSON.stringify(selectedRegency))

      dispatch(updateProfile(userData.resource_id, datas))
    }
  }

  const handleTakePhoto = e => {
    const convertedFile = dataURLtoFile(e, `${Math.random(10)}.jpg`)
    setLogo({file: convertedFile, link: e})
  }

  return store.selected !== null && store.selected !== undefined ? (
    <Row className='app-user-edit'>
      <Col sm='12'>
        <Card>
          <CardBody className='pt-2'>
            <Form
              onSubmit={handleSubmit(onSubmit)}
            >
              <Row className='mt-1'>
                <Col sm='12'>
                  <h4 className='mb-1'>
                    <User size={20} className='mr-50' />
                    <span className='align-middle'>Edit Profil</span>
                  </h4>
                </Col>
                <Col sm='12'>
                  <Media>
                    <Media className='mr-25' left>
                      <Media object className='rounded mr-50' src={logo.link ? logo.link : logoDefault} alt='Profile' onError={() => setLogo({...logo, link: logoDefault})} height='100' width='100' />
                    </Media>
                    <Media className='mt-75 ml-1' body>
                      <Button.Ripple tag={Label} className='mr-75' size='sm' color='primary'>
                        Upload
                        <Input type='file' onChange={onChangeLogo} hidden accept='image/*' />
                      </Button.Ripple>
                      <Button.Ripple tag={Label} className='mr-75' size='sm' color='primary' onClick={() => setModalCamera(true)}>
                        Take
                      </Button.Ripple>
                      <Button.Ripple style={{marginBottom: '4px'}} color='secondary' size='sm' outline onClick={() => setLogo({file: null, link: null})}>
                        Reset
                      </Button.Ripple>
                      <p>Allowed JPG or PNG. Max size of 1MB</p>
                    </Media>
                  </Media>
                  <ModalCamera onTake={(e) => handleTakePhoto(e)} isOpen={modalCamera} toggle={() => setModalCamera(!modalCamera)}/>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='full_name'>Nama Lengkap</Label>
                    <Input
                      id='full_name'
                      name='full_name'
                      defaultValue={store.selected.full_name}
                      placeholder={'Nama Lengkap'}
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.full_name
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='place_of_birth'>Tempat Lahir</Label>
                    <Input
                      id='place_of_birth'
                      name='place_of_birth'
                      defaultValue={store.selected.place_of_birth}
                      placeholder={'Tempat Lahir'}
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.place_of_birth
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='date_of_birth'>Tanggal Lahir</Label>
                    <Input
                      id='date_of_birth'
                      name='date_of_birth'
                      type='date'
                      defaultValue={store.selected.date_of_birth}
                      placeholder={'Tanggal Lahir'}
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.date_of_birth
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='email'>Email</Label>
                    <Input
                      id='email'
                      name='email'
                      defaultValue={store.selected.email}
                      placeholder={'Email'}
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.email
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='telepon'>Telepon</Label>
                    <Input
                      id='telepon'
                      name='telepon'
                      defaultValue={store.selected.telepon}
                      placeholder={'Telepon'}
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.telepon
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='password'>Password</Label>
                    <Input
                      id='password'
                      name='password'
                      type='password'
                      defaultValue={''}
                      placeholder={'Password'}
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.password
                      })}
                    />
                    {errors.password && <div className='invalid-feedback'>{errors.password.message}</div>}
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='password_confirm'>Password Retype</Label>
                    <Input
                      id='password_confirm'
                      name='password_confirm'
                      type='password'
                      defaultValue={''}
                      placeholder={'Password Retype'}
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.password_confirm
                      })}
                    />
                    {errors.password_confirm && <div className='invalid-feedback'>{errors.password_confirm.message}</div>}
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='province_id'>Provinsi</Label>
                    <Controller
                      name='province_id'
                      id='province_id'
                      control={control}
                      invalid={data !== null && (data.province_id === undefined || data.province_id === null)}
                      defaultValue={selectedProvince}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={[]}
                            value={selectedProvince}
                            onChange={data => {
                              onChange(data)
                              setSelectedProvince(data)
                            }}
                          />
                        )
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='regency_id'>Kabupaten</Label>
                    <Controller
                      name='regency_id'
                      id='regency_id'
                      control={control}
                      invalid={data !== null && (data.regency_id === undefined || data.regency_id === null)}
                      defaultValue={selectedRegency}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={[]}
                            value={selectedRegency}
                            onChange={data => {
                              onChange(data)
                              setSelectedRegency(data)
                            }}
                          />
                        )
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className='d-flex flex-sm-row flex-column mt-2'>
                  <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1'>
                    <FormattedMessage id='Save'/>
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  ) : null
}
export default ProfileSave
