// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addBawasluUpdate, updateBawasluUpdate } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'
import { getAllDataCategory } from '@src/views/backend/category/store/action'

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

const BawasluUpdateSave = () => {
  // ** States & Vars
  const store = useSelector(state => state.bawasluupdates),
    categorys = useSelector(state => state.categorys),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl()

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState({label: "Select...", value: 3})
  const [selectedCategory, setSelectedCategory] = useState(null)
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
    }
  ]

  // ** redirect
  const history = useHistory()

  // ** Function to get user on mount
  useEffect(() => {
    if (store.selected !== null && store.selected !== undefined) {
      const find = status.find(r => r.value === store.selected.status)
      setSelectedStatus(find)
      setSelectedCategory({label: store.selected.category_name, value: store.selected.category_name})

      const linkLogo = `${process.env.REACT_APP_BASE_URL}${store.selected.path_thumbnail}`
      setLogo({...logo, link: linkLogo})
      setDesc(store.selected.description)
    }

    dispatch(getAllDataCategory())
    
  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push("/bawaslu_update/list")
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
      datas.append('category_name', selectedCategory?.label)
      datas.append('title', data.title)
      datas.append('description', desc)
      datas.append('image', logo.file)

      if (id) {
        dispatch(updateBawasluUpdate(id, datas))
      } else {
        dispatch(addBawasluUpdate(datas))
      }
      
    }
  }

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
                    <span className='align-middle'>{`${isEdit ? 'Edit' : 'Tambah'} Bawaslu Update`}</span>
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
                <Col sm='12' md='8'>
                  <FormGroup>
                    <Label for='category_name'>Kategori</Label>
                    <Controller
                      name='category_name'
                      id='category_name'
                      control={control}
                      invalid={data !== null && (data.category_name === undefined || data.category_name === null)}
                      defaultValue={selectedCategory}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={categorys.allData.map(d => {
                              return {
                                label: d.category_name,
                                value: d.category_name
                              }
                            })}
                            value={selectedCategory}
                            onChange={data => {
                              onChange(data)
                              setSelectedCategory(data)
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
                <Col className='d-flex flex-sm-row flex-column mt-2'>
                  <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1'>
                    <FormattedMessage id='Save'/>
                  </Button>
                  <Link to='/bawaslu_update/list'>
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
export default BawasluUpdateSave
