import { apiRequest } from '../../app/api'
import type { Client, ClientInput, ClientListStatus } from './types'

interface ClientResponse {
  data: Client
}

interface ClientListResponse {
  data: Client[]
  page: {
    limit: number
    nextCursor: string | null
  }
}

export interface ClientListOptions {
  status?: ClientListStatus
  search?: string
  limit?: number
  cursor?: string
}

export async function requestClients(options: ClientListOptions = {}) {
  const params = new URLSearchParams()
  if (options.status) params.set('status', options.status)
  if (options.search) params.set('search', options.search)
  if (options.limit) params.set('limit', String(options.limit))
  if (options.cursor) params.set('cursor', options.cursor)

  const query = params.toString()
  return apiRequest<ClientListResponse>(`/api/clients${query ? `?${query}` : ''}`)
}

export async function requestClient(clientId: string) {
  return apiRequest<ClientResponse>(`/api/clients/${clientId}`)
}

export async function requestCreateClient(input: ClientInput) {
  return apiRequest<ClientResponse>('/api/clients', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function requestUpdateClient(clientId: string, input: ClientInput) {
  return apiRequest<ClientResponse>(`/api/clients/${clientId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function requestArchiveClient(clientId: string) {
  return apiRequest<ClientResponse>(`/api/clients/${clientId}/archive`, { method: 'POST' })
}

export async function requestRestoreClient(clientId: string) {
  return apiRequest<ClientResponse>(`/api/clients/${clientId}/restore`, { method: 'POST' })
}

