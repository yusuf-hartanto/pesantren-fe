// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addReportArticle, updateReportArticle } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'
import { updateArticle } from '@src/views/backend/article/store/action'

// ** Third Party Components
import { User, Check, X } from 'react-feather'
import { Card, CardBody, Row, Col, Button, Label, FormGroup, Input, Form, Media } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'
import 'cleave.js/dist/addons/cleave-phone.us'
import { FormattedMessage, useIntl } from 'react-intl'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import Select from 'react-select'
import logoDefault from '@src/assets/images/avatars/picture-blank.png'
import ReactSummernote from 'react-summernote'

// ** Styles
import 'react-summernote/dist/react-summernote.css'
import 'react-summernote/lang/summernote-id-ID'

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

const ReportArticleSave = () => {
  // ** States & Vars
  const store = useSelector(state => state.reportarticles),
    articles = useSelector(state => state.articles),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl()

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState({label: "Select...", value: ""})
  const [logo, setLogo] = useState({file: null, link: null})

  const status = [
    {
      value: 1,
      label: "Publish"
    }, 
    {
      value: 2,
      label: "UnPublish"
    },
    {
      value: 3,
      label: "Draft"
    },
    {
      value: 4,
      label: "Dilaporkan"
    },
    {
      value: 5,
      label: "Suspend"
    }
  ]

  // ** redirect
  const history = useHistory()

  useEffect(() => {
    if (articles.selected !== null && articles.selected !== undefined) {
      const find = status.find(r => r.value === articles.selected.status)
      setSelectedStatus(find)

      const linkLogo = `${process.env.REACT_APP_BASE_URL}${articles.selected.path_image}`
      setLogo({...logo, link: linkLogo})
    }
    
  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      
      //update article
      const datas = new FormData()
      datas.append('status', selectedStatus.value)
      datas.append('title', articles.selected.title)
      dispatch(updateArticle(articles.selected.id, datas, res => {
        history.push("/report_article/list")
      }))
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

      const datas = {
        hasil_cek_fakta: data.hasil_cek_fakta,
        status: 2
      }

      if (id) {
        dispatch(updateReportArticle(id, datas))
      } else {
        dispatch(addReportArticle(datas))
      }
      
    }
  }

  const isEdit = store.selected !== null && store.selected !== undefined

  if (!isEdit) {
    return (
      <Row className='app-user-edit'>
        No Action
      </Row>
    )
  }

  return (
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
                    <span className='align-middle'>{`${isEdit ? 'Hasil Cek Fakta' : 'Tambah'}`}</span>
                  </h4>
                </Col>
                {store.progress &&
                  <Col sm='12'>
                    <Progress value={store.progress}>{`${store.progress}%`}</Progress>
                  </Col>
                }
                <Col sm='12'>
                  <h2>{ articles.selected?.title }</h2>
                </Col>
                <Col sm='12'>
                  <div dangerouslySetInnerHTML={{__html: articles.selected?.description}}></div>
                </Col>
                <Col sm='12'>
                  <Media>
                    <Media className='mr-25' left>
                      <Media object className='rounded mr-50' src={logo.link ? logo.link : logoDefault} alt='Icon' onError={() => setLogo({...logo, link: logoDefault})} width='100%' />
                    </Media>
                  </Media>
                </Col>
                <Col sm='12' md='4'>
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
                <Col sm='12'>
                  <FormGroup>
                    <Label for='hasil_cek_fakta'>Hasil Cek Fakta</Label>
                    <Input
                      id='hasil_cek_fakta'
                      name='hasil_cek_fakta'
                      defaultValue={isEdit ? store.selected.hasil_cek_fakta : ''}
                      placeholder='Hasil Cek Fakta'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.hasil_cek_fakta
                      })}
                      type='textarea'
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className='d-flex flex-sm-row flex-column mt-2'>
                  <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1'>
                    <FormattedMessage id='Save'/>
                  </Button>
                  <Link to='/report_article/list'>
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
export default ReportArticleSave
