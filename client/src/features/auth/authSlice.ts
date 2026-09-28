import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiClientError, apiRequest } from '../../app/api'
import type { LoginInput, RegisterInput, User } from './types'

interface AuthResponse {
  data: User
}

interface AuthState {
  user: User | null
  status: 'checking' | 'authenticated' | 'unauthenticated'
  bootstrapStarted: boolean
  submitting: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  status: 'checking',
  bootstrapStarted: false,
  submitting: false,
  error: null,
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiClientError) return error.message
  return 'Unable to reach ClientCare. Please try again.'
}

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { state: { auth: AuthState }; rejectValue: string }
>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest<AuthResponse>('/api/auth/me')
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
  {
    condition: (_, { getState }) => !getState().auth.bootstrapStarted,
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async (input: LoginInput, { rejectWithValue }) => {
    try {
      const response = await apiRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (input: RegisterInput, { rejectWithValue }) => {
    try {
      const response = await apiRequest<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await apiRequest<void>('/api/auth/logout', { method: 'POST' })
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.bootstrapStarted = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'authenticated'
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null
        state.status = 'unauthenticated'
      })
      .addCase(login.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'authenticated'
        state.submitting = false
      })
      .addCase(login.rejected, (state, action) => {
        state.error = String(action.payload ?? 'Login failed')
        state.submitting = false
      })
      .addCase(register.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'authenticated'
        state.submitting = false
      })
      .addCase(register.rejected, (state, action) => {
        state.error = String(action.payload ?? 'Registration failed')
        state.submitting = false
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = 'unauthenticated'
      })
      .addCase(logout.rejected, (state) => {
        state.user = null
        state.status = 'unauthenticated'
      })
  },
})

export const { clearAuthError } = authSlice.actions
export const authReducer = authSlice.reducer
