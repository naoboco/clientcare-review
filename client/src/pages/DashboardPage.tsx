import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { ClientTable } from '../components/clients/ClientTable'
import { StatusBadge } from '../components/clients/StatusBadge'
import { fetchClients } from '../features/clients/clientsSlice'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const { items, listStatus, error } = useAppSelector((state) => state.clients)

  useEffect(() => {
    void dispatch(fetchClients({ status: 'active', limit: 100 }))
  }, [dispatch])

  const overdue = items.filter((client) => client.followUpStatus === 'overdue')
  const dueToday = items.filter((client) => client.followUpStatus === 'due_today')
  const upcoming = items.filter((client) => client.followUpStatus === 'upcoming')
  const urgent = [...overdue, ...dueToday].slice(0, 5)
  const summaryCards = [
    { label: 'Overdue', value: overdue.length, tone: 'danger' },
    { label: 'Due today', value: dueToday.length, tone: 'warning' },
    { label: 'Upcoming', value: upcoming.length, tone: 'success' },
  ]
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <span className="eyebrow">{formattedDate}</span>
          <h1>Good morning</h1>
          <p>Here is your client follow-up overview.</p>
        </div>
        <Link className="button button-primary" to="/clients/new">Add client</Link>
      </section>

      <section className="stats-grid" aria-label="Follow-up summary">
        {summaryCards.map((card) => (
          <article className={`stat-card stat-card-${card.tone}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Needs attention</h2>
            <p>Overdue and due-today follow-ups will appear here.</p>
          </div>
          <Link className="text-link" to="/clients">View all clients</Link>
        </div>
        {error ? <div className="form-error page-message" role="alert">{error}</div> : null}
        {listStatus === 'loading' ? <div className="empty-state"><p>Loading follow-ups…</p></div> : null}
        {listStatus !== 'loading' && urgent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">✓</div>
            <h3>No urgent follow-ups</h3>
            <p>Your priority list is clear. A rare and beautiful administrative event.</p>
          </div>
        ) : null}
        {urgent.length > 0 ? <ClientTable clients={urgent} /> : null}
      </section>

      {urgent.length > 0 ? (
        <section className="panel follow-up-summary">
          <div className="panel-heading">
            <div>
              <h2>Priority signals</h2>
              <p>Review the status before deciding your next action.</p>
            </div>
          </div>
          <div className="priority-list">
            {urgent.map((client) => <div className="priority-row" key={client.id}><span>{client.firstName} {client.lastName}</span><StatusBadge status={client.followUpStatus} daysOverdue={client.daysOverdue} /></div>)}
          </div>
        </section>
      ) : null}
    </div>
  )
}
