import { lazy } from 'react'

const Menu = [
  {
    path: '/category/list',
    component: lazy(() => import('../../../views/backend/category/list')),
    meta: {
      action: 'read',
      resource: 'category'
    }
  },
  {
    path: '/category/edit/:id',
    component: lazy(() => import('../../../views/backend/category/save')),
    meta: {
      action: 'edit',
      resource: 'category'
    }
  },
  {
    path: '/category/save',
    component: lazy(() => import('../../../views/backend/category/save')),
    meta: {
      action: 'create',
      resource: 'category'
    }
  },
  {
    path: '/content/list',
    component: lazy(() => import('../../../views/backend/content/list')),
    meta: {
      action: 'read',
      resource: 'content'
    }
  },
  {
    path: '/content/edit/:id',
    component: lazy(() => import('../../../views/backend/content/save')),
    meta: {
      action: 'edit',
      resource: 'content'
    }
  },
  {
    path: '/content/save',
    component: lazy(() => import('../../../views/backend/content/save')),
    meta: {
      action: 'create',
      resource: 'content'
    }
  },
  {
    path: '/gallery/list',
    component: lazy(() => import('../../../views/backend/gallery/list')),
    meta: {
      action: 'read',
      resource: 'gallery'
    }
  },
  {
    path: '/gallery/edit/:id',
    component: lazy(() => import('../../../views/backend/gallery/save')),
    meta: {
      action: 'edit',
      resource: 'gallery'
    }
  },
  {
    path: '/gallery/save',
    component: lazy(() => import('../../../views/backend/gallery/save')),
    meta: {
      action: 'create',
      resource: 'gallery'
    }
  },
  {
    path: '/bawaslu_update/list',
    component: lazy(() => import('../../../views/backend/bawaslu_update/list')),
    meta: {
      action: 'read',
      resource: 'bawaslu_update'
    }
  },
  {
    path: '/bawaslu_update/edit/:id',
    component: lazy(() => import('../../../views/backend/bawaslu_update/save')),
    meta: {
      action: 'edit',
      resource: 'bawaslu_update'
    }
  },
  {
    path: '/bawaslu_update/save',
    component: lazy(() => import('../../../views/backend/bawaslu_update/save')),
    meta: {
      action: 'create',
      resource: 'bawaslu_update'
    }
  },
  {
    path: '/article/list',
    component: lazy(() => import('../../../views/backend/article/list')),
    meta: {
      action: 'read',
      resource: 'article'
    }
  },
  {
    path: '/article/edit/:id',
    component: lazy(() => import('../../../views/backend/article/save')),
    meta: {
      action: 'edit',
      resource: 'article'
    }
  },
  {
    path: '/article/save',
    component: lazy(() => import('../../../views/backend/article/save')),
    meta: {
      action: 'create',
      resource: 'article'
    }
  },
  {
    path: '/tema/list',
    component: lazy(() => import('../../../views/backend/tema/list')),
    meta: {
      action: 'read',
      resource: 'tema'
    }
  },
  {
    path: '/tema/edit/:id',
    component: lazy(() => import('../../../views/backend/tema/save')),
    meta: {
      action: 'edit',
      resource: 'tema'
    }
  },
  {
    path: '/tema/save',
    component: lazy(() => import('../../../views/backend/tema/save')),
    meta: {
      action: 'create',
      resource: 'tema'
    }
  },
  {
    path: '/komunitas/list',
    component: lazy(() => import('../../../views/backend/komunitas/list')),
    meta: {
      action: 'read',
      resource: 'komunitas'
    }
  },
  {
    path: '/komunitas/edit/:id',
    component: lazy(() => import('../../../views/backend/komunitas/save')),
    meta: {
      action: 'edit',
      resource: 'komunitas'
    }
  },
  {
    path: '/komunitas/save',
    component: lazy(() => import('../../../views/backend/komunitas/save')),
    meta: {
      action: 'create',
      resource: 'komunitas'
    }
  },
  {
    path: '/notification/list',
    component: lazy(() => import('../../../views/backend/notification/list')),
    meta: {
      action: 'read',
      resource: 'notification'
    }
  },
  {
    path: '/report_article/list',
    component: lazy(() => import('../../../views/backend/report_article/list')),
    meta: {
      action: 'read',
      resource: 'report_article'
    }
  },
  {
    path: '/report_article/edit/:id',
    component: lazy(() => import('../../../views/backend/report_article/save')),
    meta: {
      action: 'edit',
      resource: 'report_article'
    }
  },
  {
    path: '/report_article/save',
    component: lazy(() => import('../../../views/backend/report_article/save')),
    meta: {
      action: 'create',
      resource: 'report_article'
    }
  },
  {
    path: '/complaint/list',
    component: lazy(() => import('../../../views/backend/complaint/list')),
    meta: {
      action: 'read',
      resource: 'complaint'
    }
  },
  {
    path: '/complaint/edit/:id',
    component: lazy(() => import('../../../views/backend/complaint/save')),
    meta: {
      action: 'edit',
      resource: 'complaint'
    }
  },
  {
    path: '/complaint/save',
    component: lazy(() => import('../../../views/backend/complaint/save')),
    meta: {
      action: 'create',
      resource: 'complaint'
    }
  },
  {
    path: '/hasil_cek_fakta/list',
    component: lazy(() => import('../../../views/backend/hasil_cek_fakta/list')),
    meta: {
      action: 'read',
      resource: 'hasil_cek_fakta'
    }
  },
  {
    path: '/hasil_cek_fakta/edit/:id',
    component: lazy(() => import('../../../views/backend/hasil_cek_fakta/save')),
    meta: {
      action: 'edit',
      resource: 'hasil_cek_fakta'
    }
  },
  {
    path: '/hasil_cek_fakta/save',
    component: lazy(() => import('../../../views/backend/hasil_cek_fakta/save')),
    meta: {
      action: 'create',
      resource: 'hasil_cek_fakta'
    }
  },
  {
    path: '/statistik_pengguna/list',
    component: lazy(() => import('../../../views/backend/statistik_pengguna/list')),
    meta: {
      action: 'read',
      resource: 'statistik_pengguna'
    }
  },
  {
    path: '/statistik_pengguna_komunitas/list',
    component: lazy(() => import('../../../views/backend/statistik_pengguna_komunitas/list')),
    meta: {
      action: 'read',
      resource: 'statistik_pengguna_komunitas'
    }
  }
]

export default Menu
