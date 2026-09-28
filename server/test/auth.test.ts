import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loginSchema, registerSchema } from '../src/schemas/auth.schemas.js'
import {
  createSessionToken,
  readSessionToken,
} from '../src/services/session.service.js'

describe('authentication validation', () => {
  it('normalizes registration input', () => {
    const result = registerSchema.parse({
      name: '  Noa Levi ',
      email: ' NOA.LEVI@EXAMPLE.TEST ',
      password: 'a-secure-password',
    })

    assert.equal(result.name, 'Noa Levi')
    assert.equal(result.email, 'noa.levi@example.test')
  })

  it('rejects short registration passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Noa Levi',
      email: 'noa.levi@example.test',
      password: 'short',
    })

    assert.equal(result.success, false)
  })

  it('rejects passwords above the bcrypt byte limit', () => {
    const result = registerSchema.safeParse({
      name: 'Noa Levi',
      email: 'noa.levi@example.test',
      password: 'é'.repeat(40),
    })

    assert.equal(result.success, false)
  })

  it('rejects unknown authentication fields', () => {
    const result = loginSchema.safeParse({
      email: 'noa.levi@example.test',
      password: 'password',
      role: 'admin',
    })

    assert.equal(result.success, false)
  })
})

describe('session tokens', () => {
  it('returns the coordinator ID from a valid token', () => {
    const token = createSessionToken('42')

    assert.equal(readSessionToken(token), '42')
  })

  it('rejects a modified token', () => {
    const token = createSessionToken('42')
    const modifiedToken = `${token.slice(0, -1)}x`

    assert.throws(() => readSessionToken(modifiedToken))
  })
})
