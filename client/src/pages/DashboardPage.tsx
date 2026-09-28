import { Link } from 'react-router-dom'

const summaryCards = [
  { label: 'Overdue', value: '0', tone: 'danger' },
  { label: 'Due today', value: '0', tone: 'warning' },
  { label: 'Upcoming', value: '0', tone: 'success' },
]

export function DashboardPage() {
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
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">✓</div>
          <h3>No urgent follow-ups</h3>
          <p>Your priority list is clear. A rare and beautiful administrative event.</p>
        </div>
      </section>
    </div>
  )
}
