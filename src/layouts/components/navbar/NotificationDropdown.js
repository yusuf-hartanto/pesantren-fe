// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, X, Check, AlertTriangle } from 'react-feather'
import {
  Button,
  Badge,
  Media,
  CustomInput,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { getDataNotification, updateNotification } from '@src/views/backend/notification/store/action'

import logoDefault from '@src/assets/images/avatars/picture-blank.png'
import { convertToRupiah } from '@utils'

const NotificationDropdown = () => {

  const dispatch = useDispatch()

  // ** State
  const [notif, setNotif] = useState([])
  const [totalNotif, setTotalNotif] = useState(0)

  const statusObj = {
    1: {
      color: 'light-success',
      value: 'Read'
    },
    2: {
      color: 'light-warning',
      value: 'Unread'
    }
  }

  // ** Notification Array
  const notificationsArray = [
    {
      img: require('@src/assets/images/avatars/avatar-blank.png').default,
      subtitle: 'Won the monthly best seller badge.',
      title: (
        <Media tag='p' heading>
          <span className='font-weight-bolder'>Congratulation Sam 🎉</span>winner!
        </Media>
      )
    },
    {
      img: require('@src/assets/images/avatars/avatar-blank.png').default,
      subtitle: 'You have 10 unread messages.',
      title: (
        <Media tag='p' heading>
          <span className='font-weight-bolder'>New message</span>&nbsp;received
        </Media>
      )
    },
    {
      avatarContent: 'MD',
      color: 'light-danger',
      subtitle: 'MD Inc. order updated',
      title: (
        <Media tag='p' heading>
          <span className='font-weight-bolder'>Revised Order 👋</span>&nbsp;checkout
        </Media>
      )
    },
    {
      title: <h6 className='font-weight-bolder mr-auto mb-0'>System Notifications</h6>,
      switch: <CustomInput type='switch' id='primary' name='primary' inline defaultChecked />
    },
    {
      avatarIcon: <X size={14} />,
      color: 'light-danger',
      subtitle: 'USA Server is down due to hight CPU usage',
      title: (
        <Media tag='p' heading>
          <span className='font-weight-bolder'>Server down</span>&nbsp;registered
        </Media>
      )
    },
    {
      avatarIcon: <Check size={14} />,
      color: 'light-success',
      subtitle: 'Last month sales report generated',
      title: (
        <Media tag='p' heading>
          <span className='font-weight-bolder'>Sales report</span>&nbsp;generated
        </Media>
      )
    },
    {
      avatarIcon: <AlertTriangle size={14} />,
      color: 'light-warning',
      subtitle: 'BLR Server using high memory',
      title: (
        <Media tag='p' heading>
          <span className='font-weight-bolder'>High memory</span>&nbsp;usage
        </Media>
      )
    }
  ]

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {notif.map((item) => {
          return (
            <a key={item.id} bg="secondary" className='d-flex' href={item.target_url} onClick={e => {
              e.preventDefault()
              dispatch(updateNotification(item.id, {}, data => {
                window.location.href = item.target_url
              }))
            }}>
              <Media
                className={classnames('d-flex', {
                  'align-items-start': !item.switch,
                  'align-items-center': item.switch
                })}
              >
                {!item.switch ? (
                  <Fragment>
                    <Media left>
                      <Avatar
                        {...(item.img
                          ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                          : item.avatarContent
                          ? {
                              content: item.avatarContent,
                              color: item.color
                            }
                          : item.avatarIcon
                          ? {
                              icon: item.avatarIcon,
                              color: item.color
                            }
                          : null)}
                      />
                    </Media>
                    <Media body>
                      {item.title}
                      <span>{item.status}</span> <small className='notification-text'>{item.subtitle}</small>
                    </Media>
                  </Fragment>
                ) : (
                  <Fragment>
                    {item.title}
                    {item.switch}
                  </Fragment>
                )}
              </Media>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */

  useEffect(() => {

    dispatch(
      getDataNotification({
        page: 1,
        perPage: 1,
        type: 2
      }, data => {
        setTotalNotif(data.data.total)
      })
    )

    dispatch(
      getDataNotification({
        page: 1,
        perPage: 20,
        type: 0
      }, data => {
        setNotif(data.data.values.map(d => {
          return {
            id: d.id,
            title: (
              <Media tag='p' heading>
                <span className='font-weight-bolder'>{d.author?.full_name}</span>
              </Media>
            ),
            subtitle: d.text_message,
            img: d.author?.image_foto ? `${process.env.REACT_APP_BASE_URL}${d.author?.image_foto ?? ''}` : logoDefault,
            target_url: d.target_url,
            status: (
              <Badge className='text-capitalize' color={statusObj[d.status]?.color} pill>
                {statusObj[d.status]?.value}
              </Badge>
            )
          }
        }))
      })
    )
  }, [])

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item mr-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell size={21} />
        {totalNotif > 0 &&
          <Badge pill color='danger' className='badge-up'>
            {convertToRupiah(totalNotif)}
          </Badge>
        }
      </DropdownToggle>
      <DropdownMenu tag='ul' right className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 mr-auto'>Notifikasi</h4>
            {totalNotif > 0 &&
              <Badge tag='div' color='light-primary' pill>
                {convertToRupiah(totalNotif)} Baru
              </Badge>
            }
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className='dropdown-menu-footer'>
        <a href='/notification/list'>
          <Button.Ripple color='primary' block>
            Baca semua notifikasi
          </Button.Ripple>
        </a>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
