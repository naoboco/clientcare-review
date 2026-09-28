import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { z } from 'zod'

config({
  path: fileURLToPath(new URL('../../../.env', import.meta.url)),
  quiet: true,
})

const developmentJwtSecret = 'development-only-change-this-secret-123456789'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z
    .string()
    .min(1)
    .default('postgresql://postgres:postgres@localhost:5432/clientcare'),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(20).default(10),
  APP_TIME_ZONE: z
    .string()
    .regex(/^[A-Za-z_]+\/[A-Za-z_]+$/)
    .default('Asia/Jerusalem'),
  JWT_SECRET: z.string().min(32).default(developmentJwtSecret),
}).superRefine((value, context) => {
  if (value.NODE_ENV === 'production' && value.JWT_SECRET === developmentJwtSecret) {
    context.addIssue({
      code: 'custom',
      path: ['JWT_SECRET'],
      message: 'A unique JWT_SECRET is required in production',
    })
  }
})

export const env = envSchema.parse(process.env)
