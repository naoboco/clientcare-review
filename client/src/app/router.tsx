import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ClientsPage } from '../pages/ClientsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RegisterPage } from '../pages/RegisterPage'
import { WorkspacePage } from '../pages/WorkspacePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/clients',
        element: <ClientsPage />,
      },
      {
        path: '/clients/new',
        element: <WorkspacePage title="Create client" />,
      },
      {
        path: '/clients/:clientId',
        element: <WorkspacePage title="Client profile" />,
      },
      {
        path: '/clients/:clientId/edit',
        element: <WorkspacePage title="Edit client" />,
      },
      {
        path: '/clients/:clientId/analyze',
        element: <WorkspacePage title="Analyze email" />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

