import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'

export function PublicOnlyRoute() {
  const status = useAppSelector((state) => state.auth.status)

  if (status === 'checking') {
    return (
      <main className="auth-page">
        <div className="auth-loading" role="status">Checking your session…</div>
      </main>
    )
  }

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

