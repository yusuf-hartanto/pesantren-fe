// ** Routes Imports
import DashboardRoute from './backend/Dashboard'
import AuthRoutes from './backend/Auth'
import MasterRoutes from './backend/Master'

// ** Document title
const TemplateTitle = '%s - Admin Dashboard'

// ** Default Route
const DefaultRoute = '/dashboard'

// ** Merge Routes
const Routes = [
    ...DashboardRoute,
    ...AuthRoutes,
    ...MasterRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
