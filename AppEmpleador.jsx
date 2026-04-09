import { BackIcon, DbDot } from './ui'

export default function AppShell({ rol, onVolver, tabs, activeTab, onTab, badge, dbStatus, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        height: 48, display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 12, flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button
          onClick={onVolver}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--ink3)', padding: '4px 6px', borderRadius: 'var(--r-sm)',
            display: 'flex', alignItems: 'center', transition: '.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
        >
          <BackIcon />
        </button>

        {/* Logo mark */}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
          color: 'var(--lime)', letterSpacing: '.1em', textTransform: 'uppercase',
        }}>
          SAGUEL
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)' }}>
          / {rol === 'op' ? 'OPERARIO' : 'EMPLEADOR'}
        </span>

        <div style={{ flex: 1 }} />

        {rol === 'op' && <DbDot status={dbStatus} />}
        {rol === 'em' && badge > 0 && (
          <span style={{
            background: 'var(--red)', color: '#fff',
            borderRadius: 20, fontSize: 10, fontWeight: 700,
            padding: '2px 7px', fontFamily: 'var(--font-mono)',
          }}>{badge}</span>
        )}
      </div>

      {/* Tabs */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', flexShrink: 0, overflowX: 'auto',
        padding: '0 16px', gap: 2,
      }}>
        {tabs.map(({ id, label }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTab(id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 14px',
                fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 500,
                color: active ? 'var(--lime)' : 'var(--ink3)',
                borderBottom: active ? '1.5px solid var(--lime)' : '1.5px solid transparent',
                textTransform: 'uppercase', letterSpacing: '.06em',
                transition: 'color .1s, border-color .1s',
                whiteSpace: 'nowrap',
              }}
            >{label}</button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 640, margin: '0 auto', width: '100%', padding: '20px 16px' }}>
        {children}
      </div>
    </div>
  )
}
