// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addContent, updateContent } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'

// ** Third Party Components
import { User, Check, X } from 'react-feather'
import { Card, CardBody, Row, Col, Button, Label, FormGroup, Input, Form, Media } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'
import ReactSummernote from 'react-summernote'
import 'cleave.js/dist/addons/cleave-phone.us'
import { FormattedMessage, useIntl } from 'react-intl'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import Select from 'react-select'
import logoDefault from '@src/assets/images/avatars/picture-blank.png'

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

const ContentSave = () => {
  // ** States & Vars
  const store = useSelector(state => state.contents),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl()

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState({ label: "Select..." })
  const [logo, setLogo] = useState({ file: null, link: null })
  const [video, setVideo] = useState({ file: null, link: null })
  const [desc, setDesc] = useState('')

  const status = [
    {
      value: 1,
      label: "Active"
    },
    {
      value: 2,
      label: "Deactive"
    }
  ]

  // ** redirect
  const history = useHistory()

  // ** Function to get user on mount
  useEffect(() => {
    if (store.selected !== null && store.selected !== undefined) {
      const find = status.find(r => r.value === store.selected.status)
      setSelectedStatus(find)

      const linkLogo = `${process.env.REACT_APP_BASE_URL}${store.selected.path_thumbnail}`
      setLogo({ ...logo, link: linkLogo })

      const linkVideo = `${process.env.REACT_APP_BASE_URL}${store.selected.path_video}`
      setVideo({ ...video, link: linkVideo })
      setDesc(store.selected.description)
    }

  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push("/content/list")
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

      const datas = new FormData()

      datas.append('status', selectedStatus.value)
      datas.append('header', data.header)
      datas.append('title', data.title)
      datas.append('seq', data.seq)
      datas.append('sort_description', data.sort_description)
      datas.append('link_url', data.link_url)
      datas.append('description', desc)
      datas.append('image', logo.file)
      datas.append('video', logo.file)

      if (id) {
        dispatch(updateContent(id, datas))
      } else {
        dispatch(addContent(datas))
      }

    }
  }

  const onChangeLogo = e => {

    const reader = new FileReader(),
      files = e.target.files

    if (files.length <= 0) return

    reader.onload = function () {
      const blobURL = URL.createObjectURL(files[0])
      setLogo({ file: files[0], link: blobURL })
    }
    reader.readAsDataURL(files[0])
  }

  const onChangeVideo = e => {

    setVideo({ file: null, link: null })

    const reader = new FileReader(),
      files = e.target.files

    if (files.length <= 0) return

    setTimeout(() => {
      reader.onload = function (e) {
        const blobURL = URL.createObjectURL(files[0])
        setVideo({ file: files[0], link: blobURL })
      }
      reader.readAsDataURL(files[0])
    }, 500)
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
                    <span className='align-middle'>{`${isEdit ? 'Edit' : 'Tambah'} Content`}</span>
                  </h4>
                </Col>
                {store.progress &&
                  <Col sm='12'>
                    <Progress value={store.progress}>{`${store.progress}%`}</Progress>
                  </Col>
                }
                <Col sm='12' md='6'>
                  <Media>
                    <Media className='mr-25' left>
                      <Media object className='rounded mr-50' src={logo.link ? logo.link : logoDefault} alt='Icon' onError={() => setLogo({ ...logo, link: logoDefault })} width='100' />
                    </Media>
                    <Media className='mt-75 ml-1' body>
                      <Button.Ripple tag={Label} className='mr-75' size='sm' color='primary'>
                        Upload
                        <Input type='file' onChange={onChangeLogo} hidden accept='image/*' />
                      </Button.Ripple>
                      <Button.Ripple style={{ marginBottom: '4px' }} color='secondary' size='sm' outline onClick={() => setLogo({ file: null, link: null })}>
                        Reset
                      </Button.Ripple>
                      <p>Allowed JPG or PNG. Max size of 1MB</p>
                    </Media>
                  </Media>
                </Col>
                <Col sm='12' md='6'>
                  <Media>
                    <Media className='mr-25' left>
                      {video.file ? (
                        <video width="300" controls>
                          <source src={video.link} />
                        </video>) : (
                        <>
                          {video.link ? (
                            <video width="300" controls>
                              <source src={video.link} />
                            </video>) : (<Media object className='rounded mr-50' src={logoDefault} alt='video' width='100' />)
                          }
                        </>
                      )
                      }
                    </Media>
                    <Media className='mt-75 ml-1' body>
                      <Button.Ripple tag={Label} className='mr-75' size='sm' color='primary'>
                        Upload
                        <Input type='file' onChange={onChangeVideo} hidden accept='video/mp4,video/x-m4v,video/*' />
                      </Button.Ripple>
                      <Button.Ripple style={{ marginBottom: '4px' }} color='secondary' size='sm' outline onClick={() => setVideo({ file: null, link: null })}>
                        Reset
                      </Button.Ripple>
                      <p>Allowed mp4. Max size of 10MB</p>
                    </Media>
                  </Media>
                </Col>
                <Col sm='12' md='6'>
                  <FormGroup>
                    <Label for='header'>Header</Label>
                    <Input
                      id='header'
                      name='header'
                      defaultValue={isEdit ? store.selected.header : ''}
                      placeholder='Header'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.header
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col sm='12' md='6'>
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
                <Col sm='12' md='8'>
                  <FormGroup>
                    <Label for='link_url'>Link</Label>
                    <Input
                      id='link_url'
                      name='link_url'
                      defaultValue={isEdit ? store.selected.link_url : ''}
                      placeholder='Link ex : https://www.bawaslu.go.id'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.link_url
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col sm='12' md='2'>
                  <FormGroup>
                    <Label for='seq'>Urutan</Label>
                    <Input
                      id='seq'
                      name='seq'
                      type='number'
                      defaultValue={isEdit ? store.selected.seq : ''}
                      placeholder='Urutan'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.seq
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col sm='12' md='2'>
                  <FormGroup>
                    <Label for='status'>Status</Label>
                    <Controller
                      name='status'
                      id='status'
                      control={control}
                      invalid={data !== null && (data.status === undefined || data.status === null)}
                      defaultValue={selectedStatus}
                      render={({ value, onChange }) => {

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
                    <Label for='sort_description'>Deskripsi Pendek</Label>
                    <Input
                      id='sort_description'
                      name='sort_description'
                      type='textarea'
                      defaultValue={isEdit ? store.selected.sort_description : ''}
                      placeholder='Deskripsi Pendek'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.sort_description
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col sm='12'>
                  <FormGroup>
                    <Label for='description'>Deskripsi</Label>
                    {/* <Input
                      id='description'
                      name='description'
                      type='textarea'
                      defaultValue={isEdit ? store.selected.description : ''}
                      placeholder='Deskripsi'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.description
                      })}
                    /> */}
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
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className='d-flex flex-sm-row flex-column mt-2'>
                  <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1'>
                    <FormattedMessage id='Save' />
                  </Button>
                  <Link to='/content/list'>
                    <Button color='secondary' outline>
                      <FormattedMessage id='Back' />
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
export default ContentSave
