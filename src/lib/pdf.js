import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CATS, stInfo, fd, hoy } from './data'

export function exportarPDF(stock, pedidos) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const M = 14
  let y = M

  const bajo  = stock.filter(s => s.qty <= s.min)
  const pend  = pedidos.filter(p => p.estado === 'Pendiente')
  const apro  = pedidos.filter(p => p.estado === 'Aprobado').length
  const crit  = pedidos.filter(p => p.urgencia === 'critica' && p.estado === 'Pendiente').length
  const fecha = fd(hoy())

  // ── Header ──────────────────────────────────────────────────
  doc.setFillColor(17, 17, 17)
  doc.roundedRect(M, y, W - M * 2, 22, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('REPORTE DE INSUMOS — GRUPO SAGUEL', M + 6, y + 9)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text(`Styropek · General Lagos · ${fecha}`, M + 6, y + 17)
  y += 30

  // ── KPIs ────────────────────────────────────────────────────
  const kpis = [
    { n: bajo.length, l: 'Stock bajo',      red: bajo.length > 0 },
    { n: pend.length, l: 'Pedidos pend.',   red: pend.length > 0 },
    { n: apro,        l: 'Aprobados',       red: false },
    { n: crit,        l: 'Criticos',        red: crit > 0 },
  ]
  const bw = (W - M * 2 - 9) / 4
  kpis.forEach((k, i) => {
    const bx = M + i * (bw + 3)
    doc.setDrawColor(232, 230, 224)
    doc.setFillColor(245, 244, 240)
    doc.roundedRect(bx, y, bw, 18, 2, 2, 'FD')
    doc.setTextColor(k.red && k.n > 0 ? 208 : 17, k.red && k.n > 0 ? 48 : 17, k.red && k.n > 0 ? 48 : 17)
    doc.setFontSize(19)
    doc.setFont('helvetica', 'bold')
    doc.text(String(k.n), bx + bw / 2, y + 11, { align: 'center' })
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(153, 153, 153)
    doc.text(k.l.toUpperCase(), bx + bw / 2, y + 16, { align: 'center' })
  })
  y += 26

  // ── Alert lines ─────────────────────────────────────────────
  if (crit) {
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(208, 48, 48)
    doc.text(`! ${crit} pedido(s) critico(s) sin resolver`, M, y); y += 6
  }
  if (bajo.length) {
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(184, 112, 0)
    doc.text(`! ${bajo.length} insumo(s) por debajo del minimo`, M, y); y += 8
  } else { y += 2 }
  doc.setTextColor(17, 17, 17)

  // ── Tabla insumos bajos ──────────────────────────────────────
  if (bajo.length) {
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(153, 153, 153)
    doc.text('INSUMOS A REPONER', M, y); y += 4
    autoTable(doc, {
      startY: y, margin: { left: M, right: M },
      head: [['Insumo', 'Categoria', 'Hay', 'Minimo', 'Falta']],
      body: bajo.map(s => [
        s.nom, CATS[s.cat]?.n ?? s.cat,
        `${s.qty} ${s.uni}`, s.min,
        `${Math.max(0, s.min - s.qty)} ${s.uni}`,
      ]),
      styles: { fontSize: 8.5, cellPadding: 2.8 },
      headStyles: { fillColor: [245, 244, 240], textColor: [153, 153, 153], fontStyle: 'bold', fontSize: 7 },
      alternateRowStyles: { fillColor: [252, 252, 252] },
      columnStyles: { 2: { textColor: [208, 48, 48], fontStyle: 'bold' }, 4: { fontStyle: 'bold' } },
    })
    y = doc.lastAutoTable.finalY + 8
  }

  // ── Tabla pedidos pendientes ─────────────────────────────────
  if (pend.length) {
    if (y > 230) { doc.addPage(); y = M }
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(153, 153, 153)
    doc.text('PEDIDOS PENDIENTES', M, y); y += 4
    const urgTxt = { normal: 'Normal', alta: 'Alta', critica: 'CRITICA' }
    autoTable(doc, {
      startY: y, margin: { left: M, right: M },
      head: [['Insumo', 'Cantidad', 'Urgencia', 'Para']],
      body: pend.map(p => [
        p.insumo + (p.obs ? ` — ${p.obs}` : ''),
        `${p.cantidad} ${p.unidad}`,
        urgTxt[p.urgencia] ?? p.urgencia,
        fd(p.fechaNec),
      ]),
      styles: { fontSize: 8.5, cellPadding: 2.8 },
      headStyles: { fillColor: [245, 244, 240], textColor: [153, 153, 153], fontStyle: 'bold', fontSize: 7 },
      alternateRowStyles: { fillColor: [252, 252, 252] },
      didParseCell: d => {
        if (d.section === 'body' && d.column.index === 2 && d.cell.raw === 'CRITICA')
          d.cell.styles.textColor = [208, 48, 48]
      },
    })
    y = doc.lastAutoTable.finalY + 8
  }

  // ── Stock completo ───────────────────────────────────────────
  if (y > 210) { doc.addPage(); y = M }
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(153, 153, 153)
  doc.text('STOCK COMPLETO', M, y); y += 4
  autoTable(doc, {
    startY: y, margin: { left: M, right: M },
    head: [['Insumo', 'Categoria', 'Cantidad', 'Minimo', 'Estado']],
    body: stock.map(s => {
      const si = stInfo(s)
      return [s.nom, CATS[s.cat]?.n ?? s.cat, `${s.qty} ${s.uni}`, s.min, si.txt]
    }),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [245, 244, 240], textColor: [153, 153, 153], fontStyle: 'bold', fontSize: 7 },
    alternateRowStyles: { fillColor: [252, 252, 252] },
    didParseCell: d => {
      if (d.section === 'body' && d.column.index === 4) {
        const v = d.cell.raw
        if (v === 'Sin stock' || v === 'Bajo minimo') d.cell.styles.textColor = [208, 48, 48]
        else if (v === 'Poco') d.cell.styles.textColor = [184, 112, 0]
        else d.cell.styles.textColor = [26, 110, 53]
      }
    },
  })

  // ── Footer ──────────────────────────────────────────────────
  const pages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFontSize(7.5); doc.setTextColor(200, 200, 200); doc.setFont('helvetica', 'normal')
    doc.text(`Grupo SAGUEL · Styropek · ${fecha}`, M, 292)
    doc.text(`${i}/${pages}`, W - M, 292, { align: 'right' })
  }

  doc.save(`reporte-saguel-${hoy()}.pdf`)
}
