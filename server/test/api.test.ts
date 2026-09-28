import assert from 'node:assert/strict'
import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import { after, before, describe, it } from 'node:test'

process.env.NODE_ENV = 'test'

const { app } = await import('../src/app.js')
const { closeDatabaseConnection } = await import('../src/db/pool.js')
const { createSessionToken } = await import('../src/services/session.service.js')

const server = app.listen(0)
let baseUrl = ''

before(async () => {
  await once(server, 'listening')
  const address = server.address() as AddressInfo
  baseUrl = `http://127.0.0.1:${address.port}`
})

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolve()
    })
  })
  await closeDatabaseConnection()
})

describe('API foundation', () => {
  it('returns the liveness response', async () => {
    const response = await fetch(`${baseUrl}/api/health`)
    const body = await response.json() as { status: string; service: string }

    assert.equal(response.status, 200)
    assert.equal(body.status, 'ok')
    assert.equal(body.service, 'clientcare-api')
  })

  it('protects client routes without a coordinator', async () => {
    const response = await fetch(`${baseUrl}/api/clients`)

    assert.equal(response.status, 401)
  })

  it('validates client creation before querying PostgreSQL', async () => {
    const token = createSessionToken('1')

    const response = await fetch(`${baseUrl}/api/clients`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    const body = await response.json() as { error: string }

    assert.equal(response.status, 400)
    assert.equal(body.error, 'Validation failed')
  })

  it('validates registration before querying PostgreSQL', async () => {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'invalid' }),
    })

    assert.equal(response.status, 400)
  })

  it('clears logout sessions without requiring a database query', async () => {
    const response = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
    })

    assert.equal(response.status, 204)
  })
})
