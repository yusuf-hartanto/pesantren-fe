// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addCategory, updateCategory } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'

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
import logoDefault from '@src/assets/images/avatars/avatar-blank.png'

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

const CategorySave = () => {
  // ** States & Vars
  const store = useSelector(state => state.categorys),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl()

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [selectedType, setSelectedType] = useState({label: "Select..."})
  const [logo, setLogo] = useState({file: null, link: null})

  const type = [
    {
      value: 1,
      label: "Forum"
    }, 
    {
      value: 2,
      label: "Bawaslu Update"
    }
  ]

  // ** redirect
  const history = useHistory()

  // ** Function to get user on mount
  useEffect(() => {
    if (store.selected !== null && store.selected !== undefined) {
      const find = type.find(r => r.value === store.selected.type)
      setSelectedType(find)

      const linkLogo = `${process.env.REACT_APP_BASE_URL}${store.selected.icon_image}`
      setLogo({...logo, link: linkLogo})
    }
    
  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push("/category/list")
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

      datas.append('type', selectedType.value)
      datas.append('category_name', data.category_name)
      datas.append('show_order', data.show_order)
      datas.append('description', data.description)
      datas.append('icon_image', logo.file)

      if (id) {
        dispatch(updateCategory(id, datas))
      } else {
        dispatch(addCategory(datas))
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
                    <span className='align-middle'>{`${isEdit ? 'Edit' : 'Tambah'} Category`}</span>
                  </h4>
                </Col>
                <Col sm='12'>
                  <Media>
                    <Media className='mr-25' left>
                      <Media object className='rounded mr-50' src={logo.link ? logo.link : logoDefault} alt='Icon' onError={() => setLogo({...logo, link: logoDefault})} height='100' width='100' />
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
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='category_name'>Kategori</Label>
                    <Input
                      id='category_name'
                      name='category_name'
                      defaultValue={isEdit ? store.selected.category_name : ''}
                      placeholder='Kategori'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.category_name
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='type'>Tipe</Label>
                    <Controller
                      name='type'
                      id='type'
                      control={control}
                      invalid={data !== null && (data.type === undefined || data.type === null)}
                      defaultValue={selectedType}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={type}
                            value={selectedType}
                            onChange={data => {
                              onChange(data)
                              setSelectedType(data)
                            }}
                          />
                        )
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg='4' md='6'>
                  <FormGroup>
                    <Label for='show_order'>Urutan</Label>
                    <Input
                      id='show_order'
                      name='show_order'
                      type='number'
                      defaultValue={isEdit ? store.selected.show_order : ''}
                      placeholder='Urutan'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.show_order
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col sm='12'>
                  <FormGroup>
                    <Label for='description'>Deskripsi</Label>
                    <Input
                      id='description'
                      name='description'
                      type='textarea'
                      defaultValue={isEdit ? store.selected.description : ''}
                      placeholder='Deskripsi'
                      innerRef={register({ required: false })}
                      className={classnames({
                        'is-invalid': errors.description
                      })}
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
                  <Link to='/category/list'>
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
export default CategorySave
