import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { StatusBadge } from '../components/clients/StatusBadge'
import { archiveClient, clearSelectedClient, fetchClient, restoreClient } from '../features/clients/clientsSlice'

function formatDate(value: string | null) {
  if (!value) return 'Not recorded'
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

export function ClientDetailPage() {
  const { clientId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selected, detailStatus, mutationStatus, error } = useAppSelector((state) => state.clients)

  useEffect(() => {
    if (clientId) {
      dispatch(clearSelectedClient())
      void dispatch(fetchClient(clientId))
    }
  }, [clientId, dispatch])

  async function handleArchive() {
    if (!clientId || !selected) return
    if (!window.confirm(`Archive ${selected.firstName} ${selected.lastName}?`)) return
    await dispatch(archiveClient(clientId))
  }

  async function handleRestore() {
    if (clientId) await dispatch(restoreClient(clientId))
  }

  if (detailStatus === 'loading' || !selected) return <div className="empty-state"><p>Loading client…</p></div>

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <span className="eyebrow">Client profile</span>
          <h1>{selected.firstName} {selected.lastName}</h1>
          <p>{selected.email}{selected.phone ? ` · ${selected.phone}` : ''}</p>
        </div>
        <div className="button-group">
          <Link className="button button-secondary" to={`/clients/${selected.id}/edit`}>Edit</Link>
          {selected.archivedAt ? <button className="button button-secondary" type="button" onClick={handleRestore} disabled={mutationStatus === 'loading'}>Restore</button> : <button className="button button-danger" type="button" onClick={handleArchive} disabled={mutationStatus === 'loading'}>Archive</button>}
        </div>
      </section>
      {error ? <div className="form-error" role="alert">{error}</div> : null}
      <section className="detail-grid">
        <article className="panel detail-card">
          <div className="panel-heading"><h2>Follow-up</h2><StatusBadge status={selected.followUpStatus} daysOverdue={selected.daysOverdue} /></div>
          <dl className="detail-list">
            <div><dt>Last contact</dt><dd>{formatDate(selected.lastContactDate)}</dd></div>
            <div><dt>Next follow-up</dt><dd>{formatDate(selected.nextFollowUpDate)}</dd></div>
            <div><dt>Profile updated</dt><dd>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(selected.updatedAt))}</dd></div>
          </dl>
        </article>
        <article className="panel detail-card"><h2>Summary</h2><p>{selected.summary || 'No summary recorded yet.'}</p><h3>Suggested next action</h3><p>{selected.suggestedNextAction || 'No action suggested yet.'}</p></article>
        <article className="panel detail-card"><h2>Needs</h2><div className="tag-list">{selected.identifiedNeeds.length ? selected.identifiedNeeds.map((need) => <span className="tag" key={need}>{need}</span>) : <p>No needs recorded yet.</p>}</div><h3>Missing information</h3><div className="tag-list">{selected.missingInformation.length ? selected.missingInformation.map((item) => <span className="tag tag-muted" key={item}>{item}</span>) : <p>Nothing marked missing.</p>}</div></article>
      </section>
      <button className="text-link back-link" type="button" onClick={() => navigate('/clients')}>← Back to clients</button>
    </div>
  )
}
