export function Aviso({ tipo, children }) {
  const icon = { r: '⚠', a: '!', v: '✓' }[tipo]
  return (
    <div className={`aviso av-${tipo}`}>
      <span>{icon}</span>
      <span>{children}</span>
    </div>
  )
}

export function Tag({ value }) {
  const map = {
    Pendiente: ['tag-pend', 'Pendiente'],
    Aprobado:  ['tag-apro', 'Aprobado'],
    Rechazado: ['tag-rech', 'Rechazado'],
    normal:    ['tag-norm', 'Normal'],
    alta:      ['tag-alta', 'Alta'],
    critica:   ['tag-crit', 'Crítica'],
  }
  const [cls, label] = map[value] ?? ['tag-norm', value]
  return <span className={`tag ${cls}`}>{label}</span>
}

export function DbDot({ status }) {
  const map = {
    loading: { icon: '⏳', title: 'Conectando a Firebase…' },
    ok:      { icon: '🟢', title: 'Firebase conectado — datos en tiempo real' },
    local:   { icon: '🟡', title: 'Sin Firebase — datos solo en esta sesión' },
  }
  const { icon, title } = map[status] ?? map.local
  return <span style={{ fontSize: 13, cursor: 'help' }} title={title}>{icon}</span>
}

export function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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
