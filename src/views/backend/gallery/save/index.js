// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addGallery, updateGallery } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'

// ** Third Party Components
import { User, Check, X, UploadCloud } from 'react-feather'
import { Card, CardBody, Row, Col, Button, Label, FormGroup, Input, Form, Media, Progress } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'
import 'cleave.js/dist/addons/cleave-phone.us'
import { FormattedMessage, useIntl } from 'react-intl'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import Select from 'react-select'
import logoDefault from '@src/assets/images/avatars/picture-blank.png'
import Dropzone from 'react-dropzone'

const ToastGallery = ({ text }) => {
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
import '@styles/react/libs/file-uploader/file-uploader.scss'

// ** Utils
import { isObjEmpty, selectThemeColors } from '@utils'

const GallerySave = () => {
  // ** States & Vars
  const store = useSelector(state => state.gallerys),
    dispatch = useDispatch(),
    { id } = useParams(),
    intl = useIntl()

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState({label: "Select...", value: "1"})
  const [logo, setLogo] = useState({file: null, link: null})
  const [photos, setPhotos] = useState([])
  const [deletePhotos, setDeletePhotos] = useState([])
  const [image, setImage] = useState({file: null, link: null})

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
      setLogo({...logo, link: linkLogo})

      setPhotos(store.selected.detail.map(data => {
        return {
          id: data.id,
          link: `${process.env.REACT_APP_BASE_URL}${data.path_image}`,
          isCloud: true
        }
      }))
    }
    
  }, [dispatch])

  useEffect(() => {
    if (image.file) {
      let oldPhotos = photos
      oldPhotos = oldPhotos.concat(image)
      setPhotos(oldPhotos)
    }
  }, [image])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastGallery text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push("/gallery/list")
    } else if (store.error) {
      toast.error(
        <ToastGallery text={store.error} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
    }
  }, [store.loading])

  const onSubmit = data => {

    if (isObjEmpty(errors)) {

      setData(data)

      const datas = new FormData()

      datas.append('status', selectedStatus.value)
      datas.append('folder_name', data.folder_name)
      datas.append('description', data.description)
      datas.append('image', logo.file)

      for (const photo of photos) {
        if (!photo.isCloud) {
          datas.append('images', photo.file)
        }
      } 

      if (id) {
        datas.append('detail_delete', JSON.stringify(deletePhotos))
        dispatch(updateGallery(id, datas))
      } else {
        dispatch(addGallery(datas))
      }
      
    }
  }

  const handleDropZone = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents

        if ((file.size / (1024 * 1024)) > parseFloat(process.env.REACT_APP_MAX_IMAGE)) {
          toast.error(
            <ToastGallery text={`${file.name} Ukuran terlalu besar. Max 10MB`} />,
            { transition: Slide, hideProgressBar: true, autoClose: 5000 }
          )
        } else {
          const blobURL = URL.createObjectURL(file)

          setImage({
            file, link: blobURL
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemovePhoto = (key) => {
    let oldPhotos = photos
    const oldDeletePhotos = deletePhotos
    
    if (oldPhotos[key].isCloud) {
      oldDeletePhotos.push(oldPhotos[key].id)
    }

    oldPhotos = oldPhotos.filter((d, k) => k !== key)
    setPhotos(oldPhotos)
    setDeletePhotos(oldDeletePhotos)
  }

  const onChangeLogo = e => {

    const reader = new FileReader(),
      files = e.target.files

    if (files.length <= 0) return

    reader.onload = function () {

      if ((files[0].size / (1024 * 1024)) > parseFloat(process.env.REACT_APP_MAX_IMAGE)) {
        toast.error(
          <ToastGallery text={`${files[0].name} Ukuran terlalu besar. Max 10MB`} />,
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
                    <span className='align-middle'>{`${isEdit ? 'Edit' : 'Tambah'} Gallery`}</span>
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
                <Col sm='12' md='8'>
                  <FormGroup>
                    <Label for='folder_name'>Judul</Label>
                    <Input
                      id='folder_name'
                      name='folder_name'
                      defaultValue={isEdit ? store.selected.folder_name : ''}
                      placeholder='Judul'
                      innerRef={register({ required: true })}
                      className={classnames({
                        'is-invalid': errors.folder_name
                      })}
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
                <Col sm='12' md='12'>
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
                <Col sm='12'>
                  <Card>
                    <CardBody>
                      <Dropzone accept={{'image/*': []}} onDrop={acceptedFiles => handleDropZone(acceptedFiles)}>
                        {({getRootProps, getInputProps}) => (
                          <div {...getRootProps()} className='dropzone'>
                            <input {...getInputProps()} />
                            <div className="d-flex align-items-center justify-content-center flex-column">
                              <UploadCloud size={100} className='mr-50' />
                              <h5>Drop Photos here or click to upload</h5>
                              <p className="text-secondary">Drop photos here or click <a href="#">browse</a> thorough your machine </p>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                      <ul className="my-2 list-group">
                        {photos.map((data, key) => {

                          return (
                            <li className="d-flex align-items-center justify-content-between list-group-item" key={key}>
                              <div className="file-details d-flex align-items-center">
                                <div className="file-preview me-1 mr-2">
                                  <img className="rounded" src={data.link} height="100" width="100" onError={(e) => (e.target.src = logoDefault)}/>
                                </div>
                              </div>
                              <button type="button" onClick={() => handleRemovePhoto(key)} className="btn-icon btn btn-outline-danger btn-sm">
                                <X size={12}/>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </CardBody>
                  </Card>
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
                  <Link to='/gallery/list'>
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
export default GallerySave
