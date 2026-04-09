import { useState } from 'react';
import Layout from '../components/Layout';
import { mockLibroDiario, mockLibroMayor } from '../data/mockData';
import {
  exportDiarioExcel, exportMayorExcel,
  exportDiarioPDF, exportMayorPDF
} from '../utils/exports';
import { FileSpreadsheet, FileText, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

function fmt(n: number) {
  return n === 0 ? '—' : '₲ ' + n.toLocaleString('es-PY');
}

const PERIODO = 'Junio_2025';
const PERIODO_LABEL = 'Junio 2025';

function ExportButtons({ onExcel, onPDF }: { onExcel: () => void; onPDF: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onExcel}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
      >
        <FileSpreadsheet size={14} /> Excel
      </button>
      <button
        onClick={onPDF}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
      >
        <FileText size={14} /> PDF
      </button>
    </div>
  );
}

function MayorCuentaRow({ cuenta }: { cuenta: typeof mockLibroMayor[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
      {/* Account header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-colors text-left"
      >
        <div className="w-8 h-8 bg-[#1A3A6B] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-[#F5C518] text-xs font-black">{cuenta.codigo.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#1A3A6B] text-sm">{cuenta.cuenta}</p>
          <p className="text-xs text-gray-400">Código: {cuenta.codigo} · {cuenta.entries.length} movimientos</p>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm mr-4">
          <div className="text-center">
            <p className="text-xs text-gray-400">Debe</p>
            <p className="font-bold text-gray-700">{fmt(cuenta.totalDebe)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Haber</p>
            <p className="font-bold text-gray-700">{fmt(cuenta.totalHaber)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Saldo</p>
            <p className="font-black text-[#1A3A6B]">{fmt(cuenta.saldoFinal)}</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold">Fecha</th>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold">Comprobante</th>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold">Descripción</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-semibold">Debe (₲)</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-semibold">Haber (₲)</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-semibold">Saldo (₲)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cuenta.entries.map(e => (
                <tr key={e.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-2 text-gray-600">{e.fecha}</td>
                  <td className="px-4 py-2 font-mono text-xs text-gray-500">{e.comprobante}</td>
                  <td className="px-4 py-2 text-gray-700">{e.descripcion}</td>
                  <td className="px-4 py-2 text-right text-emerald-700 font-medium">{e.debe > 0 ? fmt(e.debe) : '—'}</td>
                  <td className="px-4 py-2 text-right text-red-600 font-medium">{e.haber > 0 ? fmt(e.haber) : '—'}</td>
                  <td className="px-4 py-2 text-right font-bold text-gray-800">{fmt(e.saldo)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#1A3A6B]">
              <tr>
                <td colSpan={3} className="px-4 py-2 text-[#F5C518] font-black text-xs uppercase tracking-wide">Totales</td>
                <td className="px-4 py-2 text-right text-white font-black">{fmt(cuenta.totalDebe)}</td>
                <td className="px-4 py-2 text-right text-white font-black">{fmt(cuenta.totalHaber)}</td>
                <td className="px-4 py-2 text-right text-[#F5C518] font-black">{fmt(cuenta.saldoFinal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Libros() {
  const [activeTab, setActiveTab] = useState<'diario' | 'mayor'>('diario');

  return (
    <Layout title="Libros Contables">
      {/* Tabs */}
      <div className="flex gap-2 mb-5 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {(['diario', 'mayor'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab
                ? 'bg-[#1A3A6B] text-white shadow'
                : 'text-gray-500 hover:text-[#1A3A6B]'
            }`}
          >
            <BookOpen size={16} />
            {tab === 'diario' ? 'Libro Diario' : 'Libro Mayor'}
          </button>
        ))}
      </div>

      {/* ─── LIBRO DIARIO ─── */}
      {activeTab === 'diario' && (
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-bold text-[#1A3A6B]">Libro Diario</h3>
                <p className="text-xs text-gray-400">{PERIODO_LABEL} · {mockLibroDiario.length} asientos</p>
              </div>
              <ExportButtons
                onExcel={() => exportDiarioExcel(mockLibroDiario, PERIODO)}
                onPDF={() => exportDiarioPDF(mockLibroDiario, PERIODO_LABEL)}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Fecha</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Comprobante</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Cuenta</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold hidden md:table-cell">Descripción</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold">Debe (₲)</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold">Haber (₲)</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold hidden lg:table-cell">Saldo (₲)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockLibroDiario.map(e => (
                    <tr key={e.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-2.5 text-gray-600 text-sm">{e.fecha}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{e.comprobante}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-800">{e.cuenta}</td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs hidden md:table-cell max-w-[200px] truncate">{e.descripcion}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-emerald-700">{e.debe > 0 ? fmt(e.debe) : '—'}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-red-600">{e.haber > 0 ? fmt(e.haber) : '—'}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-gray-700 hidden lg:table-cell">{fmt(e.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#1A3A6B]">
                  <tr>
                    <td colSpan={4} className="px-4 py-2.5 text-[#F5C518] font-black text-xs uppercase tracking-wide">
                      Totales del Período
                    </td>
                    <td className="px-4 py-2.5 text-right text-white font-black">
                      {fmt(mockLibroDiario.reduce((s, e) => s + e.debe, 0))}
                    </td>
                    <td className="px-4 py-2.5 text-right text-white font-black">
                      {fmt(mockLibroDiario.reduce((s, e) => s + e.haber, 0))}
                    </td>
                    <td className="hidden lg:table-cell" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── LIBRO MAYOR ─── */}
      {activeTab === 'mayor' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex-1">
              <h3 className="font-bold text-[#1A3A6B]">Libro Mayor</h3>
              <p className="text-xs text-gray-400">{PERIODO_LABEL} · {mockLibroMayor.length} cuentas</p>
            </div>
            <ExportButtons
              onExcel={() => exportMayorExcel(mockLibroMayor, PERIODO)}
              onPDF={() => exportMayorPDF(mockLibroMayor, PERIODO_LABEL)}
            />
          </div>

          {/* Summary totals */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Total Debe', value: mockLibroMayor.reduce((s, c) => s + c.totalDebe, 0), color: 'text-emerald-700', bg: 'bg-emerald-50' },
              { label: 'Total Haber', value: mockLibroMayor.reduce((s, c) => s + c.totalHaber, 0), color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Saldo Neto', value: mockLibroMayor.reduce((s, c) => s + c.saldoFinal, 0), color: 'text-[#1A3A6B]', bg: 'bg-blue-50' },
            ].map(item => (
              <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className={`font-black text-sm ${item.color}`}>{fmt(item.value)}</p>
              </div>
            ))}
          </div>

          {/* Cuenta cards */}
          {mockLibroMayor.map(cuenta => (
            <MayorCuentaRow key={cuenta.cuenta} cuenta={cuenta} />
          ))}
        </div>
      )}
    </Layout>
  );
}
