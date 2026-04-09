import { BackArrow, DbDot } from './ui'

export default function AppShell({ rol, onVolver, tabs, activeTab, onTab, badge, dbStatus, children }) {
  const isOp = rol === 'op'
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--white)', borderBottom: '1px solid var(--border)',
        height: 56, display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 12, flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 6, borderRadius: 7, display: 'flex', alignItems: 'center' }}
          onClick={onVolver}
        >
          <BackArrow />
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>
          {isOp ? '👷 Operario' : '👔 Empleador'}
        </span>
        {isOp && <DbDot status={dbStatus} />}
        {!isOp && badge > 0 && (
          <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 20, fontSize: 12, fontWeight: 700, padding: '2px 8px' }}>
            {badge}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', flexShrink: 0, overflowX: 'auto' }}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onTab(id)}
            style={{
              flex: 1, minWidth: 90, padding: '14px 10px',
              fontSize: 14, fontWeight: activeTab === id ? 700 : 500,
              color: activeTab === id ? 'var(--ink)' : 'var(--muted)',
              background: 'none', border: 'none',
              borderBottom: activeTab === id ? '2px solid var(--ink)' : '2px solid transparent',
              cursor: 'pointer', whiteSpace: 'nowrap', textAlign: 'center',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 680, margin: '0 auto', width: '100%', padding: '24px 20px' }}>
        {children}
      </div>
    </div>
  )
}
