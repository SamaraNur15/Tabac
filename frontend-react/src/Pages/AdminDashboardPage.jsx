// src/Pages/AdminDashboardPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState({
    productos: { disponibles: 0, total: 0, stockBajo: 0 },
    usuario: { nombre: '', rol: '' }
  });
  const [stockBajo, setStockBajo] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchStockBajo();
  }, []);

  const fetchStockBajo = async () => {
    try {
      const response = await fetch(`${API_URL}/comidas`);
      if (!response.ok) return;
      
      const productos = await response.json();
      // Filtrar productos con stock <= stockMinimo
      const bajoStock = productos.filter(p => 
        p.stock <= (p.stockMinimo || 5) && p.disponible !== false
      );
      setStockBajo(bajoStock);
    } catch (err) {
      console.error('Error al cargar productos con stock bajo:', err);
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('tabac_auth_token');
      
      console.log('🔑 Token para dashboard:', token ? 'Existe' : 'NO EXISTE');
      
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error del servidor:', response.status, errorData);
        throw new Error(errorData.message || 'Error al cargar el dashboard');
      }

      const data = await response.json();
      console.log('✅ Dashboard cargado:', data);
      setDashboard(data);
    } catch (err) {
      console.error('❌ Error en fetchDashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>❌ {error}</p>
        <button onClick={fetchDashboard}>Reintentar</button>
      </div>
    );
  }

  const { productos, usuario } = dashboard;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-hero">
        <div className="dashboard-hero__content">
          <h1 className="dashboard-hero__title">Dashboard Administrativo</h1>
          <p className="dashboard-hero__subtitle">
            Bienvenido, {usuario.nombre} • {new Date().toLocaleDateString('es-AR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button onClick={fetchDashboard} className="refresh-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Actualizar
        </button>
      </div>

      <div className="dashboard-container">

      {/* Métricas de productos */}
      <section className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Total Productos</p>
            <p className="metric-value">{productos.total}</p>
          </div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Productos Disponibles</p>
            <p className="metric-value">{productos.disponibles}</p>
          </div>
        </div>

        <Link to="/admin/productos" className="metric-card warning">
          <div className="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Stock Bajo</p>
            <p className="metric-value">{productos.stockBajo}</p>
          </div>
        </Link>

        <div className="metric-card info">
          <div className="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">No Disponibles</p>
            <p className="metric-value">{productos.total - productos.disponibles}</p>
          </div>
        </div>
      </section>

      {/* Alertas de stock bajo */}
      {stockBajo.length > 0 && (
        <section className="stock-alerts">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Alertas de Stock Bajo
          </h2>
          <div className="alerts-list">
            {stockBajo.map(producto => (
              <div key={producto._id} className="alert-item">
                <img 
                  src={producto.imagen || '/img/placeholder.png'} 
                  alt={producto.nombre}
                  className="alert-img"
                />
                <div className="alert-info">
                  <h4>{producto.nombre}</h4>
                  <p className="alert-stock">
                    Stock actual: <span className="danger-text">{producto.stock}</span>
                    {' '} / Mínimo: {producto.stockMinimo || 5}
                  </p>
                </div>
                <Link to="/admin/productos" className="btn-manage">
                  Gestionar
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Acciones rápidas */}
      <section className="quick-actions">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Acciones Rápidas
        </h2>
        <div className="actions-grid">
          <Link to="/admin/productos" className="action-card">
            <span className="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </span>
            <span className="action-label">Gestionar Productos</span>
            {stockBajo.length > 0 && (
              <span className="action-badge warning">{stockBajo.length}</span>
            )}
          </Link>
          
          {usuario.rol === 'admin' && (
            <>
              <Link to="/admin/usuarios" className="action-card">
                <span className="action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                <span className="action-label">Gestionar Usuarios</span>
              </Link>
              
              <Link to="/admin/reservas" className="action-card">
                <span className="action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </span>
                <span className="action-label">Ver Reservas</span>
              </Link>

              <Link to="/admin/historial" className="action-card">
                <span className="action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </span>
                <span className="action-label">Ver Historial</span>
              </Link>
            </>
          )}
        </div>
      </section>
      </div>
    </div>
  );
}
