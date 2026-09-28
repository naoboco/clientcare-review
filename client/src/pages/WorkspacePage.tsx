interface WorkspacePageProps {
  title: string
}

export function WorkspacePage({ title }: WorkspacePageProps) {
  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <span className="eyebrow">Coming in the next implementation step</span>
          <h1>{title}</h1>
          <p>The route is ready. Its form and API connection will be added next.</p>
        </div>
      </section>
      <section className="panel placeholder-panel" aria-label={`${title} placeholder`}>
        <span>Route scaffold ready</span>
      </section>
    </div>
  )
}

