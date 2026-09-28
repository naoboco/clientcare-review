import type { FollowUpStatus } from '../../features/clients/types'

interface StatusBadgeProps {
  status: FollowUpStatus
  daysOverdue?: number
}

const labels: Record<FollowUpStatus, string> = {
  overdue: 'Overdue',
  due_today: 'Due today',
  upcoming: 'Upcoming',
  not_scheduled: 'Not scheduled',
  archived: 'Archived',
}

export function StatusBadge({ status, daysOverdue = 0 }: StatusBadgeProps) {
  const label = status === 'overdue' && daysOverdue > 0
    ? `${daysOverdue}d overdue`
    : labels[status]

  return <span className={`status-badge status-${status}`}>{label}</span>
}

