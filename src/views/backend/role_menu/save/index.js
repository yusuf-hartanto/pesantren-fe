// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Store & Actions
import { addRoleMenu } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'
import { getAllDataRole } from '@src/views/backend/role/store/action'

// ** Third Party Components
import { User, Info, Share2, MapPin, Check, X } from 'react-feather'
import { Card, CardBody, Row, Col, Alert, Button, Label, FormGroup, Input, CustomInput, Form, Table } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import Select from 'react-select'
import { FormattedMessage } from 'react-intl'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import * as Feather from 'react-feather'

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

const RoleMenuSave = () => {
  // ** States & Vars
  const store = useSelector(state => state.rolemenus),
    dispatch = useDispatch(),
    { id } = useParams(),
    roles = useSelector(state => state.roles),
    navigations = useSelector(state => state.navigations)

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  // ** State
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  const [menuReady, setMenuReady] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState([])
  const [menus, setMenus] = useState([])
  const [selectedRole, setSelectedRole] = useState({value: '', label: 'Select...'})

  let number = 0

  // ** redirect
  const history = useHistory()

  // ** Function to get employee on mount
  useEffect(() => {
    if (store.selected !== null && store.selected !== undefined) {

      const selectRole = {
        value: store.selected.role_id,
        label: store.selected.role_name
      }

      setSelectedMenu(store.selected.menu.map(d => {
        return {
          menu_id: d.menu_id,
          create: d.role_menu_create,
          edit: d.role_menu_edit,
          delete: d.role_menu_delete,
          approve: d.role_menu_approve,
          status: d.role_menu_status
        }
      }))

      setSelectedRole(selectRole)
    } 

    setMenuReady(true)
    dispatch(getAllDataRole())
  }, [dispatch])

  useEffect(() => {

    if (store.success) {
      toast.success(
        <ToastContent text={null} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push("/role_menu/list")
    } else if (store.error) {
      toast.error(
        <ToastContent text={store.error} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
    }
  }, [store.loading])

  useEffect(() => {
    if (navigations.allData.length > 0) {
      setMenus(navigations.allData)
    }
  }, [navigations.allData])
  

  const onSubmit = data => {

    if (isObjEmpty(errors)) {

      if (selectedRole.value === '') {
        toast.error(
          <ToastContent text={'Role required'} />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        )

        return
      } 

      if (selectedMenu.length === 0) {
        toast.error(
          <ToastContent text={'Check list menu'} />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        )

        return
      }

      setData(data)
      const datas = [
        {
          role_id: selectedRole,
          menu: selectedMenu
        }
      ]

      dispatch(addRoleMenu(datas))
    }
  }

  const handleCheckbox = (id, mode) => {
    setMenuReady(false)
    setTimeout(() => {
      setMenuReady(true)
    }, 10)

    let oldMenu = selectedMenu

    const find = oldMenu.find(d => d.menu_id === id)
    
    switch (mode) {
      case 'create':

        if (find) {
          oldMenu = oldMenu.map(d => {
            if (d.menu_id === id) {
              if (d.create === 0) {
                d.create = 1
              } else {
                d.create = 0
              }
              
            }

            return d
          })
        } else {
          oldMenu.push({
            menu_id: id,
            create: 1,
            edit: 0,
            delete: 0,
            approve: 0,
            status: 0
          })
        }
        
        break
      case 'edit':

        if (find) {
          oldMenu = oldMenu.map(d => {
            if (d.menu_id === id) {
              if (d.edit === 0) {
                d.edit = 1
              } else {
                d.edit = 0
              }
              
            }

            return d
          })
        } else {
          oldMenu.push({
            menu_id: id,
            create: 0,
            edit: 1,
            delete: 0,
            approve: 0,
            status: 0
          })
        }
        break
      case 'delete':

        if (find) {
          oldMenu = oldMenu.map(d => {
            if (d.menu_id === id) {
              if (d.delete === 0) {
                d.delete = 1
              } else {
                d.delete = 0
              }
              
            }

            return d
          })
        } else {
          oldMenu.push({
            menu_id: id,
            create: 0,
            edit: 0,
            delete: 1,
            approve: 0,
            status: 0
          })
        }
    
        break
      case 'approve':

        if (find) {
          oldMenu = oldMenu.map(d => {
            if (d.menu_id === id) {
              if (d.approve === 0) {
                d.approve = 1
              } else {
                d.approve = 0
              }
              
            }

            return d
          })
        } else {
          oldMenu.push({
            menu_id: id,
            create: 0,
            edit: 0,
            delete: 0,
            approve: 1,
            status: 0
          })
        }
    
        break
    
      default:

        if (find) {
          oldMenu = oldMenu.filter(d => d.menu_id !== id)
        } else {
          oldMenu.push({
            menu_id: id,
            create: 0,
            edit: 0,
            delete: 0,
            approve: 0,
            status: 0
          })
        }

        break
    }

    setSelectedMenu(oldMenu)
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
                    <span className='align-middle'>Assign Role Menu</span>
                  </h4>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label for='role_id'>Role</Label>
                    <Controller
                      name='role_id'
                      id='role_id'
                      control={control}
                      invalid={data !== null && (data.role_id === undefined || data.role_id === null)}
                      defaultValue={{value: store.selected?.role_id, label: store.selected?.role_name}}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={roles.allData.map(r => {
                              return {
                                value: r.role_id,
                                label: r.role_name
                              }
                            })}
                            value={selectedRole}
                            onChange={data => {
                              onChange(data)
                              setSelectedRole(data)
                            }}
                            isDisabled
                          />
                        )
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='12'>
                  <Table responsive style={{backgroundColor: '#FFFFFF', borderRadius: 5}}>
                    <thead className="borderless">
                      <tr>
                        <td scope='col' className='text-nowrap'>
                          No
                        </td>
                        <td scope='col' className='text-nowrap'>
                          Menu Name
                        </td>
                        <td scope='col' className='text-nowrap'>
                          Module Name
                        </td>
                        <td scope='col' colSpan={5} className='text-nowrap'>
                          Menu Icon
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {menus.map((data, key) => {

                        const Icon = data.menu_icon ? Feather[data.menu_icon] : Feather['Circle']
                        number++
                        return (
                          <Fragment key={key}>
                            <tr>
                              <td className='text-nowrap'>{number}</td>
                              <td className='text-nowrap'>{data.menu_name}</td>
                              <td className='text-nowrap'>{data.module_name}</td>
                              <td className='text-nowrap'>
                                <Icon size={18} className={`text-primary`} />
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='View' type='checkbox' id={`menu-${key}`} onChange={() => handleCheckbox(data.menu_id, 'view')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id)}/>}
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='Create' type='checkbox' id={`create-${key}`} onChange={() => handleCheckbox(data.menu_id, 'create')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id && r.create === 1)}/>}
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='Edit' type='checkbox' id={`edit-${key}`} onChange={() => handleCheckbox(data.menu_id, 'edit')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id && r.edit === 1)}/>}
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='Delete' type='checkbox' id={`delete-${key}`} onChange={() => handleCheckbox(data.menu_id, 'delete')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id && r.delete === 1)}/>}
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='Approve' type='checkbox' id={`approve-${key}`} onChange={() => handleCheckbox(data.menu_id, 'approve')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id && r.approve === 1)}/>}
                              </td>
                            </tr>
                            {data.children.map((dt, ky) => {

                              const Icon = dt.menu_icon ? Feather[dt.menu_icon] : Feather['Circle']
                              number++
                              return (
                                <Fragment key={ky}>
                                  <tr>
                                    <td className='text-nowrap'>{number}</td>
                                    <td className='text-nowrap'><span className='ml-2'>{dt.menu_name}</span></td>
                                    <td className='text-nowrap'>{dt.module_name}</td>
                                    <td className='text-nowrap'>
                                      <Icon size={18} className={`text-primary`} />
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='View' type='checkbox' id={`menu-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'view')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id)}/>}
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='Create' type='checkbox' id={`create-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'create')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id && r.create === 1)}/>}
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='Edit' type='checkbox' id={`edit-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'edit')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id && r.edit === 1)}/>}
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='Delete' type='checkbox' id={`delete-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'delete')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id && r.delete === 1)}/>}
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='Approve' type='checkbox' id={`approve-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'approve')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id && r.approve === 1)}/>}
                                    </td>
                                  </tr>
                                  {dt.children.map((d, k) => {

                                    const Icon = d.menu_icon ? Feather[d.menu_icon] : Feather['Circle']
                                    number++
                                    return (
                                      <Fragment key={k}>
                                        <tr>
                                          <td className='text-nowrap'>{number}</td>
                                          <td className='text-nowrap'><span className='ml-4'>{d.menu_name}</span></td>
                                          <td className='text-nowrap'>{d.module_name}</td>
                                          <td className='text-nowrap'>
                                            <Icon size={18} className={`text-primary`} />
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='View' type='checkbox' id={`menu-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'view')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id)}/>}
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='Create' type='checkbox' id={`create-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'create')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id && r.create === 1)}/>}
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='Edit' type='checkbox' id={`edit-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'edit')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id && r.edit === 1)}/>}
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='Delete' type='checkbox' id={`delete-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'delete')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id && r.delete === 1)}/>}
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='Approve' type='checkbox' id={`approve-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'approve')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id && r.approve === 1)}/>}
                                          </td>
                                        </tr>
                                      </Fragment>
                                    )
                                  })}
                                </Fragment>
                              )
                            })}
                          </Fragment>
                        )
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                <Col className='d-flex flex-sm-row flex-column mt-2'>
                  <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1'>
                    <FormattedMessage id='Save' />
                  </Button>
                  <Link to='/role_menu/list'>
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
                    <span className='align-middle'><FormattedMessage id='Add'/> Assign Role Menu</span>
                  </h4>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label for='role_id'>Role</Label>
                    <Controller
                      name='role_id'
                      id='role_id'
                      control={control}
                      invalid={data !== null && (data.role_id === undefined || data.role_id === null)}
                      defaultValue={selectedRole}
                      render={({value, onChange}) => {

                        return (
                          <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={roles.allData.map(r => {
                              return {
                                value: r.role_id,
                                label: r.role_name
                              }
                            })}
                            value={selectedRole}
                            onChange={data => {
                              onChange(data)
                              setSelectedRole(data)
                            }}
                          />
                        )
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='12'>
                  <Table responsive style={{backgroundColor: '#FFFFFF', borderRadius: 5}}>
                    <thead className="borderless">
                      <tr>
                        <td scope='col' className='text-nowrap'>
                          No
                        </td>
                        <td scope='col' className='text-nowrap'>
                          Menu Name
                        </td>
                        <td scope='col' className='text-nowrap'>
                          Module Name
                        </td>
                        <td scope='col' colSpan={5} className='text-nowrap'>
                          Menu Icon
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {menus.map((data, key) => {
                        
                        const Icon = data.menu_icon ? Feather[data.menu_icon] : Feather['Circle']

                        return (
                          <Fragment key={key}>
                            <tr>
                              <td className='text-nowrap'>{key + 1}</td>
                              <td className='text-nowrap'>{data.menu_name}</td>
                              <td className='text-nowrap'>{data.module_name}</td>
                              <td className='text-nowrap'>
                                <Icon size={18} className={`text-primary`} />
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='View' type='checkbox' id={`menu-${key}`} onChange={() => handleCheckbox(data.menu_id, 'view')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id)}/>}
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='Create' type='checkbox' id={`create-${key}`} onChange={() => handleCheckbox(data.menu_id, 'create')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id && r.create === 1)}/>}
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='Edit' type='checkbox' id={`edit-${key}`} onChange={() => handleCheckbox(data.menu_id, 'edit')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id && r.edit === 1)}/>}
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='Delete' type='checkbox' id={`delete-${key}`} onChange={() => handleCheckbox(data.menu_id, 'delete')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id && r.delete === 1)}/>}
                              </td>
                              <td className='text-nowrap'>
                                {menuReady && <CustomInput label='Approve' type='checkbox' id={`approve-${key}`} onChange={() => handleCheckbox(data.menu_id, 'approve')} defaultChecked={selectedMenu.find(r => r.menu_id === data.menu_id && r.approve === 1)}/>}
                              </td>
                            </tr>
                            {data.children.map((dt, ky) => {

                              const Icon = dt.menu_icon ? Feather[dt.menu_icon] : Feather['Circle']

                              return (
                                <Fragment key={ky}>
                                  <tr>
                                    <td className='text-nowrap'></td>
                                    <td className='text-nowrap'><span className='ml-2'>{dt.menu_name}</span></td>
                                    <td className='text-nowrap'>{dt.module_name}</td>
                                    <td className='text-nowrap'>
                                      <Icon size={18} className={`text-primary`} />
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='View' type='checkbox' id={`menu-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'view')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id)}/>}
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='Create' type='checkbox' id={`create-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'create')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id && r.create === 1)}/>}
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='Edit' type='checkbox' id={`edit-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'edit')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id && r.edit === 1)}/>}
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='Delete' type='checkbox' id={`delete-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'delete')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id && r.delete === 1)}/>}
                                    </td>
                                    <td className='text-nowrap'>
                                      {menuReady && <CustomInput label='Approve' type='checkbox' id={`approve-${key}-${ky}`} onChange={() => handleCheckbox(dt.menu_id, 'approve')} defaultChecked={selectedMenu.find(r => r.menu_id === dt.menu_id && r.approve === 1)}/>}
                                    </td>
                                  </tr>
                                  {dt.children.map((d, k) => {

                                    const Icon = d.menu_icon ? Feather[d.menu_icon] : Feather['Circle']

                                    return (
                                      <Fragment key={k}>
                                        <tr>
                                          <td className='text-nowrap'></td>
                                          <td className='text-nowrap'><span className='ml-4'>{d.menu_name}</span></td>
                                          <td className='text-nowrap'>{d.module_name}</td>
                                          <td className='text-nowrap'>
                                            <Icon size={18} className={`text-primary`} />
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='View' type='checkbox' id={`menu-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'view')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id)}/>}
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='Create' type='checkbox' id={`create-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'create')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id && r.create === 1)}/>}
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='Edit' type='checkbox' id={`edit-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'edit')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id && r.edit === 1)}/>}
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='Delete' type='checkbox' id={`delete-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'delete')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id && r.delete === 1)}/>}
                                          </td>
                                          <td className='text-nowrap'>
                                            {menuReady && <CustomInput label='Approve' type='checkbox' id={`approve-${key}-${ky}-${k}`} onChange={() => handleCheckbox(d.menu_id, 'approve')} defaultChecked={selectedMenu.find(r => r.menu_id === d.menu_id && r.approve === 1)}/>}
                                          </td>
                                        </tr>
                                      </Fragment>
                                    )
                                  })}
                                </Fragment>
                              )
                            })}
                          </Fragment>
                        )
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                <Col className='d-flex flex-sm-row flex-column mt-2'>
                  <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1'>
                    <FormattedMessage id='Save' />
                  </Button>
                  <Link to='/role_menu/list'>
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
export default RoleMenuSave
