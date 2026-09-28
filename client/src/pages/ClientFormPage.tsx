import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { ClientForm } from '../components/clients/ClientForm'
import { clearSelectedClient, createClient, fetchClient, updateClient } from '../features/clients/clientsSlice'
import type { ClientInput } from '../features/clients/types'

export function ClientFormPage() {
  const { clientId } = useParams()
  const isEditing = Boolean(clientId)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selected, detailStatus, mutationStatus, error } = useAppSelector((state) => state.clients)

  useEffect(() => {
    if (clientId) {
      dispatch(clearSelectedClient())
      void dispatch(fetchClient(clientId))
    }
  }, [clientId, dispatch])

  async function handleSubmit(input: ClientInput) {
    if (clientId) {
      const result = await dispatch(updateClient({ clientId, input }))
      if (updateClient.fulfilled.match(result)) navigate(`/clients/${clientId}`)
      return
    }

    const result = await dispatch(createClient(input))
    if (createClient.fulfilled.match(result)) navigate(`/clients/${result.payload.id}`)
  }

  if (isEditing && detailStatus === 'loading') return <div className="empty-state"><p>Loading client…</p></div>

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <span className="eyebrow">Client profile</span>
          <h1>{isEditing ? 'Edit client' : 'Create client'}</h1>
          <p>Keep the profile concise, current and useful for the next follow-up.</p>
        </div>
        <Link className="button button-secondary" to={clientId ? `/clients/${clientId}` : '/clients'}>Cancel</Link>
      </section>
      <section className="panel form-panel">
        <ClientForm client={isEditing ? selected : null} isSaving={mutationStatus === 'loading'} error={error} onSubmit={handleSubmit} />
      </section>
    </div>
  )
}
