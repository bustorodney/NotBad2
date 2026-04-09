import { useState } from 'react';
import Layout from '../components/Layout';
import { mockClientes } from '../data/mockData';
import type { Cliente } from '../types';
import { Users, Plus, Search, Edit2, Phone, Mail, MapPin, X, CheckCircle, XCircle } from 'lucide-react';

function ClienteModal({ cliente, onClose }: { cliente: Cliente; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#1A3A6B] to-[#1e4a8a] rounded-t-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F5C518] rounded-xl flex items-center justify-center">
            <span className="text-[#1A3A6B] font-black text-xl">{cliente.razonSocial.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold">{cliente.razonSocial}</h3>
            <p className="text-blue-200 text-sm">RUC: {cliente.ruc}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Mail size={16} className="text-[#1A3A6B]" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800">{cliente.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Phone size={16} className="text-[#1A3A6B]" />
            <div>
              <p className="text-xs text-gray-400">Teléfono</p>
              <p className="text-sm font-medium text-gray-800">{cliente.telefono}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <MapPin size={16} className="text-[#1A3A6B]" />
            <div>
              <p className="text-xs text-gray-400">Dirección</p>
              <p className="text-sm font-medium text-gray-800">{cliente.direccion}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            {cliente.activo ? <CheckCircle size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-gray-400" />}
            <div>
              <p className="text-xs text-gray-400">Estado</p>
              <p className={`text-sm font-bold ${cliente.activo ? 'text-emerald-600' : 'text-gray-400'}`}>
                {cliente.activo ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </div>
        </div>
        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full py-2.5 bg-[#1A3A6B] text-white rounded-xl hover:bg-[#F5C518] hover:text-[#1A3A6B] transition-all font-bold text-sm">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function Clientes() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<Cliente | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = mockClientes.filter(c =>
    c.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
    c.ruc.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Clientes">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, RUC, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none"
          />
        </div>
        <div className="text-sm text-gray-500">{filtered.length} de {mockClientes.length} clientes</div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3A6B] text-white rounded-xl hover:bg-[#F5C518] hover:text-[#1A3A6B] transition-all font-semibold text-sm shadow ml-auto sm:ml-0"
        >
          <Plus size={16} /> Nuevo Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', val: mockClientes.length, icon: Users, color: 'text-[#1A3A6B]', bg: 'bg-blue-50' },
          { label: 'Activos', val: mockClientes.filter(c => c.activo).length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Inactivos', val: mockClientes.filter(c => !c.activo).length, icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-100' },
          { label: 'En búsqueda', val: filtered.length, icon: Search, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 flex items-center gap-3`}>
            <s.icon size={20} className={s.color} />
            <div>
              <p className="text-xl font-black text-gray-900">{s.val}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Cliente</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden sm:table-cell">RUC</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden lg:table-cell">Teléfono</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Estado</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Users size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 font-medium">No se encontraron clientes</p>
                  </td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#1A3A6B] to-[#1e4a8a] rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#F5C518] font-black text-xs">{c.razonSocial.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{c.razonSocial}</p>
                        <p className="text-xs text-gray-400 sm:hidden">RUC: {c.ruc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs hidden sm:table-cell">{c.ruc}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{c.email}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{c.telefono}</td>
                  <td className="px-4 py-3 text-center">
                    {c.activo ? (
                      <span className="text-[11px] px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold border border-emerald-200">Activo</span>
                    ) : (
                      <span className="text-[11px] px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-bold border border-gray-200">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setView(c)}
                      className="p-1.5 rounded-lg hover:bg-[#1A3A6B] hover:text-white text-gray-400 transition-colors"
                      title="Ver detalle"
                    >
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {view && <ClienteModal cliente={view} onClose={() => setView(null)} />}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1A3A6B] text-lg">Nuevo Cliente</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Razón Social</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" placeholder="Empresa S.A." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">RUC</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" placeholder="80000000-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" placeholder="empresa@mail.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Teléfono</label>
                <input type="tel" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" placeholder="021-xxx-xxx" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Dirección</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" placeholder="Av. ..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium">Cancelar</button>
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-[#1A3A6B] text-white rounded-xl hover:bg-[#F5C518] hover:text-[#1A3A6B] transition-all text-sm font-bold">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
