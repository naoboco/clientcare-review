import { z } from 'zod'

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}, 'Invalid calendar date')

const optionalText = (maximumLength: number) =>
  z
    .string()
    .trim()
    .max(maximumLength)
    .nullable()
    .optional()
    .transform((value) => (value === '' ? null : value))

const textList = z
  .array(z.string().trim().min(1).max(200))
  .max(30)
  .transform((values) => [...new Set(values)])

export const clientIdSchema = z.object({
  clientId: z.string().regex(/^\d+$/),
}).strict()

export const clientListQuerySchema = z.object({
  status: z
    .enum([
      'active',
      'all',
      'archived',
      'not_scheduled',
      'upcoming',
      'due_today',
      'overdue',
    ])
    .default('active'),
  search: z.string().trim().min(1).max(100).optional(),
  cursor: z.string().regex(/^\d+$/).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
}).strict()

export const createClientSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  phone: optionalText(40),
  summary: optionalText(4_000),
  identifiedNeeds: textList.optional(),
  missingInformation: textList.optional(),
  suggestedNextAction: optionalText(1_000),
  lastContactDate: dateString.nullable().optional(),
  nextFollowUpDate: dateString.nullable().optional(),
}).strict()

export const updateClientSchema = createClientSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required')
