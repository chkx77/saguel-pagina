import { useState, useEffect, useRef } from 'react'
import {
  db, firebaseReady,
  collection, doc,
  getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, writeBatch
} from './firebase'
import { STOCK_INICIAL, hoy } from './data'

export function useStore() {
  const [stock, setStock]     = useState([])
  const [pedidos, setPedidos] = useState([])
  const [dbStatus, setDbStatus] = useState('loading') // 'loading' | 'ok' | 'local'
  const nextS = useRef(40)
  const nextP = useRef(1)

  useEffect(() => {
    if (!firebaseReady) {
      setStock(STOCK_INICIAL.map(s => ({ ...s })))
      setPedidos([])
      setDbStatus('local')
      return
    }

    let unsubStock, unsubPedidos

    async function init() {
      try {
        // Seed stock if empty
        const snap = await getDocs(collection(db, 'stock'))
        if (snap.empty) {
          const batch = writeBatch(db)
          STOCK_INICIAL.forEach(s => batch.set(doc(db, 'stock', String(s.id)), s))
          await batch.commit()
        }

        // Real-time listeners
        unsubStock = onSnapshot(collection(db, 'stock'), snap => {
          const items = []
          snap.forEach(d => items.push(d.data()))
          items.sort((a, b) => a.id - b.id)
          nextS.current = Math.max(...items.map(s => s.id), 39) + 1
          setStock(items)
        })

        unsubPedidos = onSnapshot(collection(db, 'pedidos'), snap => {
          const items = []
          snap.forEach(d => items.push(d.data()))
          items.sort((a, b) => b.id - a.id)
          nextP.current = Math.max(...items.map(p => p.id), 0) + 1
          setPedidos(items)
        })

        setDbStatus('ok')
      } catch (e) {
        console.warn('Firebase error:', e.message)
        setStock(STOCK_INICIAL.map(s => ({ ...s })))
        setPedidos([])
        setDbStatus('local')
      }
    }

    init()
    return () => {
      unsubStock?.()
      unsubPedidos?.()
    }
  }, [])

  // ── Stock actions ──────────────────────────────────────────
  async function updateQty(id, qty) {
    setStock(prev => prev.map(s => s.id === id ? { ...s, qty } : s))
    if (dbStatus === 'ok') {
      await updateDoc(doc(db, 'stock', String(id)), { qty })
    }
  }

  async function addInsumo(item) {
    const newItem = { ...item, id: nextS.current++ }
    setStock(prev => [...prev, newItem].sort((a, b) => a.id - b.id))
    if (dbStatus === 'ok') {
      await setDoc(doc(db, 'stock', String(newItem.id)), newItem)
    }
  }

  // ── Pedido actions ─────────────────────────────────────────
  async function addPedido(pedido) {
    const newP = { ...pedido, id: nextP.current++, estado: 'Pendiente', creado: hoy() }
    setPedidos(prev => [newP, ...prev])
    if (dbStatus === 'ok') {
      await setDoc(doc(db, 'pedidos', String(newP.id)), newP)
    }
  }

  async function updatePedidoEstado(id, estado) {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
    if (dbStatus === 'ok') {
      await updateDoc(doc(db, 'pedidos', String(id)), { estado })
    }
  }

  async function deletePedido(id) {
    setPedidos(prev => prev.filter(p => p.id !== id))
    if (dbStatus === 'ok') {
      await deleteDoc(doc(db, 'pedidos', String(id)))
    }
  }

  return {
    stock, pedidos, dbStatus,
    updateQty, addInsumo,
    addPedido, updatePedidoEstado, deletePedido,
  }
}
