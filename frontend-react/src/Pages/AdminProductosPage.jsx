// src/Pages/AdminProductosPage.jsx
import { useState, useEffect } from 'react';
import { authService } from '../utils/auth';
import './AdminProductosPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function AdminProductosPage() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroStock, setFiltroStock] = useState('todos');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'dulce',
    imagen: '',
    stock: '',
    stockMinimo: '5',
    disponible: true
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [productos, busqueda, filtroCategoria, filtroStock]);

  const aplicarFiltros = () => {
    let resultado = [...productos];

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busquedaLower) ||
        p.descripcion?.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtro por categoría
    if (filtroCategoria !== 'todas') {
      resultado = resultado.filter(p => p.categoria === filtroCategoria);
    }

    // Filtro por stock
    if (filtroStock === 'sinStock') {
      resultado = resultado.filter(p => p.stock <= 0 || !p.disponible);
    } else if (filtroStock === 'stockBajo') {
      resultado = resultado.filter(p => 
        p.stock > 0 && p.stock <= (p.stockMinimo || 5) && p.disponible
      );
    } else if (filtroStock === 'disponible') {
      resultado = resultado.filter(p => p.stock > (p.stockMinimo || 5) && p.disponible);
    }

    setProductosFiltrados(resultado);
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/comidas`);
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpenModal = (producto = null) => {
    if (producto) {
      setEditingProduct(producto);
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        categoria: producto.categoria || 'dulce',
        imagen: producto.imagen || '',
        stock: producto.stock ?? '',
        stockMinimo: producto.stockMinimo ?? '5',
        disponible: producto.disponible ?? true
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'dulce',
        imagen: '',
        stock: '',
        stockMinimo: '5',
        disponible: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: 'dulce',
      imagen: '',
      stock: '',
      stockMinimo: '5',
      disponible: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = authService.getToken();
    
    const payload = {
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      stockMinimo: Number(formData.stockMinimo)
    };

    try {
      const url = editingProduct
        ? `${API_URL}/comidas/${editingProduct._id}`
        : `${API_URL}/comidas`;      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar producto');
      }

      await fetchProductos();
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (productoId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    const token = authService.getToken();
    try {
      const response = await fetch(`${API_URL}/comidas/${productoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar producto');
      
      await fetchProductos();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-loading">Cargando productos...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;

  return (
    <div className="admin-productos-page">
      <div className="page-header">
        <h1>Gestión de Productos</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          + Nuevo Producto
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="filtros-container">
        <div className="busqueda-box">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>

        <div className="filtros-row">
          <div className="filtro-group">
            <label>Categoría:</label>
            <select 
              value={filtroCategoria} 
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="select-filtro"
            >
              <option value="todas">Todas</option>
              <option value="dulce">Dulce</option>
              <option value="salado">Salado</option>
              <option value="bebidas">Bebidas</option>
            </select>
          </div>

          <div className="filtro-group">
            <label>Stock:</label>
            <select 
              value={filtroStock} 
              onChange={(e) => setFiltroStock(e.target.value)}
              className="select-filtro"
            >
              <option value="todos">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="stockBajo">Stock Bajo</option>
              <option value="sinStock">Sin Stock</option>
            </select>
          </div>

          <div className="filtro-stats">
            <span className="stat-badge">
              Total: {productosFiltrados.length}
            </span>
          </div>
        </div>
      </div>

      <div className="productos-table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Stock Mín.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-message">
                  No se encontraron productos con los filtros aplicados
                </td>
              </tr>
            ) : (
              productosFiltrados.map(producto => {
                const stockBajo = producto.stock <= (producto.stockMinimo || 5);
                const sinStock = producto.stock <= 0 || !producto.disponible;
              
                return (
                  <tr key={producto._id} className={sinStock ? 'sin-stock' : stockBajo ? 'stock-bajo' : ''}>
                  <td data-label="Imagen">
                    <img 
                      src={producto.imagen || '/img/placeholder.png'} 
                      alt={producto.nombre}
                      className="producto-thumbnail"
                    />
                  </td>
                  <td data-label="Nombre">{producto.nombre}</td>
                  <td data-label="Categoría">
                    <span className={`badge-categoria ${producto.categoria}`}>
                      {producto.categoria}
                    </span>
                  </td>
                  <td data-label="Precio">${producto.precio}</td>
                  <td data-label="Stock">
                    <span className={stockBajo ? 'text-warning' : ''}>
                      {producto.stock ?? 0}
                    </span>
                  </td>
                  <td data-label="Stock Mín.">{producto.stockMinimo ?? 5}</td>
                  <td data-label="Estado">
                    {sinStock ? (
                      <span className="badge-status sin-stock">Sin Stock</span>
                    ) : stockBajo ? (
                      <span className="badge-status stock-bajo">Stock Bajo</span>
                    ) : (
                      <span className="badge-status disponible">Disponible</span>
                    )}
                  </td>
                  <td data-label="Acciones">
                    <div className="acciones-btns">
                      <button 
                        className="btn-edit"
                        onClick={() => handleOpenModal(producto)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(producto._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="producto-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="dulce">Dulce</option>
                    <option value="salado">Salado</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>URL Imagen</label>
                <input
                  type="text"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="/img/producto.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock Mínimo</label>
                  <input
                    type="number"
                    name="stockMinimo"
                    value={formData.stockMinimo}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={formData.disponible}
                    onChange={handleInputChange}
                  />
                  Disponible para la venta
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
