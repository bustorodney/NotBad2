import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (!ok) setError('Usuario o contraseña incorrectos.');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A3A6B] via-[#1e4a8a] to-[#0f2547] p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F5C518] opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#F5C518] opacity-5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A3A6B] to-[#1e4a8a] px-8 py-10 flex flex-col items-center">
            {/* Logo */}
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <svg viewBox="0 0 80 80" className="w-14 h-14" fill="none">
                <rect width="80" height="80" rx="16" fill="#1A3A6B"/>
                <text x="8" y="52" fontSize="36" fontWeight="800" fill="#F5C518" fontFamily="Arial, sans-serif">C</text>
                <text x="32" y="52" fontSize="36" fontWeight="800" fill="white" fontFamily="Arial, sans-serif">P</text>
                <circle cx="62" cy="22" r="8" fill="#F5C518"/>
                <text x="58" y="27" fontSize="10" fontWeight="800" fill="#1A3A6B" fontFamily="Arial, sans-serif">py</text>
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white tracking-wide">ContaPY</h1>
            <p className="text-blue-200 text-sm mt-1 tracking-widest uppercase font-medium">Sistema Web Contable</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-xl font-bold text-[#1A3A6B] mb-6 text-center">Iniciar Sesión</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <span className="text-red-500">⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin / contador / viewer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1A3A6B] focus:outline-none transition-colors text-gray-800 placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Cualquier contraseña (demo)"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#1A3A6B] focus:outline-none transition-colors text-gray-800 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#1A3A6B] to-[#1e4a8a] hover:from-[#F5C518] hover:to-[#e6b800] hover:text-[#1A3A6B] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn size={18} />
                )}
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs font-bold text-[#1A3A6B] mb-2 uppercase tracking-wide">Usuarios demo:</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-600"><span className="font-semibold text-[#1A3A6B]">admin</span> — Acceso completo (Informes visibles)</p>
                <p className="text-xs text-gray-600"><span className="font-semibold text-[#1A3A6B]">contador</span> — Acceso contador (sin Informes)</p>
                <p className="text-xs text-gray-600"><span className="font-semibold text-[#1A3A6B]">viewer</span> — Solo lectura</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          © 2025 ContaPY — Sistema Web Contable Paraguay
        </p>
      </div>
    </div>
  );
}
