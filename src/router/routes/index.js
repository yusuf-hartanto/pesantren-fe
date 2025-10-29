// ** Routes Imports
import DashboardRoute from './backend/Dashboard'
import AuthRoutes from './backend/Auth'
import MenuRoutes from './backend/Menu'

// ** Document title
const TemplateTitle = '%s - Admin Dashboard'

// ** Default Route
const DefaultRoute = '/dashboard'

// ** Merge Routes
const Routes = [
    ...DashboardRoute,
    ...AuthRoutes,
    ...MenuRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
