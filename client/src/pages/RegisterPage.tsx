import { type FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearAuthError, register } from '../features/auth/authSlice'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const submitting = useAppSelector((state) => state.auth.submitting)
  const error = useAppSelector((state) => state.auth.error)

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = await dispatch(register({
      name: String(formData.get('name')),
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    }))

    if (register.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand auth-brand">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>clientCare</span>
        </div>
        <span className="eyebrow">Create your workspace</span>
        <h1>Coordinator registration</h1>
        <p>Create a secure coordinator account.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Full name<input name="name" type="text" autoComplete="name" minLength={2} required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>
            Password
            <input name="password" type="password" autoComplete="new-password" minLength={12} required />
            <span className="field-hint">Use at least 12 characters.</span>
          </label>
          {error ? <div className="form-error" role="alert">{error}</div> : null}
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  )
}
