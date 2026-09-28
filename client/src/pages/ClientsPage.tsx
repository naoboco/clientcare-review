import { Link } from 'react-router-dom'

export function ClientsPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <span className="eyebrow">Client management</span>
          <h1>Clients</h1>
          <p>Create profiles and keep every next step visible.</p>
        </div>
        <Link className="button button-primary" to="/clients/new">Add client</Link>
      </section>

      <section className="panel">
        <div className="toolbar">
          <label className="search-field">
            <span className="sr-only">Search clients</span>
            <input type="search" placeholder="Search clients" disabled />
          </label>
          <button className="button button-secondary" type="button" disabled>Filter</button>
        </div>
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">+</div>
          <h2>No clients yet</h2>
          <p>Your fictional client profiles will appear here.</p>
          <Link className="button button-primary" to="/clients/new">Create first client</Link>
        </div>
      </section>
    </div>
  )
}
