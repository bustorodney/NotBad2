import { useState } from 'react';
import Layout from '../components/Layout';
import { mockImpuestos } from '../data/mockData';
import type { Impuesto } from '../types';
import { Calculator, CheckCircle, XCircle, Info, Plus, X } from 'lucide-react';

function fmt(n: number) {
  return '₲ ' + n.toLocaleString('es-PY');
}

const tipoConfig: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  IVA: { label: 'IVA', color: 'text-blue-700', bg: 'bg-blue-100', desc: 'Impuesto al Valor Agregado' },
  IRP: { label: 'IRP', color: 'text-purple-700', bg: 'bg-purple-100', desc: 'Impuesto a la Renta Personal' },
  IRE: { label: 'IRE', color: 'text-[#1A3A6B]', bg: 'bg-blue-50', desc: 'Impuesto a la Renta Empresarial — Régimen General' },
  IRE_SIMPLE: { label: 'IRE Simple', color: 'text-emerald-700', bg: 'bg-emerald-100', desc: 'IRE Régimen Simplificado' },
  IRE_RESIMPLE: { label: 'IRE ReSimple', color: 'text-teal-700', bg: 'bg-teal-100', desc: 'IRE Régimen ReSimple — Microempresas' },
  ISC: { label: 'ISC', color: 'text-orange-700', bg: 'bg-orange-100', desc: 'Impuesto Selectivo al Consumo' },
  IMAGRO: { label: 'IMAGRO', color: 'text-lime-700', bg: 'bg-lime-100', desc: 'Impuesto a Rentas Agropecuarias' },
};

function ImpuestoCard({ imp }: { imp: Impuesto }) {
  const cfg = tipoConfig[imp.tipo] ?? { label: imp.tipo, color: 'text-gray-700', bg: 'bg-gray-100', desc: '' };

  const isIreSimple = imp.tipo === 'IRE_SIMPLE';
  const isIreResimple = imp.tipo === 'IRE_RESIMPLE';
  const highlighted = isIreSimple || isIreResimple;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
      highlighted ? 'border-[#F5C518] ring-1 ring-[#F5C518]/30' : 'border-gray-100'
    }`}>
      {highlighted && (
        <div className="bg-gradient-to-r from-[#F5C518] to-[#e6b800] px-4 py-1.5 flex items-center gap-2">
          <span className="text-[#1A3A6B] text-[11px] font-black uppercase tracking-wide">
            {isIreResimple ? '⭐ IRE ReSimple — Microempresas Paraguay' : '⭐ IRE Simple — Régimen Simplificado Paraguay'}
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                {cfg.label}
              </span>
              {imp.vigente ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <CheckCircle size={12} /> Vigente
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                  <XCircle size={12} /> Inactivo
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 mt-2 text-base leading-snug">{imp.nombre}</h3>
            <p className="text-xs text-gray-500 mt-1">{imp.descripcion}</p>
          </div>
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#1A3A6B] to-[#1e4a8a] rounded-xl flex flex-col items-center justify-center">
            <span className="text-[#F5C518] text-xl font-black leading-none">{imp.tasa}%</span>
            <span className="text-blue-300 text-[9px] mt-0.5">tasa</span>
          </div>
        </div>

        {/* IRE Simple / ReSimple info box */}
        {(isIreSimple || isIreResimple) && (
          <div className={`rounded-xl p-3 mb-3 ${isIreResimple ? 'bg-teal-50 border border-teal-100' : 'bg-emerald-50 border border-emerald-100'}`}>
            <div className="flex gap-2">
              <Info size={14} className={isIreResimple ? 'text-teal-600 flex-shrink-0 mt-0.5' : 'text-emerald-600 flex-shrink-0 mt-0.5'} />
              <div className="text-xs space-y-1">
                {isIreSimple && (
                  <>
                    <p className="font-semibold text-emerald-800">IRE Régimen Simplificado — Paraguay</p>
                    <p className="text-emerald-700">Para empresas con ingresos brutos anuales hasta <strong>₲ 2.000.000.000</strong> (≈ USD 270.000).</p>
                    <p className="text-emerald-700">Tasa: <strong>10%</strong> sobre renta neta. Declaración anual simplificada. Art. 25 Ley 6380/2019.</p>
                  </>
                )}
                {isIreResimple && (
                  <>
                    <p className="font-semibold text-teal-800">IRE Régimen ReSimple — Paraguay</p>
                    <p className="text-teal-700">Para microempresas con ingresos brutos anuales hasta <strong>₲ 80.000.000</strong> (≈ USD 11.000).</p>
                    <p className="text-teal-700">Tasa: <strong>3%</strong> sobre ingresos brutos. Régimen de cuota fija trimestral. Art. 26 Ley 6380/2019.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {imp.vigente && imp.base > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-0.5">Base Imponible</p>
              <p className="text-xs font-bold text-gray-700">{fmt(imp.base)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-0.5">Monto</p>
              <p className="text-xs font-black text-[#1A3A6B]">{fmt(imp.monto)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-0.5">Período</p>
              <p className="text-xs font-semibold text-gray-600">{imp.periodo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NewImpuestoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1A3A6B] text-lg">Nuevo Impuesto</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
            <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" placeholder="Ej: IVA 10%" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none">
                <option value="IVA">IVA</option>
                <option value="IRP">IRP</option>
                <option value="IRE">IRE General</option>
                <option value="IRE_SIMPLE">IRE Simple</option>
                <option value="IRE_RESIMPLE">IRE ReSimple</option>
                <option value="ISC">ISC</option>
                <option value="IMAGRO">IMAGRO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tasa (%)</label>
              <input type="number" min="0" max="100" step="0.5" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" placeholder="10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción</label>
            <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Base Imponible (₲)</label>
            <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#1A3A6B] focus:outline-none" placeholder="0" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">Cancelar</button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-[#1A3A6B] text-white rounded-xl hover:bg-[#F5C518] hover:text-[#1A3A6B] transition-all text-sm font-bold">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Impuestos() {
  const [filter, setFilter] = useState<string>('');
  const [showNew, setShowNew] = useState(false);

  const tipos = ['', 'IVA', 'IRP', 'IRE', 'IRE_SIMPLE', 'IRE_RESIMPLE', 'ISC', 'IMAGRO'];

  const filtered = filter ? mockImpuestos.filter(i => i.tipo === filter) : mockImpuestos;

  const totalMonto = filtered.reduce((s, i) => s + i.monto, 0);

  return (
    <Layout title="Impuestos">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex-1 flex gap-2 flex-wrap">
          {tipos.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === t
                  ? 'bg-[#1A3A6B] text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1A3A6B] hover:text-[#1A3A6B]'
              }`}
            >
              {t === '' ? 'Todos' : tipoConfig[t]?.label ?? t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3A6B] text-white rounded-xl hover:bg-[#F5C518] hover:text-[#1A3A6B] transition-all font-semibold text-sm shadow flex-shrink-0"
        >
          <Plus size={16} /> Nuevo Impuesto
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <Calculator size={18} className="mx-auto text-[#1A3A6B] mb-1" />
          <p className="text-2xl font-black text-[#1A3A6B]">{filtered.length}</p>
          <p className="text-xs text-gray-400">Impuestos</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <CheckCircle size={18} className="mx-auto text-emerald-500 mb-1" />
          <p className="text-2xl font-black text-emerald-600">{filtered.filter(i => i.vigente).length}</p>
          <p className="text-xs text-gray-400">Vigentes</p>
        </div>
        <div className="col-span-2 bg-[#1A3A6B] rounded-xl p-3 shadow-sm text-center">
          <p className="text-xs text-blue-300 mb-1">Total en Impuestos</p>
          <p className="text-lg font-black text-[#F5C518]">{fmt(totalMonto)}</p>
          <p className="text-[10px] text-blue-300 mt-0.5">período activo</p>
        </div>
      </div>

      {/* Grid of tax cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(imp => (
          <ImpuestoCard key={imp.id} imp={imp} />
        ))}
      </div>

      {showNew && <NewImpuestoModal onClose={() => setShowNew(false)} />}
    </Layout>
  );
}
