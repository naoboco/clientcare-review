import { z } from 'zod'

const passwordInput = z
  .string()
  .min(1)
  .max(256)
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, {
    message: 'Password must not exceed 72 UTF-8 bytes',
  })

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  password: passwordInput.refine((value) => value.length >= 12, {
    message: 'Password must contain at least 12 characters',
  }),
}).strict()

export const loginSchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  password: passwordInput,
}).strict()
