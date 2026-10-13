import jsPDF from 'jspdf';
import type { Prestamo } from '../types';
import { fmtFecha } from './format';
export function generarComprobantePDF(p: Prestamo): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const M = 44;
  doc.setFillColor(11, 31, 58); doc.rect(0, 0, W, 94, 'F');
  doc.setFillColor(37, 99, 235); doc.rect(0, 94, W, 5, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
  doc.text('BIBLIOTECA CENTRAL', M, 46);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor(184, 203, 230);
  doc.text('Universidad  |  Sistema de Gestion de Prestamos', M, 68);
  doc.setTextColor(11, 31, 58); doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
  doc.text('COMPROBANTE DIGITAL DE PRESTAMO', W / 2, 142, { align: 'center' });
  doc.setDrawColor(210, 220, 235); doc.line(M, 156, W - M, 156);
  doc.setFillColor(240, 245, 252); doc.setDrawColor(206, 219, 240);
  doc.roundedRect(M, 174, W - M * 2, 56, 8, 8, 'FD');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text('CODIGO UNICO DE PRESTAMO', M + 16, 196);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(17); doc.setTextColor(37, 99, 235);
  doc.text(p.id, M + 16, 218);
  const filas: Array<[string, string]> = [
    ['Usuario', p.usuarioNombre], ['Codigo universitario', p.usuarioCodigo],
    ['Libro prestado', p.libroTitulo], ['Autor', p.libroAutor], ['ISBN', p.libroIsbn],
    ['Fecha de prestamo', fmtFecha(p.fechaPrestamo)],
    ['Fecha limite de devolucion', fmtFecha(p.fechaLimite)],
    ['Dias de prestamo', `${p.dias} dias`], ['Estado', p.estado],
    ['Fecha de devolucion', fmtFecha(p.fechaDevolucion)]
  ];
  let y = 268; doc.setFontSize(10.5);
  filas.forEach(([label, valor], i) => {
    if (i % 2 === 0) { doc.setFillColor(249, 251, 254); doc.rect(M, y - 14, W - M * 2, 26, 'F'); }
    doc.setFont('helvetica', 'bold'); doc.setTextColor(71, 85, 105);
    doc.text(label.toUpperCase(), M + 12, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(15, 23, 42);
    doc.text(String(valor), M + 210, y);
    y += 26;
  });
  const pieY = 760;
  doc.setDrawColor(210, 220, 235); doc.line(M, pieY, W - M, pieY);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(120, 135, 155);
  doc.text('Documento generado automaticamente por el Sistema de Biblioteca.', W / 2, pieY + 20, { align: 'center' });
  doc.text(`Emitido el ${fmtFecha(new Date().toISOString())}`, W / 2, pieY + 36, { align: 'center' });
  return doc;
}
export function descargarComprobante(p: Prestamo): void {
  generarComprobantePDF(p).save(`Comprobante-${p.id}.pdf`);
}
