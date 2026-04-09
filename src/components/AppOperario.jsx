import { useState, useRef } from 'react'
import AppShell from './AppShell'
import { Aviso, Tag, Modal } from './ui'
import { CATS, UNIDADES, stInfo, fd, hoy } from '../lib/data'

// ── Inventario ──────────────────────────────────────────────
function Inventario({ stock, onAdj, onAddInsumo, dbStatus }) {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editVal, setEditVal] = useState('')
  const [form, setForm] = useState({ nom: '', cat: 'Limpieza', qty: 0, min: 2, uni: 'unidades' })

  const bajo = stock.filter(s => s.qty <= s.min)
  const grupos = {}
  stock.forEach(s => { if (!grupos[s.cat]) grupos[s.cat] = []; grupos[s.cat].push(s) })

  function startEdit(s) {
    setEditingId(s.id)
    setEditVal(String(s.qty))
  }
  function commitEdit(s) {
    const q = Math.max(0, parseInt(editVal) || 0)
    onAdj(s.id, q)
    setEditingId(null)
  }

  function handleGuardar() {
    if (!form.nom.trim()) { alert('Escribí el nombre'); return }
    onAddInsumo({ ...form, qty: Math.max(0, parseInt(form.qty) || 0), min: Math.max(0, parseInt(form.min) || 2) })
    setForm({ nom: '', cat: 'Limpieza', qty: 0, min: 2, uni: 'unidades' })
    setShowModal(false)
  }

  return (
    <>
      {bajo.length > 0
        ? <Aviso tipo="r"><strong>{bajo.length} insumo(s) bajo el mínimo</strong></Aviso>
        : <Aviso tipo="v">Todo el inventario está en orden</Aviso>
      }

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="page-title" style={{ marginBottom: 0 }}>Inventario</div>
        <button className="btn b-ink b-sm" onClick={() => setShowModal(true)}>+ Agregar</button>
      </div>

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
                  <span className={`inv-status ${si.cls}`}>{si.txt}</span>
                  <div className="inv-controls">
                    <button className="ctrl-btn" onClick={() => onAdj(s.id, Math.max(0, s.qty - 1))}>−</button>
                    {editingId === s.id ? (
                      <input
                        className="ctrl-input"
                        type="number"
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onBlur={() => commitEdit(s)}
                        onKeyDown={e => e.key === 'Enter' && commitEdit(s)}
                        autoFocus
                      />
                    ) : (
                      <span className="ctrl-num" onClick={() => startEdit(s)} title="Tocá para editar">{s.qty}</span>
                    )}
                    <button className="ctrl-btn" onClick={() => onAdj(s.id, s.qty + 1)}>+</button>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      {showModal && (
        <Modal title="Agregar insumo" onClose={() => setShowModal(false)}>
          <div className="field">
            <label>Nombre</label>
            <input type="text" placeholder="Ej: Lavandina 5l" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
          </div>
          <div className="field">
            <label>Categoría</label>
            <select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
              {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v.e} {v.n}</option>)}
            </select>
          </div>
          <div className="row2">
            <div className="field">
              <label>Cantidad actual</label>
              <input type="number" min="0" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} />
            </div>
            <div className="field">
              <label>Unidad</label>
              <select value={form.uni} onChange={e => setForm(f => ({ ...f, uni: e.target.value }))}>
                {UNIDADES.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Mínimo de stock</label>
            <input type="number" min="0" value={form.min} onChange={e => setForm(f => ({ ...f, min: e.target.value }))} />
          </div>
          <button className="btn b-ink b-lg" style={{ width: '100%' }} onClick={handleGuardar}>Guardar</button>
        </Modal>
      )}
    </>
  )
}

// ── Pedir ────────────────────────────────────────────────────
function Pedir({ stock, onAddPedido }) {
  const grupos = {}
  stock.forEach(s => { if (!grupos[s.cat]) grupos[s.cat] = []; grupos[s.cat].push(s) })

  const empty = { ins: '', otro: '', cant: 1, uni: 'unidades', urg: 'normal', fecha: '', obs: '' }
  const [f, setF] = useState(empty)
  const [errs, setErrs] = useState({})
  const [ok, setOk] = useState(false)

  function set(k, v) { setF(prev => ({ ...prev, [k]: v })) }

  function enviar() {
    const nom = f.ins === 'Otro' ? f.otro.trim() : f.ins
    const cant = parseInt(f.cant)
    const newErrs = {}
    if (!nom) newErrs.ins = 'Elegí o escribí el insumo'
    if (!cant || cant < 1) newErrs.cant = 'Cantidad inválida'
    if (!f.fecha) newErrs.fecha = 'Elegí una fecha'
    setErrs(newErrs)
    if (Object.keys(newErrs).length) return
    onAddPedido({ insumo: nom, cantidad: cant, unidad: f.uni, urgencia: f.urg, fechaNec: f.fecha, obs: f.obs })
    setF(empty)
    setOk(true)
    setTimeout(() => setOk(false), 3500)
  }

  return (
    <>
      <div className="page-title">Pedir insumo</div>
      {ok && <Aviso tipo="v"><strong>Pedido registrado.</strong></Aviso>}

      <div className="row2">
        <div className="field">
          <label>Insumo</label>
          <select value={f.ins} onChange={e => set('ins', e.target.value)}>
            <option value="">— Elegí —</option>
            {Object.keys(CATS).map(cat => grupos[cat]?.length ? (
              <optgroup key={cat} label={`${CATS[cat].e} ${CATS[cat].n}`}>
                {grupos[cat].map(s => <option key={s.id} value={s.nom}>{s.nom}</option>)}
              </optgroup>
            ) : null)}
            <option value="Otro">Otro — escribir abajo</option>
          </select>
          {errs.ins && <div className="field-err">{errs.ins}</div>}
        </div>
        {f.ins === 'Otro' && (
          <div className="field">
            <label>¿Cuál?</label>
            <input type="text" placeholder="Nombre..." value={f.otro} onChange={e => set('otro', e.target.value)} />
          </div>
        )}
      </div>

      <div className="row3">
        <div className="field">
          <label>Cantidad</label>
          <input type="number" min="1" value={f.cant} onChange={e => set('cant', e.target.value)} />
          {errs.cant && <div className="field-err">{errs.cant}</div>}
        </div>
        <div className="field">
          <label>Unidad</label>
          <select value={f.uni} onChange={e => set('uni', e.target.value)}>
            {UNIDADES.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Urgencia</label>
          <select value={f.urg} onChange={e => set('urg', e.target.value)}>
            <option value="normal">Sin apuro</option>
            <option value="alta">Pronto</option>
            <option value="critica">Ya mismo</option>
          </select>
        </div>
      </div>

      <div className="field" style={{ maxWidth: 220 }}>
        <label>¿Para cuándo?</label>
        <input type="date" value={f.fecha} onChange={e => set('fecha', e.target.value)} />
        {errs.fecha && <div className="field-err">{errs.fecha}</div>}
      </div>

      <div className="field">
        <label>Nota <span style={{ fontWeight: 400, color: '#CCC' }}>(opcional)</span></label>
        <textarea placeholder="Área, turno, detalle..." value={f.obs} onChange={e => set('obs', e.target.value)} />
      </div>

      <div className="btn-row">
        <button className="btn b-ink b-lg" onClick={enviar}>Registrar pedido</button>
        <button className="btn b-ghost" onClick={() => { setF(empty); setErrs({}) }}>Limpiar</button>
      </div>
    </>
  )
}

// ── Historial ────────────────────────────────────────────────
function Historial({ pedidos, onDelete }) {
  const [bq, setBq] = useState('')
  const [est, setEst] = useState('')
  const [urg, setUrg] = useState('')
  const [detalle, setDetalle] = useState(null)

  const fil = pedidos.filter(p => {
    if (est && p.estado !== est) return false
    if (urg && p.urgencia !== urg) return false
    if (bq && !p.insumo.toLowerCase().includes(bq.toLowerCase())) return false
    return true
  })

  return (
    <>
      <div className="page-title">Mis pedidos</div>
      <div className="row3" style={{ marginBottom: 14 }}>
        <div className="field" style={{ margin: 0 }}>
          <label style={{ fontSize: 12 }}>Buscar</label>
          <input type="text" placeholder="Insumo..." value={bq} onChange={e => setBq(e.target.value)} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label style={{ fontSize: 12 }}>Estado</label>
          <select value={est} onChange={e => setEst(e.target.value)}>
            <option value="">Todos</option>
            <option>Pendiente</option><option>Aprobado</option><option>Rechazado</option>
          </select>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label style={{ fontSize: 12 }}>Urgencia</label>
          <select value={urg} onChange={e => setUrg(e.target.value)}>
            <option value="">Todas</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>
      </div>

      {fil.length === 0 ? (
        <div className="empty">No hay pedidos</div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th>Insumo</th><th>Cant.</th><th>Urgencia</th><th>Fecha</th><th>Estado</th><th></th>
            </tr></thead>
            <tbody>
              {fil.map(p => (
                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setDetalle(p)}>
                  <td><strong>{p.insumo}</strong></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{p.cantidad} {p.unidad}</td>
                  <td><Tag value={p.urgencia} /></td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{fd(p.creado)}</td>
                  <td><Tag value={p.estado} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn b-ghost b-sm" style={{ color: 'var(--red)' }}
                      onClick={() => { if (confirm('¿Borrar este pedido?')) onDelete(p.id) }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 12, color: '#CCC', padding: '9px 13px' }}>{fil.length} pedidos · Tocá para ver detalle</div>
        </div>
      )}

      {detalle && (
        <Modal title={detalle.insumo} onClose={() => setDetalle(null)}>
          {[
            ['Cantidad', `${detalle.cantidad} ${detalle.unidad}`],
            ['Urgencia', <Tag key="u" value={detalle.urgencia} />],
            ['Estado', <Tag key="e" value={detalle.estado} />],
            ['Pedido el', fd(detalle.creado)],
            ['Para', fd(detalle.fechaNec)],
            ...(detalle.obs ? [['Nota', detalle.obs]] : []),
          ].map(([l, v]) => (
            <div key={l} className="det-row">
              <span className="det-l">{l}</span>
              <span className="det-v">{v}</span>
            </div>
          ))}
        </Modal>
      )}
    </>
  )
}

// ── AppOperario ──────────────────────────────────────────────
const TABS_OP = [
  { id: 'inv',    label: 'Inventario' },
  { id: 'pedir',  label: 'Pedir insumo' },
  { id: 'hist',   label: 'Mis pedidos' },
]

export default function AppOperario({ stock, pedidos, dbStatus, onVolver, onAdj, onAddInsumo, onAddPedido, onDelete }) {
  const [tab, setTab] = useState('inv')

  return (
    <AppShell rol="op" onVolver={onVolver} tabs={TABS_OP} activeTab={tab} onTab={setTab} dbStatus={dbStatus}>
      {tab === 'inv'   && <Inventario stock={stock} onAdj={onAdj} onAddInsumo={onAddInsumo} dbStatus={dbStatus} />}
      {tab === 'pedir' && <Pedir stock={stock} onAddPedido={onAddPedido} />}
      {tab === 'hist'  && <Historial pedidos={pedidos} onDelete={onDelete} />}
    </AppShell>
  )
}
