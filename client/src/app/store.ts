import { configureStore } from '@reduxjs/toolkit'

const initialState = {
  initialized: true,
}

function appReducer(state = initialState) {
  return state
}

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

