import { lazy } from 'react'

const Master = [
    {
    path: '/tahun_angkatan/list',
    component: lazy(() => import('../../../views/backend/tahun_angkatan/list')),
    meta: {
      action: 'read',
      resource: 'tahun_angkatan'
    }
  },
  {
    path: '/tahun_angkatan/edit/:id',
    component: lazy(() => import('../../../views/backend/tahun_angkatan/save')),
    meta: {
      action: 'edit',
      resource: 'tahun_angkatan'
    }
  },
  {
    path: '/tahun_angkatan/save',
    component: lazy(() => import('../../../views/backend/tahun_angkatan/save')),
    meta: {
      action: 'create',
      resource: 'tahun_angkatan'
    }
  },
  {
    path: '/tingkat/list',
    component: lazy(() => import('../../../views/backend/tingkat/list')),
    meta: {
      action: 'read',
      resource: 'tingkat'
    }
  },
  {
    path: '/tingkat/edit/:id',
    component: lazy(() => import('../../../views/backend/tingkat/save')),
    meta: {
      action: 'edit',
      resource: 'tingkat'
    }
  },
  {
    path: '/tingkat/save',
    component: lazy(() => import('../../../views/backend/tingkat/save')),
    meta: {
      action: 'create',
      resource: 'tingkat'
    }
  },
  {
    path: '/tahun_ajaran/list',
    component: lazy(() => import('../../../views/backend/tahun_ajaran/list')),
    meta: {
      action: 'read',
      resource: 'tahun_ajaran'
    }
  },
  {
    path: '/tahun_ajaran/edit/:id',
    component: lazy(() => import('../../../views/backend/tahun_ajaran/save')),
    meta: {
      action: 'edit',
      resource: 'tahun_ajaran'
    }
  },
  {
    path: '/tahun_ajaran/save',
    component: lazy(() => import('../../../views/backend/tahun_ajaran/save')),
    meta: {
      action: 'create',
      resource: 'tahun_ajaran'
    }
  },
  {
    path: '/semester/list',
    component: lazy(() => import('../../../views/backend/semester/list')),
    meta: {
      action: 'read',
      resource: 'semester'
    }
  },
  {
    path: '/semester/edit/:id',
    component: lazy(() => import('../../../views/backend/semester/save')),
    meta: {
      action: 'edit',
      resource: 'semester'
    }
  },
  {
    path: '/semester/save',
    component: lazy(() => import('../../../views/backend/semester/save')),
    meta: {
      action: 'create',
      resource: 'semester'
    }
  }
]

export default Master