// AppShell — header (logo + pipeline status) and footer (privacy line)
// for the Job Application Agent. Composes the design-system components.
const NS = window.JobApplicationAgentDesignSystem_8adca7;

function AppShell({ status, statusLabel, children }) {
  const { StatusIndicator, Icon } = NS;
  return (
    <div style={{ minHeight: '100%', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--border-default)', background: 'var(--surface)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{
          maxWidth: 1180, margin: '0 auto', padding: '14px 32px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <img src="../../assets/logomark.svg" alt="" width="34" height="34" style={{ display: 'block' }} />
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1 }}>
            Job Application <b style={{ fontWeight: 600 }}>Agent</b>
          </div>
          <div style={{ flex: 1 }} />
          <StatusIndicator state={status} label={statusLabel} />
        </div>
      </header>

      <main style={{ flex: 1, width: '100%', maxWidth: 1180, margin: '0 auto', padding: '40px 32px 28px', boxSizing: 'border-box' }}>
        {children}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-default)', background: 'var(--surface)' }}>
        <div style={{
          maxWidth: 1180, margin: '0 auto', padding: '16px 32px',
          display: 'flex', alignItems: 'center', gap: 9,
          fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)',
        }}>
          <Icon name="shield" size={14} style={{ color: 'var(--text-faint)' }} />
          No accounts · No stored data · No cookies. Your CV is processed in memory and never written to disk.
        </div>
      </footer>
    </div>
  );
}

window.AppShell = AppShell;
