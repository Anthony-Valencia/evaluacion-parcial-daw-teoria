import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalogo from './pages/Catalogo';
import MisPrestamos from './pages/MisPrestamos';
import Comprobante from './pages/Comprobante';
import NotFound from './pages/NotFound';
import Categorias from './pages/admin/Categorias';
import Libros from './pages/admin/Libros';
import Usuarios from './pages/admin/Usuarios';
import Prestamos from './pages/admin/Prestamos';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/mis-prestamos" element={<MisPrestamos />} />
                <Route path="/comprobante/:id" element={<Comprobante />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute soloAdmin />}>
              <Route element={<Layout />}>
                <Route path="/admin/categorias" element={<Categorias />} />
                <Route path="/admin/libros" element={<Libros />} />
                <Route path="/admin/usuarios" element={<Usuarios />} />
                <Route path="/admin/prestamos" element={<Prestamos />} />
              </Route>
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
