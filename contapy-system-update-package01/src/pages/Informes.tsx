import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { mockFacturas, mockImpuestos, mockChartData } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { BarChart3, Lock, TrendingUp, AlertTriangle, Download } from 'lucide-react';

function fmt(n: number) {
  return '₲ ' + n.toLocaleString('es-PY');
}

const COLORS = ['#1A3A6B', '#F5C518', '#10b981', '#ef4444', '#8b5cf6', '#f97316'];

export default function Informes() {
  const { user } = useApp();
  const isAdmin = user?.isSuperuser || user?.role === 'Admin';

  if (!isAdmin) {
    return (
      <Layout title="Informes">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Lock size={40} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Acceso Restringido</h2>
          <p className="text-gray-500 max-w-sm">
            La sección <strong>Informes</strong> está disponible únicamente para usuarios con rol <strong>Admin</strong> o superusuarios del sistema.
          </p>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-center gap-3 max-w-sm">
            <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-yellow-700">Contacta al administrador del sistema para solicitar acceso.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Revenue by month data
  const revenueData = mockChartData;

  // Factura status pie
  const statusData = [
    { name: 'Pagadas', value: mockFacturas.filter(f => f.estado === 'Pagada').length },
    { name: 'Pendientes', value: mockFacturas.filter(f => f.estado === 'Pendiente').length },
    { name: 'Vencidas', value: mockFacturas.filter(f => f.estado === 'Vencida').length },
    { name: 'Anuladas', value: mockFacturas.filter(f => f.estado === 'Anulada').length },
  ];

  // Impuestos totals
  const impByTipo = mockImpuestos
    .filter(i => i.vigente && i.monto > 0)
    .map(i => ({ name: i.tipo.replace('_', ' '), monto: i.monto }));

  const totalIngresos = mockFacturas.filter(f => f.estado === 'Pagada').reduce((s, f) => s + f.total, 0);
  const totalPendiente = mockFacturas.filter(f => f.estado === 'Pendiente').reduce((s, f) => s + f.total, 0);
  const totalImpuestos = mockImpuestos.filter(i => i.vigente).reduce((s, i) => s + i.monto, 0);

  return (
    <Layout title="Informes">
      {/* Admin badge */}
      <div className="flex items-center gap-3 mb-5 p-3 bg-[#1A3A6B] rounded-2xl">
        <div className="w-8 h-8 bg-[#F5C518] rounded-lg flex items-center justify-center">
          <BarChart3 size={18} className="text-[#1A3A6B]" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Panel de Informes — Solo Administradores</p>
          <p className="text-blue-300 text-xs">Sesión: {user?.username} ({user?.role})</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5C518] text-[#1A3A6B] rounded-lg text-xs font-bold hover:bg-yellow-300 transition-colors">
          <Download size={13} /> Exportar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Ingresos Cobrados', value: fmt(totalIngresos), sub: 'Facturas pagadas', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Por Cobrar', value: fmt(totalPendiente), sub: 'Facturas pendientes', color: 'from-[#1A3A6B] to-[#1e4a8a]' },
          { label: 'Carga Impositiva', value: fmt(totalImpuestos), sub: 'Total impuestos vigentes', color: 'from-purple-500 to-purple-700' },
        ].map(k => (
          <div key={k.label} className={`bg-gradient-to-br ${k.color} rounded-2xl p-5 text-white shadow`}>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">{k.label}</p>
            <p className="text-2xl font-black leading-tight">{k.value}</p>
            <p className="text-white/60 text-xs mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        {/* Bar chart - Revenue */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Ingresos vs Gastos Mensuales</h3>
              <p className="text-xs text-gray-400">Enero — Junio 2025</p>
            </div>
            <TrendingUp size={18} className="text-[#1A3A6B]" />
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: unknown) => fmt(v as number)} />
              <Legend />
              <Bar dataKey="ingresos" name="Ingresos" fill="#1A3A6B" radius={[4,4,0,0]} />
              <Bar dataKey="gastos" name="Gastos" fill="#F5C518" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie - Factura status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-1">Distribución de Facturas</h3>
          <p className="text-xs text-gray-400 mb-4">Por estado — Junio 2025</p>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Impuestos bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <h3 className="font-bold text-gray-800 mb-1">Carga Impositiva por Tipo</h3>
        <p className="text-xs text-gray-400 mb-4">Montos liquidados — período 2025</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={impByTipo} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#374151' }} width={100} />
            <Tooltip formatter={(v: unknown) => fmt(v as number)} />
            <Bar dataKey="monto" name="Monto" fill="#1A3A6B" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-[#1A3A6B]">Detalle de Ingresos por Cliente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Cliente</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold">Facturado</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold">Cobrado</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold">Pendiente</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold">Facturas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1,2,3,4,5,6].map(cid => {
                const facts = mockFacturas.filter(f => f.clienteId === cid);
                if (!facts.length) return null;
                const facturado = facts.reduce((s, f) => s + f.total, 0);
                const cobrado = facts.filter(f => f.estado === 'Pagada').reduce((s, f) => s + f.total, 0);
                return (
                  <tr key={cid} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{facts[0].clienteNombre}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{fmt(facturado)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-semibold">{fmt(cobrado)}</td>
                    <td className="px-4 py-3 text-right text-red-500 font-semibold">{fmt(facturado - cobrado)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-blue-50 text-[#1A3A6B] text-xs font-bold px-2 py-0.5 rounded-full">{facts.length}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
