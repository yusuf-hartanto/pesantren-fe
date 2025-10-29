import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

const AuthRoutes = [
  {
    path: '/login',
    component: lazy(() => import('../../../views/backend/auth/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/profile',
    component: lazy(() => import('../../../views/backend/auth/profile')),
    meta: {
      navLink: '/backend/auth/profile',
      resource: 'profile'
    }
  }
]

export default AuthRoutes
