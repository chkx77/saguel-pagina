export function AlertBar({ tipo, children }) {
  const map = { r: ['al-r', '▲'], a: ['al-a', '●'], g: ['al-g', '✓'] }
  const [cls, icon] = map[tipo] ?? map.g
  return (
    <div className={`alert-bar ${cls}`}>
      <span className="alert-icon">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

export function Tag({ value }) {
  const map = {
    Pendiente: ['tag-pend', 'PENDIENTE'],
    Aprobado:  ['tag-apro', 'APROBADO'],
    Rechazado: ['tag-rech', 'RECHAZADO'],
    normal:    ['tag-norm', 'NORMAL'],
    alta:      ['tag-alta', 'ALTA'],
    critica:   ['tag-crit', 'CRÍTICA'],
  }
  const [cls, label] = map[value] ?? ['tag-norm', value]
  return <span className={`tag ${cls}`}>{label}</span>
}

export function DbDot({ status }) {
  const map = {
    loading: '⏳',
    ok:      '●',
    local:   '○',
  }
  const colors = { loading: 'var(--ink3)', ok: 'var(--lime)', local: 'var(--amber)' }
  const titles = {
    loading: 'Conectando…',
    ok: 'Firebase · tiempo real',
    local: 'Modo local · sin Firebase',
  }
  return (
    <span
      title={titles[status]}
      style={{ fontSize: 10, color: colors[status], fontFamily: 'var(--font-mono)', cursor: 'help', letterSpacing: '.04em' }}
    >
      {map[status]} {status === 'ok' ? 'LIVE' : status === 'local' ? 'LOCAL' : '…'}
    </span>
  )
}

export function Modal({ onClose, title, children }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-top">
          <span className="modal-title">{title}</span>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
