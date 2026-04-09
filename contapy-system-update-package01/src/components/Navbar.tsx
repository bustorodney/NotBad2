import { Menu, Bell, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { user, logout, setSidebarOpen, sidebarOpen } = useApp();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-10 shadow-sm">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        <h2 className="font-bold text-[#1A3A6B] text-lg leading-none">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F5C518] rounded-full border border-white" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-[#1A3A6B] rounded-lg flex items-center justify-center">
            <span className="text-[#F5C518] font-black text-sm uppercase">{user?.username?.charAt(0)}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">{user?.username}</p>
            <p className="text-[10px] text-gray-400">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400 ml-1"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
