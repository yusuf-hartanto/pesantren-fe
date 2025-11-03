// ** Routes Imports
import DashboardRoute from './backend/Dashboard'
import AuthRoutes from './backend/Auth'

// ** Document title
const TemplateTitle = '%s - Admin Dashboard'

// ** Default Route
const DefaultRoute = '/dashboard'

// ** Merge Routes
const Routes = [
    ...DashboardRoute,
    ...AuthRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
