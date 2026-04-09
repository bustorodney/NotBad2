import * as XLSX from 'xlsx';
import type { LibroEntry, LibroMayor } from '../types';

function fmt(n: number) {
  return n.toLocaleString('es-PY');
}

// ─── EXCEL ────────────────────────────────────────────────────────────────────

export function exportDiarioExcel(entries: LibroEntry[], periodo: string) {
  const rows = entries.map(e => ({
    'Fecha': e.fecha,
    'Comprobante': e.comprobante,
    'Cuenta': e.cuenta,
    'Descripción': e.descripcion,
    'Debe (₲)': e.debe,
    'Haber (₲)': e.haber,
    'Saldo (₲)': e.saldo,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 40 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Libro Diario');
  XLSX.writeFile(wb, `Libro_Diario_${periodo}.xlsx`);
}

export function exportMayorExcel(cuentas: LibroMayor[], periodo: string) {
  const wb = XLSX.utils.book_new();

  cuentas.forEach(cuenta => {
    const rows = cuenta.entries.map(e => ({
      'Fecha': e.fecha,
      'Comprobante': e.comprobante,
      'Descripción': e.descripcion,
      'Debe (₲)': e.debe,
      'Haber (₲)': e.haber,
      'Saldo (₲)': e.saldo,
    }));
    rows.push({
      'Fecha': '',
      'Comprobante': '',
      'Descripción': 'TOTALES',
      'Debe (₲)': cuenta.totalDebe,
      'Haber (₲)': cuenta.totalHaber,
      'Saldo (₲)': cuenta.saldoFinal,
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 40 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
    const sheetName = cuenta.cuenta.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, `Libro_Mayor_${periodo}.xlsx`);
}

// ─── PDF (HTML→Print based) ───────────────────────────────────────────────────

function buildHtmlTable(
  title: string,
  periodo: string,
  headers: string[],
  rows: (string | number)[][],
  totals?: (string | number)[]
): string {
  const headerHtml = headers.map(h => `<th>${h}</th>`).join('');
  const rowsHtml = rows.map(r =>
    `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`
  ).join('');
  const totalHtml = totals
    ? `<tr class="totals">${totals.map(c => `<td><strong>${c}</strong></td>`).join('')}</tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${title} — ${periodo}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #222; padding: 20px; }
  .header { background: #1A3A6B; color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
  .header h1 { font-size: 18px; color: #F5C518; }
  .header p { font-size: 11px; color: #c0d4f5; margin-top: 4px; }
  .meta { font-size: 10px; color: #c0d4f5; text-align: right; }
  h2 { color: #1A3A6B; font-size: 14px; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #1A3A6B; color: white; padding: 7px 8px; text-align: left; font-size: 10px; text-transform: uppercase; }
  td { padding: 6px 8px; border-bottom: 1px solid #eee; }
  tr:nth-child(even) { background: #f5f9ff; }
  .totals td { background: #F5C518; font-weight: bold; color: #1A3A6B; border-top: 2px solid #1A3A6B; }
  @media print { body { padding: 10px; } .no-print { display: none; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>ContaPY</h1>
    <p>Sistema Web Contable Paraguay</p>
    <p style="margin-top:6px;font-size:13px;color:white;font-weight:bold">${title}</p>
    <p>Período: ${periodo}</p>
  </div>
  <div class="meta">
    <p>Generado:</p>
    <p>${new Date().toLocaleDateString('es-PY')}</p>
    <p>${new Date().toLocaleTimeString('es-PY')}</p>
  </div>
</div>
<table>
  <thead><tr>${headerHtml}</tr></thead>
  <tbody>${rowsHtml}${totalHtml}</tbody>
</table>
<script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;
}

export function exportDiarioPDF(entries: LibroEntry[], periodo: string) {
  const headers = ['Fecha', 'Comprobante', 'Cuenta', 'Descripción', 'Debe (₲)', 'Haber (₲)', 'Saldo (₲)'];
  const rows = entries.map(e => [e.fecha, e.comprobante, e.cuenta, e.descripcion, fmt(e.debe), fmt(e.haber), fmt(e.saldo)]);
  const totals = [
    '', '', '', 'TOTALES',
    fmt(entries.reduce((s, e) => s + e.debe, 0)),
    fmt(entries.reduce((s, e) => s + e.haber, 0)),
    ''
  ];

  const html = buildHtmlTable('LIBRO DIARIO', periodo, headers, rows, totals);
  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); }
}

export function exportMayorPDF(cuentas: LibroMayor[], periodo: string) {
  let combined = '';
  cuentas.forEach((cuenta, i) => {
    const headers = ['Fecha', 'Comprobante', 'Descripción', 'Debe (₲)', 'Haber (₲)', 'Saldo (₲)'];
    const rows = cuenta.entries.map(e => [e.fecha, e.comprobante, e.descripcion, fmt(e.debe), fmt(e.haber), fmt(e.saldo)]);
    const totals = ['', '', 'TOTALES', fmt(cuenta.totalDebe), fmt(cuenta.totalHaber), fmt(cuenta.saldoFinal)];
    const headerHtml = headers.map(h => `<th>${h}</th>`).join('');
    const rowsHtml = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
    const totalHtml = `<tr class="totals">${totals.map(c => `<td><strong>${c}</strong></td>`).join('')}</tr>`;
    combined += `<h2 style="margin-top:${i > 0 ? '24px' : '0'};color:#1A3A6B;font-size:14px;padding:8px;background:#f0f4ff;border-radius:4px">${cuenta.cuenta} (${cuenta.codigo})</h2>
<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}${totalHtml}</tbody></table>`;
  });

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Libro Mayor — ${periodo}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #222; padding: 20px; }
  .header { background: #1A3A6B; color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; }
  .header h1 { font-size: 18px; color: #F5C518; }
  h2 { color: #1A3A6B; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
  th { background: #1A3A6B; color: white; padding: 7px 8px; text-align: left; font-size: 10px; }
  td { padding: 6px 8px; border-bottom: 1px solid #eee; }
  tr:nth-child(even) { background: #f5f9ff; }
  .totals td { background: #F5C518; font-weight: bold; color: #1A3A6B; border-top: 2px solid #1A3A6B; }
  @media print { body { padding: 10px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>ContaPY</h1>
    <p style="color:#c0d4f5">Sistema Web Contable Paraguay</p>
    <p style="margin-top:6px;font-size:13px;color:white;font-weight:bold">LIBRO MAYOR</p>
    <p style="color:#c0d4f5">Período: ${periodo}</p>
  </div>
  <div style="font-size:10px;color:#c0d4f5;text-align:right">
    <p>Generado: ${new Date().toLocaleDateString('es-PY')}</p>
  </div>
</div>
${combined}
<script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); }
}
