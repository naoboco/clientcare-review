import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand auth-brand">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>clientCare</span>
        </div>
        <span className="eyebrow">Coordinator access</span>
        <h1>Welcome back</h1>
        <p>Authentication will be connected in the next development step.</p>
        <form className="auth-form">
          <label>Email<input type="email" autoComplete="email" disabled /></label>
          <label>Password<input type="password" autoComplete="current-password" disabled /></label>
          <button className="button button-primary" type="button" disabled>Log in</button>
        </form>
        <p className="auth-switch">No account? <Link to="/register">Register</Link></p>
      </section>
    </main>
  )
}

