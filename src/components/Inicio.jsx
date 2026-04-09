import { ChevronRight } from './ui'

export default function Inicio({ onEntrar }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', gap: 48,
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-.3px' }}>
          Grupo SAGUEL
        </h1>
        <p style={{ fontSize: 13, color: '#444', marginTop: 4 }}>Styropek · General Lagos</p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 480 }}>
        {[
          { rol: 'op', emoji: '👷', title: 'Operario', desc: 'Actualizá el stock y registrá pedidos' },
          { rol: 'em', emoji: '👔', title: 'Empleador', desc: 'Mirá qué falta y el reporte' },
        ].map(({ rol, emoji, title, desc }) => (
          <button
            key={rol}
            onClick={() => onEntrar(rol)}
            style={{
              flex: 1, minWidth: 200, background: '#1A1A1A',
              border: '1px solid #2A2A2A', borderRadius: 16,
              padding: '28px 22px', cursor: 'pointer', textAlign: 'left',
              transition: 'border-color .15s, transform .12s', appearance: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.transform = 'none' }}
          >
            <span style={{ fontSize: 32, display: 'block', marginBottom: 14 }}>{emoji}</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 5 }}>{title}</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5, marginBottom: 20 }}>{desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: '#888' }}>
              Entrar <ChevronRight />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
