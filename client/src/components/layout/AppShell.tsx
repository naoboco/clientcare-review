import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'

const navigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Clients', to: '/clients' },
]

export function AppShell() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const initials = user?.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() ?? 'CC'

  async function handleLogout() {
    await dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/dashboard" aria-label="ClientCare home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>clientCare</span>
        </NavLink>

        <nav className="navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar" aria-hidden="true">{initials}</div>
          <div>
            <strong>{user?.name ?? 'Coordinator'}</strong>
            <span>{user?.email ?? 'ClientCare workspace'}</span>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <span className="environment-label">Fictional data only</span>
          <button className="text-link text-button" type="button" onClick={handleLogout}>Log out</button>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
