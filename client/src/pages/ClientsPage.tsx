import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { ClientTable } from '../components/clients/ClientTable'
import { fetchClients } from '../features/clients/clientsSlice'
import type { ClientListStatus } from '../features/clients/types'

export function ClientsPage() {
  const dispatch = useAppDispatch()
  const { items, listStatus, error, nextCursor } = useAppSelector((state) => state.clients)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ClientListStatus>('active')

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void dispatch(fetchClients({ status, search: search.trim() || undefined, limit: 50 }))
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [dispatch, search, status])

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
            <input type="search" placeholder="Search clients" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label className="filter-field">
            <span className="sr-only">Filter clients</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as ClientListStatus)}>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="due_today">Due today</option>
              <option value="upcoming">Upcoming</option>
              <option value="not_scheduled">Not scheduled</option>
              <option value="archived">Archived</option>
              <option value="all">All clients</option>
            </select>
          </label>
        </div>
        {error ? <div className="form-error page-message" role="alert">{error}</div> : null}
        {listStatus === 'loading' ? <div className="empty-state"><p>Loading clients…</p></div> : null}
        {listStatus !== 'loading' && items.length === 0 ? <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">+</div>
          <h2>No clients yet</h2>
          <p>Your fictional client profiles will appear here.</p>
          <Link className="button button-primary" to="/clients/new">Create first client</Link>
        </div> : null}
        {listStatus !== 'loading' && items.length > 0 ? <ClientTable clients={items} /> : null}
        {nextCursor ? <div className="load-more"><button className="button button-secondary" type="button" onClick={() => void dispatch(fetchClients({ status, search: search.trim() || undefined, limit: 50, cursor: nextCursor }))}>Load more</button></div> : null}
      </section>
    </div>
  )
}
