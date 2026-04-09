import { useState } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import type { AjustesContador } from '../types';
import {
  Settings, Building2, User, Globe, Shield,
  Save, Upload, CheckCircle, Camera
} from 'lucide-react';

const TABS = [
  { id: 'estudio', label: 'Datos del Estudio', icon: Building2 },
  { id: 'contador', label: 'Datos del Contador', icon: User },
  { id: 'sistema', label: 'Sistema', icon: Globe },
  { id: 'timbrado', label: 'Timbrado', icon: Shield },
];

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4 pb-3 border-b border-gray-100">
      <h3 className="font-bold text-[#1A3A6B] text-base">{title}</h3>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none transition-colors"
    />
  );
}

export default function Ajustes() {
  const { ajustes, setAjustes } = useApp();
  const [activeTab, setActiveTab] = useState('estudio');
  const [form, setForm] = useState<AjustesContador>({ ...ajustes });
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(ajustes.logo);

  const set = (key: keyof AjustesContador, value: string | boolean | null) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setAjustes(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setLogoPreview(url);
      set('logo', url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout title="Ajustes del Contador">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#1A3A6B] to-[#1e4a8a]">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-[#F5C518]" />
                <span className="text-white font-bold text-sm">Configuración</span>
              </div>
            </div>
            <nav className="p-2">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 text-left ${
                    activeTab === tab.id
                      ? 'bg-[#1A3A6B] text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#1A3A6B]'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {/* ─── DATOS DEL ESTUDIO ─── */}
            {activeTab === 'estudio' && (
              <div className="space-y-5">
                <SectionTitle title="Datos del Estudio Contable" sub="Información principal del estudio" />

                {/* Logo Upload */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 flex-shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Logo del Estudio</label>
                    <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#1A3A6B] hover:text-[#1A3A6B] transition-colors">
                      <Upload size={14} /> Subir logo
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    </label>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG (máx. 2MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Nombre del Estudio *">
                      <Input value={form.nombreEstudio} onChange={v => set('nombreEstudio', v)} placeholder="Estudio Contable..." />
                    </Field>
                  </div>
                  <Field label="RUC del Estudio *">
                    <Input value={form.ruc} onChange={v => set('ruc', v)} placeholder="0.000.000-0" />
                  </Field>
                  <Field label="Teléfono">
                    <Input value={form.telefono} onChange={v => set('telefono', v)} placeholder="021-xxx-xxx" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Dirección">
                      <Input value={form.direccion} onChange={v => set('direccion', v)} placeholder="Av. ..." />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Email">
                      <Input value={form.email} onChange={v => set('email', v)} type="email" placeholder="estudio@mail.com" />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* ─── DATOS DEL CONTADOR ─── */}
            {activeTab === 'contador' && (
              <div className="space-y-5">
                <SectionTitle title="Datos del Contador Responsable" sub="Información del profesional a cargo" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Nombre del Contador">
                      <Input value="Rodney Busto" onChange={() => {}} placeholder="Nombre completo" />
                    </Field>
                  </div>
                  <Field label="N° de Matrícula">
                    <Input value="CP-12345" onChange={() => {}} placeholder="CP-00000" />
                  </Field>
                  <Field label="Especialización">
                    <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none">
                      <option>Contabilidad General</option>
                      <option>Auditoría</option>
                      <option>Impuestos</option>
                      <option>Costos y Presupuestos</option>
                    </select>
                  </Field>
                  <Field label="Email Personal">
                    <Input value="rodney@contapy.com.py" onChange={() => {}} type="email" />
                  </Field>
                  <Field label="Teléfono Personal">
                    <Input value="0981-555-123" onChange={() => {}} placeholder="0981-xxx-xxx" />
                  </Field>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:border-[#1A3A6B] transition-colors">
                      <div
                        onClick={() => set('firmaDigital', !form.firmaDigital)}
                        className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                          form.firmaDigital ? 'bg-[#1A3A6B]' : 'bg-gray-200'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ml-0.5 ${
                          form.firmaDigital ? 'translate-x-5' : ''
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Firma Digital Habilitada</p>
                        <p className="text-xs text-gray-400">Permite firmar documentos digitalmente</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SISTEMA ─── */}
            {activeTab === 'sistema' && (
              <div className="space-y-5">
                <SectionTitle title="Configuración del Sistema" sub="Preferencias regionales y de visualización" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="País">
                    <select
                      value={form.pais}
                      onChange={e => set('pais', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none"
                    >
                      <option value="Paraguay">Paraguay 🇵🇾</option>
                      <option value="Argentina">Argentina 🇦🇷</option>
                      <option value="Brasil">Brasil 🇧🇷</option>
                      <option value="Uruguay">Uruguay 🇺🇾</option>
                    </select>
                  </Field>
                  <Field label="Moneda Principal">
                    <select
                      value={form.moneda}
                      onChange={e => set('moneda', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none"
                    >
                      <option value="PYG">Guaraní (PYG) ₲</option>
                      <option value="USD">Dólar (USD) $</option>
                      <option value="BRL">Real (BRL) R$</option>
                      <option value="ARS">Peso Arg. (ARS) $</option>
                    </select>
                  </Field>
                  <Field label="Zona Horaria">
                    <select
                      value={form.zonaHoraria}
                      onChange={e => set('zonaHoraria', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none"
                    >
                      <option value="America/Asuncion">America/Asuncion (PY)</option>
                      <option value="America/Buenos_Aires">America/Buenos_Aires (AR)</option>
                      <option value="America/Sao_Paulo">America/Sao_Paulo (BR)</option>
                    </select>
                  </Field>
                  <Field label="Formato de Fecha">
                    <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none">
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                      <option>MM/DD/YYYY</option>
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Decimales en Montos">
                      <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#1A3A6B] focus:outline-none">
                        <option>0 decimales (₲ 1.000)</option>
                        <option>2 decimales (₲ 1.000,00)</option>
                      </select>
                    </Field>
                  </div>
                </div>

                {/* Info box */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-sm font-bold text-[#1A3A6B] mb-1">🇵🇾 Paraguay — SET (Subsecretaría de Estado de Tributación)</p>
                  <p className="text-xs text-blue-700">El sistema ContaPY está configurado por defecto para operar bajo la normativa tributaria de Paraguay (Ley 6380/2019 — IRE, IVA, IRP, IMAGRO).</p>
                </div>
              </div>
            )}

            {/* ─── TIMBRADO ─── */}
            {activeTab === 'timbrado' && (
              <div className="space-y-5">
                <SectionTitle title="Configuración de Timbrado" sub="Datos del timbrado SIFEN — Paraguay" />

                <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-[#1A3A6B] bg-blue-50 rounded-2xl">
                  <div
                    onClick={() => set('timbradoActivo', !form.timbradoActivo)}
                    className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                      form.timbradoActivo ? 'bg-[#1A3A6B]' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ml-0.5 ${
                      form.timbradoActivo ? 'translate-x-5' : ''
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A3A6B]">Timbrado Activo</p>
                    <p className="text-xs text-blue-600">Habilita la emisión de facturas con timbrado válido</p>
                  </div>
                </label>

                {form.timbradoActivo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <Field label="Número de Timbrado">
                      <Input
                        value={form.numeroTimbrado}
                        onChange={v => set('numeroTimbrado', v)}
                        placeholder="12345678"
                      />
                    </Field>
                    <Field label="Fecha de Vencimiento">
                      <Input
                        value={form.vencimientoTimbrado}
                        onChange={v => set('vencimientoTimbrado', v)}
                        type="date"
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Establecimiento">
                        <Input value="001" onChange={() => {}} placeholder="001" />
                      </Field>
                    </div>
                    <Field label="Punto de Expedición">
                      <Input value="001" onChange={() => {}} placeholder="001" />
                    </Field>
                    <Field label="Desde N°">
                      <Input value="0000001" onChange={() => {}} placeholder="0000001" />
                    </Field>

                    {/* Status badge */}
                    <div className="sm:col-span-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-emerald-700">Timbrado Válido</p>
                        <p className="text-xs text-emerald-600">Vence el {form.vencimientoTimbrado} · N° {form.numeroTimbrado}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!form.timbradoActivo && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                    <p className="text-gray-500 text-sm">El timbrado está desactivado. Active el interruptor para configurarlo.</p>
                  </div>
                )}
              </div>
            )}

            {/* Save button */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-end gap-3">
              {saved && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                  <CheckCircle size={16} />
                  ¡Cambios guardados!
                </div>
              )}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1A3A6B] text-white rounded-xl hover:bg-[#F5C518] hover:text-[#1A3A6B] transition-all font-bold text-sm shadow"
              >
                <Save size={16} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
