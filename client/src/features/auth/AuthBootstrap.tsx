import { useEffect, type ReactNode } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { fetchCurrentUser } from './authSlice'

interface AuthBootstrapProps {
  children: ReactNode
}

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    void dispatch(fetchCurrentUser())
  }, [dispatch])

  return children
}

