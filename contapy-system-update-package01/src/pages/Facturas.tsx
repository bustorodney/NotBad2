import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { mockFacturas, mockClientes } from '../data/mockData';
import type { Factura } from '../types';
import { Plus, Search, Filter, Eye, FileText, X } from 'lucide-react';

function fmt(n: number) {
  return '₲ ' + n.toLocaleString('es-PY');
}

const estadoStyle: Record<string, string> = {
  Pagada: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Pendiente: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Vencida: 'bg-red-100 text-red-700 border border-red-200',
  Anulada: 'bg-gray-100 text-gray-500 border border-gray-200',
};

const tipoStyle: Record<string, string> = {
  Contado: 'bg-blue-50 text-[#1A3A6B]',
  Crédito: 'bg-purple-50 text-purple-700',
};

function FacturaModal({ factura, onClose }: { factura: Factura; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A3A6B] to-[#1e4a8a] rounded-t-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Factura {factura.numero}</h3>
            <p className="text-blue-200 text-sm">{factura.clienteNombre}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">RUC Cliente</p>
              <p className="font-semibold text-gray-800">{factura.clienteRuc}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Estado</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${estadoStyle[factura.estado]}`}>{factura.estado}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Fecha Emisión</p>
              <p className="font-semibold text-gray-800">{factura.fecha}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Vencimiento</p>
              <p className="font-semibold text-gray-800">{factura.vencimiento}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Tipo</p>
              <p className="font-semibold text-gray-800">{factura.tipo}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">{fmt(factura.subtotal)}</span>
            </div>
            {factura.iva10 > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">IVA 10%</span>
                <span className="font-semibold">{fmt(factura.iva10)}</span>
              </div>
            )}
            {factura.iva5 > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">IVA 5%</span>
                <span className="font-semibold">{fmt(factura.iva5)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-bold text-[#1A3A6B]">TOTAL</span>
              <span className="font-black text-[#1A3A6B] text-lg">{fmt(factura.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Facturas() {
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [search, setSearch] = useState('');
  const [viewFactura, setViewFactura] = useState<Factura | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    return mockFacturas.filter(f => {
      const matchCliente = !selectedCliente || f.clienteId === Number(selectedCliente);
      const matchEstado = !selectedEstado || f.estado === selectedEstado;
      const matchSearch = !search ||
        f.numero.toLowerCase().includes(search.toLowerCase()) ||
        f.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
        f.clienteRuc.includes(search);
      return matchCliente && matchEstado && matchSearch;
    });
  }, [selectedCliente, selectedEstado, search]);

  const totalFiltrado = filtered.reduce((s, f) => s + f.total, 0);

  return (
    <Layout title="Facturas">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex-1">
          <p className="text-gray-500 text-sm">{filtered.length} factura(s) · Total: <span className="font-bold text-[#1A3A6B]">{fmt(totalFiltrado)}</span></p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3A6B] text-white rounded-xl hover:bg-[#F5C518] hover:text-[#1A3A6B] transition-all font-semibold text-sm shadow"
        >
          <Plus size={16} /> Nueva Factura
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por N°, cliente, RUC..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none"
            />
          </div>

          {/* Filter by cliente */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCliente}
              onChange={e => setSelectedCliente(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none appearance-none bg-white text-gray-700"
            >
              <option value="">Todos los clientes</option>
              {mockClientes.map(c => (
                <option key={c.id} value={c.id}>{c.razonSocial}</option>
              ))}
            </select>
          </div>

          {/* Filter by estado */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedEstado}
              onChange={e => setSelectedEstado(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none appearance-none bg-white text-gray-700"
            >
              <option value="">Todos los estados</option>
              <option value="Pagada">Pagada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Vencida">Vencida</option>
              <option value="Anulada">Anulada</option>
            </select>
          </div>
        </div>

        {(selectedCliente || selectedEstado || search) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">
            <span className="text-xs text-gray-400">Filtros activos:</span>
            {selectedCliente && (
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-[#1A3A6B] px-2 py-1 rounded-full font-medium">
                {mockClientes.find(c => c.id === Number(selectedCliente))?.razonSocial}
                <button onClick={() => setSelectedCliente('')}><X size={12} /></button>
              </span>
            )}
            {selectedEstado && (
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-[#1A3A6B] px-2 py-1 rounded-full font-medium">
                {selectedEstado}
                <button onClick={() => setSelectedEstado('')}><X size={12} /></button>
              </span>
            )}
            {search && (
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-[#1A3A6B] px-2 py-1 rounded-full font-medium">
                "{search}"
                <button onClick={() => setSearch('')}><X size={12} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">N° Factura</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Cliente</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden md:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden lg:table-cell">Tipo</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Total</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Estado</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <FileText size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 font-medium">No se encontraron facturas</p>
                    <p className="text-gray-300 text-xs mt-1">Intenta cambiar los filtros</p>
                  </td>
                </tr>
              ) : (
                filtered.map(f => (
                  <tr key={f.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#1A3A6B] font-semibold">{f.numero}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 truncate max-w-[180px]">{f.clienteNombre}</p>
                      <p className="text-xs text-gray-400">{f.clienteRuc}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{f.fecha}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${tipoStyle[f.tipo]}`}>{f.tipo}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-800">{fmt(f.total)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${estadoStyle[f.estado]}`}>{f.estado}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setViewFactura(f)}
                        className="p-1.5 rounded-lg hover:bg-[#1A3A6B] hover:text-white text-gray-400 transition-colors"
                        title="Ver detalle"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals footer */}
        {filtered.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Subtotal:</span>
              <span className="font-bold text-gray-800">{fmt(filtered.reduce((s, f) => s + f.subtotal, 0))}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">IVA:</span>
              <span className="font-bold text-gray-800">{fmt(filtered.reduce((s, f) => s + f.iva10 + f.iva5, 0))}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="font-bold text-[#1A3A6B]">TOTAL:</span>
              <span className="font-black text-[#1A3A6B] text-base">{fmt(totalFiltrado)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {viewFactura && <FacturaModal factura={viewFactura} onClose={() => setViewFactura(null)} />}

      {/* New factura modal (simplified) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1A3A6B] text-lg">Nueva Factura</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Cliente</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none">
                  {mockClientes.map(c => <option key={c.id} value={c.id}>{c.razonSocial} — {c.ruc}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha</label>
                  <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" defaultValue="2025-07-01" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo</label>
                  <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none">
                    <option>Contado</option>
                    <option>Crédito</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Monto (sin IVA)</label>
                <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none resize-none" placeholder="Descripción del servicio..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">Cancelar</button>
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-[#1A3A6B] text-white rounded-xl hover:bg-[#F5C518] hover:text-[#1A3A6B] transition-all text-sm font-bold">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
