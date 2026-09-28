export type FollowUpStatus =
  | 'not_scheduled'
  | 'upcoming'
  | 'due_today'
  | 'overdue'
  | 'archived'

export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  summary: string | null
  identifiedNeeds: string[]
  missingInformation: string[]
  suggestedNextAction: string | null
  lastContactDate: string | null
  nextFollowUpDate: string | null
  followUpStatus: FollowUpStatus
  daysOverdue: number
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ClientInput {
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  summary?: string | null
  identifiedNeeds?: string[]
  missingInformation?: string[]
  suggestedNextAction?: string | null
  lastContactDate?: string | null
  nextFollowUpDate?: string | null
}

export type ClientListStatus =
  | 'active'
  | 'all'
  | 'archived'
  | 'not_scheduled'
  | 'upcoming'
  | 'due_today'
  | 'overdue'

