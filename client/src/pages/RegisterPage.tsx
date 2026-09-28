import { Link } from 'react-router-dom'

export function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand auth-brand">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>clientCare</span>
        </div>
        <span className="eyebrow">Create your workspace</span>
        <h1>Coordinator registration</h1>
        <p>The form will become active when authentication is implemented.</p>
        <form className="auth-form">
          <label>Full name<input type="text" autoComplete="name" disabled /></label>
          <label>Email<input type="email" autoComplete="email" disabled /></label>
          <label>Password<input type="password" autoComplete="new-password" disabled /></label>
          <button className="button button-primary" type="button" disabled>Create account</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  )
}

