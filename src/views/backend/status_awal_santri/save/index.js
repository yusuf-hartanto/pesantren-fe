// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addStatusAwalSantri, updateStatusAwalSantri } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'

// ** Third Party Components
import { User, Check, X } from 'react-feather'
import { Card, CardBody, Row, Col, Button, Label, FormGroup, Input, Form } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'
import 'cleave.js/dist/addons/cleave-phone.us'
import { FormattedMessage, useIntl } from 'react-intl'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import Select from 'react-select'

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
import { isObjEmpty, selectThemeColors } from '@utils'
import { status } from '../../../../utility/Constants'

const StatusAwalSantriSave = () => {
  // ** States & Vars
  const store = useSelector(state => state.statusawalsantris),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl()

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)

  // ** redirect
  const history = useHistory()

  // ** Function to get user on mount
  useEffect(() => {
    if (store.selected !== null && store.selected !== undefined) {

    }
  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push("/status_awal_santri/list")
    } else if (store.error) {
      toast.error(
        <ToastContent text={store.error} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
    }
  }, [store.loading])

  const onSubmit = data => {

    if (isObjEmpty(errors)) {

      setData(data)

      if (id) {
        dispatch(updateStatusAwalSantri(id, data))
      } else {
        dispatch(addStatusAwalSantri(data))
      }
      
    }
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
                    <span className='align-middle'>Edit Status Awal Santri</span>
                  </h4>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='kode_statawal'>Kode Status Awal Santri</Label>
                    <Input
                      id='kode_statawal'
                      name='kode_statawal'
                      defaultValue={store.selected.kode_statawal}
                      placeholder='Kode Status Awal Santri'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.kode_statawal
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='nama_statawal'>Nama Status Awal Santri</Label>
                    <Input
                      id='nama_statawal'
                      name='nama_statawal'
                      defaultValue={store.selected.nama_statawal}
                      placeholder='Nama Status Awal Santri'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.nama_statawal
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='keterangan'>Keterangan</Label>
                    <Input
                      id='keterangan'
                      name='keterangan'
                      defaultValue={store.selected.keterangan}
                      placeholder='Keterangan'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.keterangan
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='nomor_urut'>Nomor Urut</Label>
                    <Input
                      id='nomor_urut'
                      name='nomor_urut'
                      defaultValue={store.selected.nomor_urut}
                      placeholder='Nomor Urut'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.nomor_urut
                      })}
                      type='number'
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='status'>Status</Label>
                    <Controller
                      as={Input}
                      type='select'
                      name='status'
                      id='status'
                      control={control}
                      defaultValue={store.selected.status}
                      invalid={data !== null && (data.status === undefined || data.status === null)}
                    >
                      {status().map(r => {
                        return (
                          <option value={r.value} key={r.value}>
                            {r.label}
                          </option>
                        )
                      })}
                    </Controller>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className='d-flex flex-sm-row flex-column mt-2'>
                  <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1'>
                    <FormattedMessage id='Save'/>
                  </Button>
                  <Link to='/status_awal_santri/list'>
                    <Button color='secondary' outline>
                      <FormattedMessage id='Back'/>
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  ) : (
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
                    <span className='align-middle'><FormattedMessage id='Add'/> Status Awal Santri</span>
                  </h4>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='kode_statawal'>Kode Status Awal Santri</Label>
                    <Input
                      id='kode_statawal'
                      name='kode_statawal'
                      placeholder='Kode Status Awal Santri'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.kode_statawal
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='nama_statawal'>Nama Status Awal Santri</Label>
                    <Input
                      id='nama_statawal'
                      name='nama_statawal'
                      placeholder='Nama Status Awal Santri'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.nama_statawal
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='keterangan'>Keterangan</Label>
                    <Input
                      id='keterangan'
                      name='keterangan'
                      placeholder='Keterangan'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.keterangan
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='nomor_urut'>Nomor Urut</Label>
                    <Input
                      id='nomor_urut'
                      name='nomor_urut'
                      placeholder='Nomor Urut'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.nomor_urut
                      })}
                      type='number'
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='status'>Status</Label>
                    <Controller
                      as={Input}
                      type='select'
                      name='status'
                      id='status'
                      control={control}
                      defaultValue="Active"
                      invalid={data !== null && (data.status === undefined || data.status === null)}
                    >
                      {status().map(r => {
                        return (
                          <option value={r.value} key={r.value}>
                            {r.label}
                          </option>
                        )
                      })}
                    </Controller>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className='d-flex flex-sm-row flex-column mt-2'>
                  <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1'>
                    <FormattedMessage id='Save'/>
                  </Button>
                  <Link to='/status_awal_santri/list'>
                    <Button color='secondary' outline>
                      <FormattedMessage id='Back'/>
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}
export default StatusAwalSantriSave
