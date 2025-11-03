// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'

// ** navigation
import navigations from '@src/navigation/store/reducer'
// ** profile
import profile from '@src/views/backend/auth/profile/store/reducer'
import notifications from '@src/views/backend/notification/store/reducer'
// ** management
import users from '@src/views/backend/user/store/reducer'
import roles from '@src/views/backend/role/store/reducer'
import menus from '@src/views/backend/menu/store/reducer'
import rolemenus from '@src/views/backend/role_menu/store/reducer'
import globalparams from '@src/views/backend/global_param/store/reducer'

const rootReducer = combineReducers({
  navigations,
  auth,
  profile,
  notifications,
  users,
  navbar,
  layout,
  roles,
  menus,
  rolemenus,
  globalparams
})

export default rootReducer
