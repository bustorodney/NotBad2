import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}
      >
        <Navbar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <footer className="px-6 py-3 border-t border-gray-200 bg-white text-center text-xs text-gray-400">
          © 2025 ContaPY — Sistema Web Contable Paraguay · v2.0
        </footer>
      </div>
    </div>
  );
}
