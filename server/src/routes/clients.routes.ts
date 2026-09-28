import { Router } from 'express'
import { ApiError } from '../lib/api-error.js'
import { requireCoordinator } from '../middleware/coordinator.middleware.js'
import {
  archiveClient,
  createClient,
  findClientById,
  listClients,
  restoreClient,
  updateClient,
} from '../repositories/client.repository.js'
import {
  clientIdSchema,
  clientListQuerySchema,
  createClientSchema,
  updateClientSchema,
} from '../schemas/client.schemas.js'

export const clientsRouter = Router()

clientsRouter.use(requireCoordinator)

clientsRouter.get('/', async (request, response) => {
  const query = clientListQuerySchema.parse(request.query)
  const result = await listClients(response.locals.coordinatorId!, query)

  response.status(200).json({
    data: result.clients,
    page: {
      limit: query.limit,
      nextCursor: result.nextCursor,
    },
  })
})

clientsRouter.get('/:clientId', async (request, response) => {
  const { clientId } = clientIdSchema.parse(request.params)
  const client = await findClientById(response.locals.coordinatorId!, clientId)

  if (!client) throw new ApiError(404, 'Client not found')

  response.status(200).json({ data: client })
})

clientsRouter.post('/', async (request, response) => {
  const input = createClientSchema.parse(request.body)
  const client = await createClient(response.locals.coordinatorId!, input)

  response.location(`/api/clients/${client.id}`).status(201).json({ data: client })
})

clientsRouter.patch('/:clientId', async (request, response) => {
  const { clientId } = clientIdSchema.parse(request.params)
  const input = updateClientSchema.parse(request.body)
  const client = await updateClient(response.locals.coordinatorId!, clientId, input)

  if (!client) throw new ApiError(404, 'Client not found')

  response.status(200).json({ data: client })
})

clientsRouter.post('/:clientId/archive', async (request, response) => {
  const { clientId } = clientIdSchema.parse(request.params)
  const client = await archiveClient(response.locals.coordinatorId!, clientId)

  if (!client) throw new ApiError(404, 'Client not found')

  response.status(200).json({ data: client })
})

clientsRouter.post('/:clientId/restore', async (request, response) => {
  const { clientId } = clientIdSchema.parse(request.params)
  const client = await restoreClient(response.locals.coordinatorId!, clientId)

  if (!client) throw new ApiError(404, 'Client not found')

  response.status(200).json({ data: client })
})

