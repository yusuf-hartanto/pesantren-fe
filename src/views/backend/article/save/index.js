// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addArticle, updateArticle } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'
import { getAllDataCategory } from '@src/views/backend/category/store/action'
import { getAllDataTema } from '@src/views/backend/tema/store/action'
import { getAllDataKomunitas } from '@src/views/backend/komunitas/store/action'

// ** Third Party Components
import { User, Check, X } from 'react-feather'
import { Card, CardBody, Row, Col, Button, Label, FormGroup, Input, Form, Media, Progress } from 'reactstrap'
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

const ArticleSave = () => {
  // ** States & Vars
  const store = useSelector(state => state.articles),
    categorys = useSelector(state => state.categorys),
    temas = useSelector(state => state.temas),
    komunitass = useSelector(state => state.komunitass),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl()

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState({label: "Select...", value: 3})
  const [selectedKomunitas, setSelectedKomunitas] = useState(null)
  const [selectedTema, setSelectedTema] = useState(null)
  const [logo, setLogo] = useState({file: null, link: null})
  const [desc, setDesc] = useState('')

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

  // ** Function to get user on mount
  useEffect(() => {
    if (store.selected !== null && store.selected !== undefined) {
      const find = status.find(r => r.value === store.selected.status)
      setSelectedStatus(find)
      setSelectedKomunitas({label: store.selected.komunitas?.komunitas_name, value: store.selected.komunitas?.id})
      setSelectedTema({label: store.selected.tema?.tema_name, value: store.selected.tema?.id})

      const linkLogo = `${process.env.REACT_APP_BASE_URL}${store.selected.path_thumbnail}`
      setLogo({...logo, link: linkLogo})
      setDesc(store.selected.description)
    }

    dispatch(getAllDataCategory())
    dispatch(getAllDataTema())
    dispatch(getAllDataKomunitas())
    
  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push("/article/list")
    } else if (store.error) {
      toast.error(
        <ToastContent text={store.error} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
    }
  }, [store.loading])

  const onSubmit = data => {

    if (isObjEmpty(errors)) {

      if (!selectedKomunitas) {
        toast.error(
          <ToastContent text={'Komunitas wajib di isi'} />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        )
        return 
      }

      if (!selectedTema) {
        toast.error(
          <ToastContent text={'Tema wajib di isi'} />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        )
        return 
      }

      setData(data)

      const datas = new FormData()

      datas.append('status', selectedStatus.value)
      datas.append('komunitas_id', JSON.stringify(selectedKomunitas))
      datas.append('tema_id', JSON.stringify(selectedTema))
      datas.append('title', data.title)
      datas.append('description', desc)
      datas.append('image', logo.file)

      if (id) {
        dispatch(updateArticle(id, datas))
      } else {
        dispatch(addArticle(datas))
      }
      
    }
  }

  const onChangeLogo = e => {

    const reader = new FileReader(),
      files = e.target.files

    if (files.length <= 0) return

    reader.onload = function () {

      if ((files[0].size / (1024 * 1024)) > parseFloat(process.env.REACT_APP_MAX_IMAGE)) {
        toast.error(
          <ToastContent text={`${files[0].name} Ukuran terlalu besar. Max 10MB`} />,
          { transition: Slide, hideProgressBar: true, autoClose: 5000 }
        )
      } else {
        const blobURL = URL.createObjectURL(files[0])
        setLogo({file: files[0], link: blobURL})
      }
    }
    reader.readAsDataURL(files[0])
  }

  const isEdit = store.selected !== null && store.selected !== undefined

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
                    <span className='align-middle'>{`${isEdit ? 'Edit' : 'Tambah'} Artikel`}</span>
                  </h4>
                </Col>
                {store.progress &&
                  <Col sm='12'>
                    <Progress value={store.progress}>{`${store.progress}%`}</Progress>
                  </Col>
                }
                <Col sm='12'>
                  <Media>
                    <Media className='mr-25' left>
                      <Media object className='rounded mr-50' src={logo.link ? logo.link : logoDefault} alt='Icon' onError={() => setLogo({...logo, link: logoDefault})} width='100' />
                    </Media>
                    <Media className='mt-75 ml-1' body>
                      <Button.Ripple tag={Label} className='mr-75' size='sm' color='primary'>
                        Upload
                        <Input type='file' onChange={onChangeLogo} hidden accept='image/*' />
                      </Button.Ripple>
                      <Button.Ripple style={{marginBottom: '4px'}} color='secondary' size='sm' outline onClick={() => setLogo({file: null, link: null})}>
                        Reset
                      </Button.Ripple>
                      <p>Allowed JPG or PNG. Max size of 1MB</p>
                    </Media>
                  </Media>
                </Col>
                <Col sm='12'>
                  <FormGroup>
                    <Label for='title'>Judul</Label>
                    <Input
                      id='title'
                      name='title'
                      defaultValue={isEdit ? store.selected.title : ''}
                      placeholder='Judul'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.title
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col sm='12' md='4'>
                  <FormGroup>
                    <Label for='komunitas_id'>Komunitas</Label>
                    <Controller
                      name='komunitas_id'
                      id='komunitas_id'
                      control={control}
                      invalid={data !== null && (data.komunitas_id === undefined || data.komunitas_id === null)}
                      defaultValue={selectedKomunitas}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={komunitass.allData.map(d => {
                              return {
                                label: d.komunitas_name,
                                value: d.id
                              }
                            })}
                            value={selectedKomunitas}
                            onChange={data => {
                              onChange(data)
                              setSelectedKomunitas(data)
                            }}
                          />
                        )
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col sm='12' md='4'>
                  <FormGroup>
                    <Label for='tema_id'>Tema</Label>
                    <Controller
                      name='tema_id'
                      id='tema_id'
                      control={control}
                      invalid={data !== null && (data.tema_id === undefined || data.tema_id === null)}
                      defaultValue={selectedTema}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={temas.allData.map(d => {
                              return {
                                label: d.tema_name,
                                value: d.id
                              }
                            })}
                            value={selectedTema}
                            onChange={data => {
                              onChange(data)
                              setSelectedTema(data)
                            }}
                          />
                        )
                      }}
                    />
                  </FormGroup>
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
                    <Label for='description'>Deskripsi</Label>
                    <ReactSummernote
                      value={desc}
                      options={{
                        lang: 'id-ID',
                        height: 350,
                        dialogsInBody: true,
                        toolbar: [
                          ['style', ['style']],
                          ['font', ['bold', 'underline', 'clear']],
                          ['fontname', ['fontname']],
                          ['fontsize', ['fontsize']],
                          ['para', ['ul', 'ol', 'paragraph']],
                          ['table', ['table']],
                          ['insert', ['link', 'picture', 'video']]
                        ],
                        fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36', '48']
                      }}
                      onChange={setDesc}
                      onImageUpload={(files) => {

                        // const datas = new FormData()
                        // datas.append('upload', files[0])
                        // dispatch(uploadImage(datas))
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                {store.progress &&
                  <Col sm='12'>
                    <Progress value={store.progress}>{`${store.progress}%`}</Progress>
                  </Col>
                }
                <Col className='d-flex flex-sm-row flex-column mt-2'>
                  <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1' disabled={store.loading}>
                    <FormattedMessage id='Save'/>
                  </Button>
                  <Link to='/article/list'>
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
export default ArticleSave
