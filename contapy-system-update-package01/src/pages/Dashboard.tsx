import Layout from '../components/Layout';
import { mockDashboardStats, mockChartData, mockFacturas } from '../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { FileText, Users, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

function fmt(n: number) {
  return '₲ ' + n.toLocaleString('es-PY');
}

const StatCard = ({
  label, value, sub, icon: Icon, color, bg
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string; bg: string;
}) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon size={22} className={color} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const estadoStyle: Record<string, string> = {
  Pagada: 'bg-green-100 text-green-700',
  Pendiente: 'bg-yellow-100 text-yellow-700',
  Vencida: 'bg-red-100 text-red-700',
  Anulada: 'bg-gray-100 text-gray-500',
};

export default function Dashboard() {
  const s = mockDashboardStats;
  const recentFacturas = mockFacturas.slice(0, 5);

  return (
    <Layout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Ingresos del Mes"
          value={fmt(s.ingresosMes)}
          sub="Junio 2025"
          icon={TrendingUp}
          color="text-[#1A3A6B]"
          bg="bg-blue-100"
        />
        <StatCard
          label="Total Facturas"
          value={String(s.totalFacturas)}
          sub={`${s.facturasPendientes} pendientes`}
          icon={FileText}
          color="text-[#F5C518]"
          bg="bg-yellow-50"
        />
        <StatCard
          label="Clientes Activos"
          value={String(s.clientesActivos)}
          sub={`de ${s.totalClientes} registrados`}
          icon={Users}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          label="Impuestos del Mes"
          value={fmt(s.impuestosMes)}
          sub="IVA + IRE + otros"
          icon={AlertCircle}
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Area chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Ingresos vs Gastos</h3>
              <p className="text-xs text-gray-400">Enero — Junio 2025</p>
            </div>
            <span className="text-xs bg-blue-50 text-[#1A3A6B] px-3 py-1 rounded-full font-semibold">2025</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="ingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A3A6B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1A3A6B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5C518" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F5C518" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: unknown) => fmt(v as number)} labelStyle={{ fontWeight: 'bold' }} />
              <Legend />
              <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#1A3A6B" strokeWidth={2} fill="url(#ingGrad)" />
              <Area type="monotone" dataKey="gastos" name="Gastos" stroke="#F5C518" strokeWidth={2} fill="url(#gasGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status donut */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-1">Estado de Facturas</h3>
          <p className="text-xs text-gray-400 mb-4">Junio 2025</p>
          <div className="space-y-3">
            {[
              { label: 'Pagadas', count: 3, color: 'bg-emerald-500', pct: 30 },
              { label: 'Pendientes', count: 4, color: 'bg-yellow-400', pct: 40 },
              { label: 'Vencidas', count: 1, color: 'bg-red-500', pct: 10 },
              { label: 'Anuladas', count: 1, color: 'bg-gray-300', pct: 10 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-400">{item.count} facturas</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-emerald-50 rounded-xl">
              <CheckCircle size={18} className="text-emerald-500 mx-auto mb-1" />
              <p className="text-lg font-black text-emerald-700">3</p>
              <p className="text-[10px] text-gray-500">Cobradas</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-xl">
              <Clock size={18} className="text-yellow-500 mx-auto mb-1" />
              <p className="text-lg font-black text-yellow-700">4</p>
              <p className="text-[10px] text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart + recent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-1">Impuestos Mensuales</h3>
          <p className="text-xs text-gray-400 mb-4">Últimos 6 meses</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockChartData.map(d => ({ ...d, impuestos: Math.round(d.ingresos * 0.1) }))} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: unknown) => fmt(v as number)} />
              <Bar dataKey="impuestos" name="Impuestos" fill="#1A3A6B" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent facturas */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Últimas Facturas</h3>
              <p className="text-xs text-gray-400">Actividad reciente</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs text-gray-400 font-semibold">N°</th>
                  <th className="text-left py-2 text-xs text-gray-400 font-semibold">Cliente</th>
                  <th className="text-left py-2 text-xs text-gray-400 font-semibold">Fecha</th>
                  <th className="text-right py-2 text-xs text-gray-400 font-semibold">Total</th>
                  <th className="text-center py-2 text-xs text-gray-400 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentFacturas.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 font-mono text-xs text-gray-500">{f.numero.split('-').pop()?.padStart(3, '0')}</td>
                    <td className="py-2.5 font-medium text-gray-800 max-w-[150px] truncate">{f.clienteNombre}</td>
                    <td className="py-2.5 text-gray-500 text-xs">{f.fecha}</td>
                    <td className="py-2.5 text-right font-semibold text-gray-800">{fmt(f.total)}</td>
                    <td className="py-2.5 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${estadoStyle[f.estado]}`}>
                        {f.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
