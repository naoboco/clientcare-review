import { type FormEvent, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearAuthError, login } from '../features/auth/authSlice'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const submitting = useAppSelector((state) => state.auth.submitting)
  const error = useAppSelector((state) => state.auth.error)

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = await dispatch(login({
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    }))

    if (login.fulfilled.match(result)) {
      const requestedPath = (location.state as { from?: string } | null)?.from
      navigate(requestedPath?.startsWith('/') ? requestedPath : '/dashboard', { replace: true })
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand auth-brand">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>clientCare</span>
        </div>
        <span className="eyebrow">Coordinator access</span>
        <h1>Welcome back</h1>
        <p>Log in to review your client follow-ups.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          {error ? <div className="form-error" role="alert">{error}</div> : null}
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="auth-switch">No account? <Link to="/register">Register</Link></p>
      </section>
    </main>
  )
}
