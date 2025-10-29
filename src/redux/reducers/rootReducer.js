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
// ** content
import categorys from '@src/views/backend/category/store/reducer'
import contents from '@src/views/backend/content/store/reducer'
import gallerys from '@src/views/backend/gallery/store/reducer'
import bawasluupdates from '@src/views/backend/bawaslu_update/store/reducer'
import articles from '@src/views/backend/article/store/reducer'
import temas from '@src/views/backend/tema/store/reducer'
import komunitass from '@src/views/backend/komunitas/store/reducer'
// ** report
import reportarticles from '@src/views/backend/report_article/store/reducer'
import complaints from '@src/views/backend/complaint/store/reducer'
import hasilcekfaktas from '@src/views/backend/hasil_cek_fakta/store/reducer'
import statistikpenggunas from '@src/views/backend/statistik_pengguna/store/reducer'
import statistikpenggunakomunitass from '@src/views/backend/statistik_pengguna_komunitas/store/reducer'
import statistikartikelkomunitass from '@src/views/backend/statistik_artikel_komunitas/store/reducer'
import statistikartikeltemas from '@src/views/backend/statistik_artikel_tema/store/reducer'
import statistikpenggunaprovinces from '@src/views/backend/statistik_pengguna_provinsi/store/reducer'
import statistikpenggunaprovincekomunitass from '@src/views/backend/statistik_pengguna_provinsi_komunitas/store/reducer'

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
  globalparams,
  categorys,
  contents,
  gallerys,
  bawasluupdates,
  articles,
  temas,
  komunitass,
  reportarticles,
  complaints,
  hasilcekfaktas,
  statistikpenggunas,
  statistikpenggunakomunitass,
  statistikartikelkomunitass,
  statistikartikeltemas,
  statistikpenggunaprovinces,
  statistikpenggunaprovincekomunitass
})

export default rootReducer
