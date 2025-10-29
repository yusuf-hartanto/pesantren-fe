import { lazy } from 'react'

const Dashboard = [
  {
    path: '/dashboard',
    component: lazy(() => import('../../../views/backend/dashboard')),
    meta: {
      resource: 'dashboard'
    }
  },
  {
    path: '/user/list',
    component: lazy(() => import('../../../views/backend/user/list')),
    meta: {
      action: 'read',
      resource: 'user'
    }
  },
  {
    path: '/user/edit/:id',
    component: lazy(() => import('../../../views/backend/user/save')),
    meta: {
      action: 'edit',
      resource: 'user'
    }
  },
  {
    path: '/user/save',
    component: lazy(() => import('../../../views/backend/user/save')),
    meta: {
      action: 'create',
      resource: 'user'
    }
  },
  {
    path: '/role/list',
    component: lazy(() => import('../../../views/backend/role/list')),
    meta: {
      action: 'read',
      resource: 'role'
    }
  },
  {
    path: '/role/edit/:id',
    component: lazy(() => import('../../../views/backend/role/save')),
    meta: {
      action: 'edit',
      resource: 'role'
    }
  },
  {
    path: '/role/save',
    component: lazy(() => import('../../../views/backend/role/save')),
    meta: {
      action: 'create',
      resource: 'role'
    }
  },
  {
    path: '/menu/list',
    component: lazy(() => import('../../../views/backend/menu/list')),
    meta: {
      action: 'read',
      resource: 'menu'
    }
  },
  {
    path: '/menu/edit/:id',
    component: lazy(() => import('../../../views/backend/menu/save')),
    meta: {
      action: 'edit',
      resource: 'menu'
    }
  },
  {
    path: '/menu/save',
    component: lazy(() => import('../../../views/backend/menu/save')),
    meta: {
      action: 'create',
      resource: 'menu'
    }
  },
  {
    path: '/role_menu/list',
    component: lazy(() => import('../../../views/backend/role_menu/list')),
    meta: {
      action: 'read',
      resource: 'role_menu'
    }
  },
  {
    path: '/role_menu/edit/:id',
    component: lazy(() => import('../../../views/backend/role_menu/save')),
    meta: {
      action: 'edit',
      resource: 'role_menu'
    }
  },
  {
    path: '/role_menu/save',
    component: lazy(() => import('../../../views/backend/role_menu/save')),
    meta: {
      action: 'create',
      resource: 'role_menu'
    }
  },
  {
    path: '/global_param/list',
    component: lazy(() => import('../../../views/backend/global_param/list')),
    meta: {
      action: 'read',
      resource: 'global_param'
    }
  },
  {
    path: '/global_param/edit/:id',
    component: lazy(() => import('../../../views/backend/global_param/save')),
    meta: {
      action: 'edit',
      resource: 'global_param'
    }
  },
  {
    path: '/global_param/save',
    component: lazy(() => import('../../../views/backend/global_param/save')),
    meta: {
      action: 'create',
      resource: 'global_param'
    }
  }
]

export default Dashboard
