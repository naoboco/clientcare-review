import type { QueryResultRow } from 'pg'
import { pool } from '../db/pool.js'
import type {
  Client,
  ClientCreateInput,
  ClientListOptions,
  ClientUpdateInput,
  FollowUpStatus,
} from '../types/client.js'

interface ClientRow extends QueryResultRow {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  summary: string | null
  identified_needs: string[]
  missing_information: string[]
  suggested_next_action: string | null
  last_contact_date: string | null
  next_follow_up_date: string | null
  follow_up_status: FollowUpStatus
  days_overdue: number
  archived_at: Date | null
  created_at: Date
  updated_at: Date
}

const clientFields = `
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.phone,
  c.summary,
  c.identified_needs,
  c.missing_information,
  c.suggested_next_action,
  c.last_contact_date,
  c.next_follow_up_date,
  case
    when c.archived_at is not null then 'archived'
    when c.next_follow_up_date is null then 'not_scheduled'
    when c.next_follow_up_date < current_date then 'overdue'
    when c.next_follow_up_date = current_date then 'due_today'
    else 'upcoming'
  end as follow_up_status,
  case
    when c.archived_at is null and c.next_follow_up_date < current_date
      then (current_date - c.next_follow_up_date)::integer
    else 0
  end as days_overdue,
  c.archived_at,
  c.created_at,
  c.updated_at
`

function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    summary: row.summary,
    identifiedNeeds: row.identified_needs,
    missingInformation: row.missing_information,
    suggestedNextAction: row.suggested_next_action,
    lastContactDate: row.last_contact_date,
    nextFollowUpDate: row.next_follow_up_date,
    followUpStatus: row.follow_up_status,
    daysOverdue: row.days_overdue,
    archivedAt: row.archived_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

function addStatusCondition(status: ClientListOptions['status'], conditions: string[]) {
  if (status === 'all') return
  if (status === 'archived') {
    conditions.push('c.archived_at is not null')
    return
  }

  conditions.push('c.archived_at is null')

  if (status === 'not_scheduled') conditions.push('c.next_follow_up_date is null')
  if (status === 'overdue') conditions.push('c.next_follow_up_date < current_date')
  if (status === 'due_today') conditions.push('c.next_follow_up_date = current_date')
  if (status === 'upcoming') conditions.push('c.next_follow_up_date > current_date')
}

export async function listClients(ownerId: string, options: ClientListOptions) {
  const values: unknown[] = [ownerId]
  const conditions = ['c.owner_id = $1']

  addStatusCondition(options.status, conditions)

  if (options.search) {
    values.push(`%${options.search}%`)
    conditions.push(`
      concat_ws(' ', c.first_name, c.last_name, c.email, c.phone)
      ilike $${values.length}
    `)
  }

  if (options.cursor) {
    values.push(options.cursor)
    conditions.push(`c.id < $${values.length}`)
  }

  values.push(options.limit + 1)

  const result = await pool.query<ClientRow>(
    `
      select ${clientFields}
      from clients c
      where ${conditions.join(' and ')}
      order by c.id desc
      limit $${values.length}
    `,
    values,
  )

  const hasMore = result.rows.length > options.limit
  const visibleRows = hasMore ? result.rows.slice(0, options.limit) : result.rows

  return {
    clients: visibleRows.map(mapClient),
    nextCursor: hasMore ? visibleRows.at(-1)?.id ?? null : null,
  }
}

export async function findClientById(ownerId: string, clientId: string) {
  const result = await pool.query<ClientRow>(
    `
      select ${clientFields}
      from clients c
      where c.id = $1 and c.owner_id = $2
    `,
    [clientId, ownerId],
  )

  return result.rows[0] ? mapClient(result.rows[0]) : null
}

export async function createClient(ownerId: string, input: ClientCreateInput) {
  const result = await pool.query<ClientRow>(
    `
      with inserted as (
        insert into clients (
          owner_id,
          first_name,
          last_name,
          email,
          phone,
          summary,
          identified_needs,
          missing_information,
          suggested_next_action,
          last_contact_date,
          next_follow_up_date
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        returning *
      )
      select ${clientFields}
      from inserted c
    `,
    [
      ownerId,
      input.firstName,
      input.lastName,
      input.email,
      input.phone ?? null,
      input.summary ?? null,
      input.identifiedNeeds ?? [],
      input.missingInformation ?? [],
      input.suggestedNextAction ?? null,
      input.lastContactDate ?? null,
      input.nextFollowUpDate ?? null,
    ],
  )

  return mapClient(result.rows[0])
}

const updateColumns: Record<keyof ClientUpdateInput, string> = {
  firstName: 'first_name',
  lastName: 'last_name',
  email: 'email',
  phone: 'phone',
  summary: 'summary',
  identifiedNeeds: 'identified_needs',
  missingInformation: 'missing_information',
  suggestedNextAction: 'suggested_next_action',
  lastContactDate: 'last_contact_date',
  nextFollowUpDate: 'next_follow_up_date',
}

export async function updateClient(
  ownerId: string,
  clientId: string,
  input: ClientUpdateInput,
) {
  const values: unknown[] = []
  const assignments = Object.entries(input).map(([key, value]) => {
    values.push(value)
    return `${updateColumns[key as keyof ClientUpdateInput]} = $${values.length}`
  })

  values.push(clientId, ownerId)

  const result = await pool.query<ClientRow>(
    `
      with updated as (
        update clients
        set ${assignments.join(', ')}
        where id = $${values.length - 1} and owner_id = $${values.length}
        returning *
      )
      select ${clientFields}
      from updated c
    `,
    values,
  )

  return result.rows[0] ? mapClient(result.rows[0]) : null
}

async function setArchivedState(
  ownerId: string,
  clientId: string,
  archived: boolean,
) {
  const result = await pool.query<ClientRow>(
    `
      with updated as (
        update clients
        set archived_at = ${archived ? 'now()' : 'null'}
        where id = $1 and owner_id = $2
        returning *
      )
      select ${clientFields}
      from updated c
    `,
    [clientId, ownerId],
  )

  return result.rows[0] ? mapClient(result.rows[0]) : null
}

export function archiveClient(ownerId: string, clientId: string) {
  return setArchivedState(ownerId, clientId, true)
}

export function restoreClient(ownerId: string, clientId: string) {
  return setArchivedState(ownerId, clientId, false)
}

