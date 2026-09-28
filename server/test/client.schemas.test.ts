import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  createClientSchema,
  updateClientSchema,
} from '../src/schemas/client.schemas.js'

describe('client validation', () => {
  it('normalizes a valid client payload', () => {
    const result = createClientSchema.parse({
      firstName: '  Noa ',
      lastName: ' Levi  ',
      email: ' NOA.LEVI@EXAMPLE.TEST ',
      identifiedNeeds: ['Housing', 'Housing'],
      nextFollowUpDate: '2026-09-30',
    })

    assert.equal(result.firstName, 'Noa')
    assert.equal(result.lastName, 'Levi')
    assert.equal(result.email, 'noa.levi@example.test')
    assert.deepEqual(result.identifiedNeeds, ['Housing'])
  })

  it('rejects an impossible calendar date', () => {
    const result = createClientSchema.safeParse({
      firstName: 'Noa',
      lastName: 'Levi',
      email: 'noa.levi@example.test',
      nextFollowUpDate: '2026-02-30',
    })

    assert.equal(result.success, false)
  })

  it('rejects unknown fields', () => {
    const result = createClientSchema.safeParse({
      firstName: 'Noa',
      lastName: 'Levi',
      email: 'noa.levi@example.test',
      ownerId: '999',
    })

    assert.equal(result.success, false)
  })

  it('rejects an empty update', () => {
    assert.equal(updateClientSchema.safeParse({}).success, false)
  })
})

