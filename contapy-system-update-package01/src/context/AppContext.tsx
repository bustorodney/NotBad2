import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, AjustesContador } from '../types';
import { mockAjustes } from '../data/mockData';

interface AppContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  ajustes: AjustesContador;
  setAjustes: (a: AjustesContador) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEMO_USERS: User[] = [
  { id: 1, username: 'admin', email: 'admin@contapy.com.py', role: 'Admin', isSuperuser: true },
  { id: 2, username: 'contador', email: 'contador@contapy.com.py', role: 'Contador', isSuperuser: false },
  { id: 3, username: 'viewer', email: 'viewer@contapy.com.py', role: 'Viewer', isSuperuser: false },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ajustes, setAjustes] = useState<AjustesContador>(mockAjustes);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = (username: string, _password: string): boolean => {
    const found = DEMO_USERS.find(u => u.username === username);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AppContext.Provider value={{ user, login, logout, ajustes, setAjustes, sidebarOpen, setSidebarOpen }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
