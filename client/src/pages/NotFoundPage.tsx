import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="auth-page">
      <section className="auth-card empty-state">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p>This page appears to have missed its follow-up.</p>
        <Link className="button button-primary" to="/dashboard">Return to dashboard</Link>
      </section>
    </main>
  )
}

