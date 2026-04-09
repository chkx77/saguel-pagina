import { useState } from 'react'
import { useStore } from './lib/useStore'
import Inicio from './components/Inicio'
import AppOperario from './components/AppOperario'
import AppEmpleador from './components/AppEmpleador'

export default function App() {
  const [pantalla, setPantalla] = useState('loading')

  const {
    stock, pedidos, dbStatus,
    updateQty, addInsumo,
    addPedido, updatePedidoEstado, deletePedido,
  } = useStore()

  if (pantalla === 'loading' && dbStatus !== 'loading') {
    setPantalla('inicio')
  }

  if (pantalla === 'loading') {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 12,
      }}>
        <div className="spinner" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', letterSpacing: '.1em' }}>
          CONECTANDO…
        </span>
      </div>
    )
  }

  if (pantalla === 'inicio') return <Inicio onEntrar={setPantalla} />

  if (pantalla === 'op') return (
    <AppOperario
      stock={stock} pedidos={pedidos} dbStatus={dbStatus}
      onVolver={() => setPantalla('inicio')}
      onAdj={updateQty}
      onAddInsumo={addInsumo}
      onAddPedido={addPedido}
      onDelete={deletePedido}
    />
  )

  if (pantalla === 'em') return (
    <AppEmpleador
      stock={stock} pedidos={pedidos} dbStatus={dbStatus}
      onVolver={() => setPantalla('inicio')}
      onAprobar={id => updatePedidoEstado(id, 'Aprobado')}
      onRechazar={id => updatePedidoEstado(id, 'Rechazado')}
    />
  )
}
