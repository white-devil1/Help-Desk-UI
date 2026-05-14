const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer style={{
      height: 'var(--footer-height, 48px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', gap: '16px',
      background: 'var(--footer-bg, #0f1419)',
      borderTop: '1px solid var(--header-border, rgba(255,255,255,.07))',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        font: '500 11px var(--font-mono, monospace)',
        color: 'rgba(255,255,255,.35)', letterSpacing: '0.04em',
      }}>
        <span style={{ color: 'var(--accent, #22c55e)', display: 'flex' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2 4.5 13.5h6L9.5 22 19 9.5h-6L13 2z"/>
          </svg>
        </span>
        <span>&copy; {year} Workforce Management</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        font: '700 10px var(--font-mono, monospace)',
        color: 'rgba(255,255,255,.3)', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--accent, #22c55e)',
          boxShadow: '0 0 8px rgba(34,197,94,.7)',
          display: 'inline-block',
        }} />
        <span>All Systems Operational</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        font: '500 11px var(--font-mono, monospace)', letterSpacing: '0.04em',
      }}>
        <a href="#" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em' }}>Privacy</a>
        <a href="#" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em' }}>Support</a>
        <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '10px' }}>v1.0.0</span>
      </div>
    </footer>
  );
}
