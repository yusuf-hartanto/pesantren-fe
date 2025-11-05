// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addSemester, updateSemester } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'
import { getAllDataTahunAjaran } from '../../tahun_ajaran/store/action'

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

const SemesterSave = () => {
  // ** States & Vars
  const store = useSelector(state => state.semesters),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl(),
    tahunajarans = useSelector(state => state.tahunajarans)

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState({value: '', label: 'Select...'})

  // ** redirect
  const history = useHistory()

  // ** Function to get user on mount
  useEffect(() => {
    if (store.selected !== null && store.selected !== undefined) {
       setSelectedTahunAjaran({label: store.selected.tahun_ajaran?.tahun_ajaran, value: store.selected.tahun_ajaran?.id_tahunajaran})
    }

    dispatch(getAllDataTahunAjaran())
  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push("/semester/list")
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
        dispatch(updateSemester(id, data))
      } else {
        dispatch(addSemester(data))
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
                    <span className='align-middle'>Edit Semester</span>
                  </h4>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='id_tahunajaran'>Tahun Ajaran</Label>
                    <Controller
                      name='id_tahunajaran'
                      id='id_tahunajaran'
                      control={control}
                      invalid={data !== null && (data.id_tahunajaran === undefined || data.id_tahunajaran === null)}
                      defaultValue={selectedTahunAjaran}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={tahunajarans.allData.map(r => {
                              return {
                                value: r.id_tahunajaran,
                                label: r.tahun_ajaran
                              }
                            })}
                            value={selectedTahunAjaran}
                            onChange={data => {
                              onChange(data)
                              setSelectedTahunAjaran(data)
                            }}
                          />
                        )
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='nama_semester'>Nama Semester</Label>
                    <Input
                      id='nama_semester'
                      name='nama_semester'
                      defaultValue={store.selected.nama_semester}
                      placeholder='Nama Semester'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.nama_semester
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
                  <Link to='/semester/list'>
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
                    <span className='align-middle'><FormattedMessage id='Add'/> Semester</span>
                  </h4>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='id_tahunajaran'>Tahun Ajaran</Label>
                    <Controller
                      name='id_tahunajaran'
                      id='id_tahunajaran'
                      control={control}
                      invalid={data !== null && (data.id_tahunajaran === undefined || data.id_tahunajaran === null)}
                      defaultValue={selectedTahunAjaran}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={tahunajarans.allData.map(r => {
                              return {
                                value: r.id_tahunajaran,
                                label: r.tahun_ajaran
                              }
                            })}
                            value={selectedTahunAjaran}
                            onChange={data => {
                              onChange(data)
                              setSelectedTahunAjaran(data)
                            }}
                          />
                        )
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='nama_semester'>Nama Semester</Label>
                    <Input
                      id='nama_semester'
                      name='nama_semester'
                      placeholder='Nama Semester'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.nama_semester
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
                  <Link to='/semester/list'>
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
export default SemesterSave
