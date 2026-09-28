import { Link } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'
import type { Client } from '../../features/clients/types'

interface ClientTableProps {
  clients: Client[]
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <div className="client-table-wrapper">
      <table className="client-table">
        <caption className="sr-only">Client follow-up list</caption>
        <thead>
          <tr>
            <th scope="col">Client</th>
            <th scope="col">Email</th>
            <th scope="col">Next follow-up</th>
            <th scope="col">Status</th>
            <th scope="col"><span className="sr-only">Open</span></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>
                <Link className="client-name" to={`/clients/${client.id}`}>
                  {client.firstName} {client.lastName}
                </Link>
                <span className="client-secondary">Last contact: {formatDate(client.lastContactDate)}</span>
              </td>
              <td>{client.email}</td>
              <td>{formatDate(client.nextFollowUpDate)}</td>
              <td><StatusBadge status={client.followUpStatus} daysOverdue={client.daysOverdue} /></td>
              <td><Link className="text-link" to={`/clients/${client.id}`}>Open</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

