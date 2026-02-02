// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./comoponents/Login";
import Layout from "./comoponents/Layout/Layout.jsx";   
import HomePage from "./Pages/HomePage";
import CartaPage from "./Pages/CartaPage";      
import ContactoPage from "./Pages/ContactoPage";
import CartPage from "./Pages/CartPage";

// Admin components
import AdminLayout from "./comoponents/Admin/AdminLayout";
import AdminDashboardPage from "./Pages/AdminDashboardPage";
import AdminProductosPage from "./Pages/AdminProductosPage";
import AdminReservasPage from "./Pages/AdminReservasPage";
import AdminUsuariosPage from "./Pages/AdminUsuariosPage";
import ProtectedRoute from "./comoponents/Admin/ProtectedRoute";

// UI Components
import FloatingPedidosYa from "./comoponents/Ui/FloatingPedidosYa";

export default function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas con Layout principal */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="carta" element={<CartaPage />} />
          <Route path="carrito" element={<CartPage />} />
          <Route path="contacto" element={<ContactoPage />} />
        </Route>

        {/* Rutas de admin con AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={['admin', 'cajero']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route 
            path="productos" 
            element={
              <ProtectedRoute requiredRole={['admin', 'cajero']}>
                <AdminProductosPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="reservas" 
            element={
              <ProtectedRoute requiredRole={['admin', 'cajero']}>
                <AdminReservasPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="usuarios" 
            element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminUsuariosPage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
      
      {/* Botón flotante de Pedidos Ya visible en todas las páginas */}
      <FloatingPedidosYa />
    </>
  );
}
