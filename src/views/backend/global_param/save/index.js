// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addGlobalParam, updateGlobalParam } from '../store/action'
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

const GlobalParamSave = () => {
  // ** States & Vars
  const store = useSelector(state => state.globalparams),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl()

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState({label: "Select...", value: 0})
  const status = [
    {
      value: 2,
      label: "Not Active"
    }, 
    {
      value: 1,
      label: "Active"
    }
  ]

  // ** redirect
  const history = useHistory()

  // ** Function to get user on mount
  useEffect(() => {
    if (store.selected !== null && store.selected !== undefined) {
      const findStatus = status.find(r => r.value === store.selected.status)
      setSelectedStatus(findStatus)
    }
  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push("/global_param/list")
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
      
      data.status = selectedStatus.value

      if (id) {
        dispatch(updateGlobalParam(id, data))
      } else {
        dispatch(addGlobalParam(data))
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
                    <span className='align-middle'>Edit Global Param</span>
                  </h4>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='param_key'>Param key</Label>
                    <Input
                      id='param_key'
                      name='param_key'
                      defaultValue={store.selected.param_key}
                      placeholder='Param key'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.param_key
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='param_value'>Param Value</Label>
                    <Input
                      id='param_value'
                      name='param_value'
                      defaultValue={store.selected.param_value}
                      placeholder='Param value'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.param_value
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='param_desc'>Param description</Label>
                    <Input
                      id='param_desc'
                      name='param_desc'
                      defaultValue={store.selected.param_desc}
                      placeholder='Param description'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.param_desc
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='status'>Status</Label>
                    <Controller
                      name='status'
                      id='status'
                      control={control}
                      invalid={data !== null && (data.status === undefined || data.status === null)}
                      defaultValue={selectedStatus}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={status}
                            value={selectedStatus}
                            onChange={data => {
                              onChange(data)
                              setSelectedStatus(data)
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
                  <Link to='/global_param/list'>
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
                    <span className='align-middle'><FormattedMessage id='Add'/> Global Param</span>
                  </h4>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='param_key'>Param key</Label>
                    <Input
                      id='param_key'
                      name='param_key'
                      placeholder='Param key'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.param_key
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='param_value'>Param Value</Label>
                    <Input
                      id='param_value'
                      name='param_value'
                      placeholder='Param value'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.param_value
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='param_desc'>Param description</Label>
                    <Input
                      id='param_desc'
                      name='param_desc'
                      placeholder='Param description'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.param_desc
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='status'>Status</Label>
                    <Controller
                      name='status'
                      id='status'
                      control={control}
                      invalid={data !== null && (data.status === undefined || data.status === null)}
                      defaultValue={selectedStatus}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={status}
                            value={selectedStatus}
                            onChange={data => {
                              onChange(data)
                              setSelectedStatus(data)
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
                  <Link to='/global_param/list'>
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
export default GlobalParamSave
