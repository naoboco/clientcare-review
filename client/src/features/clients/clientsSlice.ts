import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiClientError } from '../../app/api'
import {
  requestArchiveClient,
  requestClient,
  requestCreateClient,
  requestRestoreClient,
  requestUpdateClient,
  requestClients,
  type ClientListOptions,
} from './clientsApi'
import type { Client, ClientInput } from './types'

interface ClientsState {
  items: Client[]
  selected: Client | null
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  mutationStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  nextCursor: string | null
}

const initialState: ClientsState = {
  items: [],
  selected: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  mutationStatus: 'idle',
  error: null,
  nextCursor: null,
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiClientError) return error.message
  return 'Unable to load client data. Please try again.'
}

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (options: ClientListOptions = {}, { rejectWithValue }) => {
    try {
      return await requestClients(options)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const fetchClient = createAsyncThunk(
  'clients/fetchClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await requestClient(clientId)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (input: ClientInput, { rejectWithValue }) => {
    try {
      const response = await requestCreateClient(input)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ clientId, input }: { clientId: string; input: ClientInput }, { rejectWithValue }) => {
    try {
      const response = await requestUpdateClient(clientId, input)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const archiveClient = createAsyncThunk(
  'clients/archiveClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await requestArchiveClient(clientId)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const restoreClient = createAsyncThunk(
  'clients/restoreClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await requestRestoreClient(clientId)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

function replaceItem(items: Client[], client: Client) {
  const index = items.findIndex((item) => item.id === client.id)
  if (index === -1) items.unshift(client)
  else items[index] = client
}

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearClientError(state) {
      state.error = null
    },
    clearSelectedClient(state) {
      state.selected = null
      state.detailStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.listStatus = 'loading'
        state.error = null
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.items = action.meta.arg.cursor
          ? [...state.items, ...action.payload.data]
          : action.payload.data
        state.nextCursor = action.payload.page.nextCursor
        state.listStatus = 'succeeded'
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.listStatus = 'failed'
        state.error = String(action.payload ?? 'Unable to load clients')
      })
      .addCase(fetchClient.pending, (state) => {
        state.detailStatus = 'loading'
        state.error = null
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.selected = action.payload
        replaceItem(state.items, action.payload)
        state.detailStatus = 'succeeded'
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.error = String(action.payload ?? 'Unable to load client')
      })
      .addCase(createClient.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        replaceItem(state.items, action.payload)
        state.selected = action.payload
      })
      .addCase(createClient.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = String(action.payload ?? 'Unable to create client')
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        replaceItem(state.items, action.payload)
        state.selected = action.payload
      })
      .addCase(updateClient.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = String(action.payload ?? 'Unable to update client')
      })
      .addCase(archiveClient.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        replaceItem(state.items, action.payload)
        state.selected = action.payload
      })
      .addCase(archiveClient.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(archiveClient.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = String(action.payload ?? 'Unable to archive client')
      })
      .addCase(restoreClient.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        replaceItem(state.items, action.payload)
        state.selected = action.payload
      })
      .addCase(restoreClient.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(restoreClient.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = String(action.payload ?? 'Unable to restore client')
      })
  },
})

export const { clearClientError, clearSelectedClient } = clientsSlice.actions
export const clientsReducer = clientsSlice.reducer
