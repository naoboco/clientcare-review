import { type FormEvent, useEffect, useState } from 'react'
import type { Client, ClientInput } from '../../features/clients/types'

interface ClientFormProps {
  client?: Client | null
  isSaving: boolean
  error: string | null
  onSubmit: (input: ClientInput) => void
}

function listToText(values: string[]) {
  return values.join(', ')
}

export function ClientForm({ client, isSaving, error, onSubmit }: ClientFormProps) {
  const [formKey, setFormKey] = useState(client?.id ?? 'new')

  useEffect(() => {
    setFormKey(client?.id ?? 'new')
  }, [client?.id])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const read = (name: string) => String(formData.get(name) ?? '').trim()
    const splitList = (name: string) => read(name)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    onSubmit({
      firstName: read('firstName'),
      lastName: read('lastName'),
      email: read('email'),
      phone: read('phone') || null,
      summary: read('summary') || null,
      identifiedNeeds: splitList('identifiedNeeds'),
      missingInformation: splitList('missingInformation'),
      suggestedNextAction: read('suggestedNextAction') || null,
      lastContactDate: read('lastContactDate') || null,
      nextFollowUpDate: read('nextFollowUpDate') || null,
    })
  }

  return (
    <form className="client-form" key={formKey} onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>First name<input name="firstName" defaultValue={client?.firstName ?? ''} required /></label>
        <label>Last name<input name="lastName" defaultValue={client?.lastName ?? ''} required /></label>
        <label>Email<input name="email" type="email" defaultValue={client?.email ?? ''} required /></label>
        <label>Phone<input name="phone" type="tel" defaultValue={client?.phone ?? ''} /></label>
        <label>Last contact<input name="lastContactDate" type="date" defaultValue={client?.lastContactDate ?? ''} /></label>
        <label>Next follow-up<input name="nextFollowUpDate" type="date" defaultValue={client?.nextFollowUpDate ?? ''} /></label>
        <label className="form-span-2">Summary<textarea name="summary" rows={4} defaultValue={client?.summary ?? ''} /></label>
        <label>Identified needs <span className="field-hint">Separate items with commas.</span><input name="identifiedNeeds" defaultValue={listToText(client?.identifiedNeeds ?? [])} /></label>
        <label>Missing information <span className="field-hint">Separate items with commas.</span><input name="missingInformation" defaultValue={listToText(client?.missingInformation ?? [])} /></label>
        <label className="form-span-2">Suggested next action<textarea name="suggestedNextAction" rows={3} defaultValue={client?.suggestedNextAction ?? ''} /></label>
      </div>
      {error ? <div className="form-error" role="alert">{error}</div> : null}
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : client ? 'Save changes' : 'Create client'}
        </button>
      </div>
    </form>
  )
}

