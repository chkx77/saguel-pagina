import { useState } from 'react'
import AppShell from './AppShell'
import { Aviso, Tag } from './ui'
import { CATS, stInfo, fd, hoy } from '../lib/data'
import { exportarPDF } from '../lib/pdf'

// ── Qué comprar ──────────────────────────────────────────────
function Comprar({ stock, pedidos, onAprobar, onRechazar }) {
  const bajo = stock.filter(s => s.qty <= s.min)
  const pend = pedidos.filter(p => p.estado === 'Pendiente')

  if (!bajo.length && !pend.length) {
    return <Aviso tipo="v"><strong>No hay nada que comprar.</strong> Todo está en orden.</Aviso>
  }

  return (
    <>
      {bajo.length > 0 && (
        <>
          <div className="section-label">Insumos que hay que reponer ({bajo.length})</div>
          <div className="tbl-wrap" style={{ marginBottom: 20 }}>
            <table>
              <thead><tr><th>Insumo</th><th>Hay ahora</th><th>Mínimo</th><th>Falta</th></tr></thead>
              <tbody>
                {bajo.map(s => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.nom}</strong><br />
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{CATS[s.cat]?.e} {CATS[s.cat]?.n}</span>
                    </td>
                    <td style={{ fontSize: 18, fontWeight: 800, color: 'var(--red)' }}>{s.qty}</td>
                    <td style={{ color: 'var(--muted)' }}>{s.min}</td>
                    <td style={{ fontWeight: 700 }}>{Math.max(0, s.min - s.qty)} {s.uni}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {pend.length > 0 && (
        <>
          <div className="section-label">Pedidos del operario ({pend.length})</div>
          {pend.map(p => (
            <div key={p.id} className="ped-card">
              <div className="ped-nombre">{p.insumo} <Tag value={p.urgencia} /></div>
              <div className="ped-dato">
                <strong>Cantidad:</strong> {p.cantidad} {p.unidad}<br />
                <strong>Para el:</strong> {fd(p.fechaNec)}
                {p.obs && <><br /><strong>Nota:</strong> {p.obs}</>}
              </div>
              <div className="btn-row">
                <button className="btn b-green" onClick={() => onAprobar(p.id)}>✓ Ya lo compré</button>
                <button className="btn b-ghost" onClick={() => onRechazar(p.id)}>✕ No se puede</button>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

// ── Stock ────────────────────────────────────────────────────
function Stock({ stock }) {
  const bajo = stock.filter(s => s.qty <= s.min)
  const grupos = {}
  stock.forEach(s => { if (!grupos[s.cat]) grupos[s.cat] = []; grupos[s.cat].push(s) })

  return (
    <>
      {bajo.length > 0 && (
        <Aviso tipo="r"><strong>{bajo.length} insumo(s) bajo el mínimo</strong></Aviso>
      )}
      {Object.keys(CATS).map(cat => {
        const items = grupos[cat]
        if (!items?.length) return null
        return (
          <div key={cat}>
            <div className="cat-header">
              <span className="cat-emoji">{CATS[cat].e}</span>
              <span className="cat-name">{CATS[cat].n}</span>
            </div>
            {items.map(s => {
              const si = stInfo(s)
              return (
                <div key={s.id} className="inv-item">
                  <div className="inv-left">
                    <div className="inv-nombre">{s.nom}</div>
                    <div className="inv-meta">mín: {s.min} {s.uni}</div>
                  </div>
                  <span className={`inv-status ${si.cls}`}>{s.qty} {s.uni}</span>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

// ── Reporte ──────────────────────────────────────────────────
function Reporte({ stock, pedidos }) {
  const bajo = stock.filter(s => s.qty <= s.min)
  const pend = pedidos.filter(p => p.estado === 'Pendiente')
  const apro = pedidos.filter(p => p.estado === 'Aprobado').length
  const crit = pedidos.filter(p => p.urgencia === 'critica' && p.estado === 'Pendiente').length

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div className="page-title" style={{ marginBottom: 0 }}>Reporte</div>
        <button className="btn b-ink b-sm" onClick={() => exportarPDF(stock, pedidos)}>⬇ PDF</button>
      </div>
      <div className="rep-sub">
        Estado al {fd(hoy())} · {stock.length} insumos · {pedidos.length} pedidos en total
      </div>

      {crit > 0 && <Aviso tipo="r"><strong>{crit} pedido(s) crítico(s) sin resolver.</strong> Requieren atención inmediata.</Aviso>}
      {bajo.length > 0 && <Aviso tipo="a"><strong>{bajo.length} insumo(s) por debajo del mínimo.</strong> Hay que reponer.</Aviso>}
      {!crit && !bajo.length && <Aviso tipo="v"><strong>Todo en orden.</strong> No hay alertas activas.</Aviso>}

      <div className="rep-kpis">
        {[
          { n: bajo.length, l: 'Stock bajo',       d: bajo.length > 0 },
          { n: pend.length, l: 'Pendientes',        d: pend.length > 0 },
          { n: apro,        l: 'Aprobados',         d: false },
          { n: crit,        l: 'Críticos',          d: crit > 0 },
        ].map(k => (
          <div key={k.l} className="rep-kpi">
            <div className={`rep-kpi-n${k.d ? ' danger' : ''}`}>{k.n}</div>
            <div className="rep-kpi-l">{k.l}</div>
          </div>
        ))}
      </div>

      {bajo.length > 0 && (
        <>
          <div className="section-label">Insumos a reponer</div>
          <div className="tbl-wrap" style={{ marginBottom: 20 }}>
            <table>
              <thead><tr><th>Insumo</th><th>Hay</th><th>Mínimo</th><th>Falta</th></tr></thead>
              <tbody>
                {bajo.map(s => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.nom}</strong><br />
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{CATS[s.cat]?.e} {CATS[s.cat]?.n}</span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--red)' }}>{s.qty} {s.uni}</td>
                    <td style={{ color: 'var(--muted)' }}>{s.min}</td>
                    <td style={{ fontWeight: 700 }}>{Math.max(0, s.min - s.qty)} {s.uni}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {pend.length > 0 && (
        <>
          <div className="section-label">Pedidos sin resolver ({pend.length})</div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Insumo</th><th>Cant.</th><th>Urgencia</th><th>Para</th></tr></thead>
              <tbody>
                {pend.map(p => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.insumo}</strong>
                      {p.obs && <><br /><span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.obs}</span></>}
                    </td>
                    <td>{p.cantidad} {p.unidad}</td>
                    <td><Tag value={p.urgencia} /></td>
                    <td style={{ fontSize: 12 }}>{fd(p.fechaNec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

// ── AppEmpleador ─────────────────────────────────────────────
const TABS_EM = [
  { id: 'comprar', label: 'Qué comprar' },
  { id: 'stock',   label: 'Stock' },
  { id: 'reporte', label: 'Reporte' },
]

export default function AppEmpleador({ stock, pedidos, dbStatus, onVolver, onAprobar, onRechazar }) {
  const [tab, setTab] = useState('comprar')

  const badge = stock.filter(s => s.qty <= s.min).length
    + pedidos.filter(p => p.estado === 'Pendiente').length

  return (
    <AppShell rol="em" onVolver={onVolver} tabs={TABS_EM} activeTab={tab} onTab={setTab} badge={badge} dbStatus={dbStatus}>
      {tab === 'comprar' && <Comprar stock={stock} pedidos={pedidos} onAprobar={onAprobar} onRechazar={onRechazar} />}
      {tab === 'stock'   && <Stock stock={stock} />}
      {tab === 'reporte' && <Reporte stock={stock} pedidos={pedidos} />}
    </AppShell>
  )
}
