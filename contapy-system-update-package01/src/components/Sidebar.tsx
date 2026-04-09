import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, BookOpen, Calculator,
  Settings, Users, BarChart3, Menu, X, LogOut, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { to: '/clientes', label: 'Clientes', icon: Users, adminOnly: false },
  { to: '/facturas', label: 'Facturas', icon: FileText, adminOnly: false },
  { to: '/libros', label: 'Libros Contables', icon: BookOpen, adminOnly: false },
  { to: '/impuestos', label: 'Impuestos', icon: Calculator, adminOnly: false },
  { to: '/informes', label: 'Informes', icon: BarChart3, adminOnly: true },
  { to: '/ajustes', label: 'Ajustes', icon: Settings, adminOnly: false },
];

export default function Sidebar() {
  const { user, logout, sidebarOpen, setSidebarOpen, ajustes } = useApp();
  const isAdmin = user?.isSuperuser || user?.role === 'Admin';

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen z-30 flex flex-col bg-gradient-to-b from-[#1A3A6B] to-[#0f2547] text-white shadow-2xl transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16 overflow-hidden'
        }`}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 min-h-[72px]">
          <div className="w-9 h-9 bg-[#F5C518] rounded-xl flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
              <rect width="36" height="36" rx="8" fill="#1A3A6B"/>
              <text x="2" y="26" fontSize="18" fontWeight="800" fill="#F5C518" fontFamily="Arial, sans-serif">C</text>
              <text x="16" y="26" fontSize="18" fontWeight="800" fill="white" fontFamily="Arial, sans-serif">P</text>
            </svg>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-black tracking-wide text-white whitespace-nowrap">ContaPY</h1>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest whitespace-nowrap">Sistema Contable</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-white/60 hover:text-white transition-colors flex-shrink-0 lg:block hidden"
          >
            {sidebarOpen ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-white/60 hover:text-white transition-colors flex-shrink-0 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Study name */}
        {sidebarOpen && (
          <div className="px-4 py-3 bg-white/5 border-b border-white/10">
            <p className="text-[10px] text-blue-300 uppercase tracking-widest mb-0.5">Estudio</p>
            <p className="text-xs text-white/80 font-medium leading-tight truncate">{ajustes.nombreEstudio}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          <div className="space-y-1 px-2">
            {visibleItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-[#F5C518] text-[#1A3A6B] font-bold shadow-lg'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} className={`flex-shrink-0 ${isActive ? 'text-[#1A3A6B]' : ''}`} />
                    {sidebarOpen && (
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    )}
                    {item.adminOnly && sidebarOpen && (
                      <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#1A3A6B] text-[#F5C518]' : 'bg-[#F5C518]/20 text-[#F5C518]'
                      }`}>
                        Admin
                      </span>
                    )}
                    {/* Tooltip when collapsed */}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A3A6B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg border border-white/10">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User / Logout */}
        <div className="border-t border-white/10 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#F5C518] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-[#1A3A6B] font-black text-sm uppercase">
                  {user?.username?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                <p className="text-[10px] text-blue-300 truncate">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="text-blue-300 hover:text-red-400 transition-colors flex-shrink-0"
                title="Cerrar sesión"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full flex justify-center text-blue-300 hover:text-red-400 transition-colors py-2"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
