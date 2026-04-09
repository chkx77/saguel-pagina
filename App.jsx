import { useState } from 'react'
import AppShell from './AppShell'
import { AlertBar, Tag } from './ui'
import { CATS, stInfo, fd, hoy } from '../lib/data'
import { exportarPDF } from '../lib/pdf'

// ── Qué comprar ───────────────────────────────────────────────
function Comprar({ stock, pedidos, onAprobar, onRechazar }) {
  const bajo = stock.filter(s => s.qty <= s.min)
  const pend = pedidos.filter(p => p.estado === 'Pendiente')

  if (!bajo.length && !pend.length) {
    return <AlertBar tipo="g"><strong>Sin alertas.</strong> Todo el stock está en orden.</AlertBar>
  }

  return (
    <>
      {bajo.length > 0 && (
        <>
          <div className="sec-label">Reponer ahora ({bajo.length})</div>
          <div className="tbl-wrap" style={{ marginBottom: 12 }}>
            <table>
              <thead><tr><th>Insumo</th><th>Cat</th><th>Hay</th><th>Mín</th><th>Falta</th></tr></thead>
              <tbody>
                {bajo.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{s.nom}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)' }}>
                      {CATS[s.cat]?.n}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'var(--red)' }}>
                        {s.qty}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--ink3)', marginLeft: 3 }}>{s.uni}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink3)' }}>{s.min}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500 }}>
                      {Math.max(0, s.min - s.qty)} {s.uni}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {pend.length > 0 && (
        <>
          <div className="sec-label">Pedidos del operario ({pend.length})</div>
          {pend.map(p => (
            <div key={p.id} className="ped-card">
              <div className="ped-nombre">
                {p.insumo}
                <Tag value={p.urgencia} />
              </div>
              <div className="ped-meta">
                <b>CANT</b> {p.cantidad} {p.unidad}
                {'  '}
                <b>PARA</b> {fd(p.fechaNec)}
                {p.obs && <><br /><b>NOTA</b> {p.obs}</>}
              </div>
              <div className="btn-row" style={{ marginTop: 0 }}>
                <button className="btn b-success b-sm" onClick={() => onAprobar(p.id)}>✓ Comprado</button>
                <button className="btn b-ghost b-sm" onClick={() => onRechazar(p.id)}>✕ No se puede</button>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

// ── Stock ─────────────────────────────────────────────────────
function Stock({ stock }) {
  const bajo = stock.filter(s => s.qty <= s.min)
  const grupos = {}
  stock.forEach(s => { if (!grupos[s.cat]) grupos[s.cat] = []; grupos[s.cat].push(s) })

  return (
    <>
      {bajo.length > 0 && (
        <AlertBar tipo="r"><strong>{bajo.length} insumo(s) bajo el mínimo</strong></AlertBar>
      )}
      {Object.keys(CATS).map(cat => {
        const items = grupos[cat]
        if (!items?.length) return null
        return (
          <div key={cat} className="cat-block">
            <div className="cat-header">
              <span>{CATS[cat].e}</span>
              <span>{CATS[cat].n}</span>
              <span style={{ marginLeft: 'auto' }}>{items.length}</span>
            </div>
            {items.map(s => {
              const si = stInfo(s)
              return (
                <div key={s.id} className="inv-row">
                  <span className="inv-name">{s.nom}</span>
                  <span className="inv-min">mín {s.min}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
                    color: si.level === 'out' ? 'var(--red)' : si.level === 'low' ? 'var(--amber)' : 'var(--ink2)',
                    marginRight: 6,
                  }}>
                    {s.qty} {s.uni}
                  </span>
                  <span className={`status-pill st-${si.level}`}>{si.txt}</span>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

// ── Reporte ───────────────────────────────────────────────────
function Reporte({ stock, pedidos }) {
  const bajo = stock.filter(s => s.qty <= s.min)
  const pend = pedidos.filter(p => p.estado === 'Pendiente')
  const apro = pedidos.filter(p => p.estado === 'Aprobado').length
  const crit = pedidos.filter(p => p.urgencia === 'critica' && p.estado === 'Pendiente').length

  return (
    <>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ marginBottom: 2 }}>Reporte</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)' }}>
            {fd(hoy())} · {stock.length} insumos · {pedidos.length} pedidos
          </div>
        </div>
        <button className="btn b-lime b-sm" onClick={() => exportarPDF(stock, pedidos)}>
          ↓ PDF
        </button>
      </div>

      {/* KPI strip */}
      <div className="kpi-strip" style={{ marginTop: 16 }}>
        {[
          { n: bajo.length, l: 'Bajo mín',   d: bajo.length > 0 },
          { n: pend.length, l: 'Pendientes', d: pend.length > 0 },
          { n: apro,        l: 'Aprobados',  d: false },
          { n: crit,        l: 'Críticos',   d: crit > 0 },
        ].map(k => (
          <div key={k.l} className={`kpi-box${k.d ? ' danger' : ''}`}>
            <div className="kpi-n">{k.n}</div>
            <div className="kpi-l">{k.l}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {crit > 0  && <AlertBar tipo="r"><strong>{crit} pedido(s) crítico(s)</strong> sin resolver.</AlertBar>}
      {bajo.length > 0 && <AlertBar tipo="a"><strong>{bajo.length} insumo(s)</strong> por debajo del mínimo.</AlertBar>}
      {!crit && !bajo.length && <AlertBar tipo="g"><strong>Sin alertas activas.</strong></AlertBar>}

      {/* Insumos a reponer */}
      {bajo.length > 0 && (
        <>
          <div className="sec-label">Insumos a reponer</div>
          <div className="tbl-wrap" style={{ marginBottom: 12 }}>
            <table>
              <thead><tr><th>Insumo</th><th>Hay</th><th>Mín</th><th>Falta</th></tr></thead>
              <tbody>
                {bajo.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 12.5 }}>{s.nom}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)' }}>
                        {CATS[s.cat]?.e} {CATS[s.cat]?.n}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--red)' }}>
                        {s.qty}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--ink3)', marginLeft: 3 }}>{s.uni}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink3)' }}>{s.min}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500, color: 'var(--amber)' }}>
                      {Math.max(0, s.min - s.qty)} {s.uni}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pedidos pendientes */}
      {pend.length > 0 && (
        <>
          <div className="sec-label">Pedidos sin resolver ({pend.length})</div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Insumo</th><th>Cant</th><th>Urg</th><th>Para</th></tr></thead>
              <tbody>
                {pend.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 12.5 }}>{p.insumo}</div>
                      {p.obs && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)' }}>{p.obs}</div>}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink2)', whiteSpace: 'nowrap' }}>
                      {p.cantidad} {p.unidad}
                    </td>
                    <td><Tag value={p.urgencia} /></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)' }}>{fd(p.fechaNec)}</td>
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

// ── Root ──────────────────────────────────────────────────────
const TABS = [
  { id: 'comprar', label: 'Comprar' },
  { id: 'stock',   label: 'Stock' },
  { id: 'reporte', label: 'Reporte' },
]

export default function AppEmpleador({ stock, pedidos, dbStatus, onVolver, onAprobar, onRechazar }) {
  const [tab, setTab] = useState('comprar')
  const badge = stock.filter(s => s.qty <= s.min).length + pedidos.filter(p => p.estado === 'Pendiente').length

  return (
    <AppShell rol="em" onVolver={onVolver} tabs={TABS} activeTab={tab} onTab={setTab} badge={badge} dbStatus={dbStatus}>
      {tab === 'comprar' && <Comprar stock={stock} pedidos={pedidos} onAprobar={onAprobar} onRechazar={onRechazar} />}
      {tab === 'stock'   && <Stock stock={stock} />}
      {tab === 'reporte' && <Reporte stock={stock} pedidos={pedidos} />}
    </AppShell>
  )
}
