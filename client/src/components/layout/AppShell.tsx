import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Clients', to: '/clients' },
]

export function AppShell() {
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
          <div className="avatar" aria-hidden="true">NC</div>
          <div>
            <strong>Coordinator</strong>
            <span>Demo workspace</span>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <span className="environment-label">Fictional data only</span>
          <NavLink className="text-link" to="/login">Log out</NavLink>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

