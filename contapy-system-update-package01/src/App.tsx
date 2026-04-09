import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Facturas from './pages/Facturas';
import Clientes from './pages/Clientes';
import Libros from './pages/Libros';
import Impuestos from './pages/Impuestos';
import Informes from './pages/Informes';
import Ajustes from './pages/Ajustes';

function ProtectedRoutes() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/facturas" element={<Facturas />} />
      <Route path="/libros" element={<Libros />} />
      <Route path="/impuestos" element={<Impuestos />} />
      <Route path="/informes" element={<Informes />} />
      <Route path="/ajustes" element={<Ajustes />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function AppRouter() {
  const { user } = useApp();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </BrowserRouter>
  );
}
