export default function Inicio({ onEntrar }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
          color: 'var(--lime)', letterSpacing: '.2em', marginBottom: 8,
        }}>GRUPO SAGUEL</div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.5px', marginBottom: 4 }}>
          Gestión de Insumos
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)' }}>
          Styropek · General Lagos
        </div>
      </div>

      {/* Role cards */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 480 }}>
        {[
          {
            rol: 'op',
            label: 'OPERARIO',
            desc: 'Inventario · Pedidos',
            icon: '▣',
          },
          {
            rol: 'em',
            label: 'EMPLEADOR',
            desc: 'Dashboard · Reporte',
            icon: '◈',
          },
        ].map(({ rol, label, desc, icon }) => (
          <button
            key={rol}
            onClick={() => onEntrar(rol)}
            style={{
              flex: 1, minWidth: 180,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12, padding: '24px 20px',
              cursor: 'pointer', textAlign: 'left',
              transition: 'border-color .15s, transform .12s',
              appearance: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--lime)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--lime)',
              marginBottom: 12, lineHeight: 1,
            }}>{icon}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
              color: 'var(--lime)', letterSpacing: '.1em', marginBottom: 4,
            }}>{label}</div>
            <div style={{ fontSize: 12, color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
              {desc}
            </div>
            <div style={{
              marginTop: 20, fontSize: 11, color: 'var(--ink3)',
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-mono)',
            }}>
              ENTRAR →
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 20,
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)',
        letterSpacing: '.06em',
      }}>
        NEXEN · SISTEMA DE GESTIÓN
      </div>
    </div>
  )
}
