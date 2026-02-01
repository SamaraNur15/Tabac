// src/Pages/AdminUsuariosPage.jsx
import { useEffect, useState } from 'react';
import Toast from '../comoponents/Ui/Toast';
import ConfirmDialog from '../comoponents/Ui/ConfirmDialog';
import { authService } from '../utils/auth';
import './AdminUsuariosPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'cajero'
  });
  const currentUserId = authService.getUserId();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('tabac_auth_token');
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al cargar usuarios');

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error:', error);
      setToast({ message: 'Error al cargar usuarios', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUser(usuario);
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        password: '',
        rol: usuario.rol
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'cajero'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'cajero'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || (!editingUser && !formData.password)) {
      setToast({ message: 'Completa todos los campos requeridos', type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('tabac_auth_token');
      const url = editingUser 
        ? `${API_URL}/usuarios/${editingUser._id}`
        : `${API_URL}/usuarios`;
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const body = editingUser
        ? { ...formData, password: formData.password || undefined }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al guardar usuario');
      }

      setToast({ 
        message: editingUser ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente', 
        type: 'success' 
      });
      handleCloseModal();
      fetchUsuarios();
    } catch (error) {
      console.error('Error:', error);
      setToast({ message: error.message, type: 'error' });
    }
  };

  const handleDelete = async (usuario) => {
    try {
      const token = localStorage.getItem('tabac_auth_token');
      const response = await fetch(`${API_URL}/usuarios/${usuario._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar usuario');
      }

      setToast({ message: 'Usuario eliminado exitosamente', type: 'error' });
      setShowConfirm(null);
      fetchUsuarios();
    } catch (error) {
      console.error('Error:', error);
      setToast({ message: error.message, type: 'error' });
      setShowConfirm(null);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setToast({ message: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('tabac_auth_token');
      const response = await fetch(`${API_URL}/usuarios/${showResetPassword._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al resetear contraseña');
      }

      setToast({ message: 'Contraseña actualizada exitosamente', type: 'success' });
      setShowResetPassword(null);
      setNewPassword('');
    } catch (error) {
      console.error('Error:', error);
      setToast({ message: error.message, type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="usuarios-loading">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showConfirm && (
        <ConfirmDialog
          message={`¿Eliminar usuario ${showConfirm.nombre}?`}
          onConfirm={() => handleDelete(showConfirm)}
          onCancel={() => setShowConfirm(null)}
        />
      )}

      {showResetPassword && (
        <div className="modal-overlay" onClick={() => setShowResetPassword(null)}>
          <div className="modal-content modal-reset" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Resetear Contraseña</h2>
              <button className="modal-close" onClick={() => setShowResetPassword(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="reset-password-content">
              <div className="reset-user-info">
                <div className="usuario-avatar-large">
                  {showResetPassword.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{showResetPassword.nombre}</h3>
                  <p>{showResetPassword.email}</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña *</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength="6"
                  autoFocus
                />
                <small className="form-hint">La contraseña debe tener al menos 6 caracteres</small>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowResetPassword(null)}>
                  Cancelar
                </button>
                <button type="button" className="btn-submit" onClick={handleResetPassword}>
                  Actualizar Contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="usuarios-page">
        <div className="usuarios-hero">
          <div className="usuarios-hero__content">
            <h1 className="usuarios-hero__title">Gestión de Usuarios</h1>
            <p className="usuarios-hero__subtitle">
              Administra el personal del sistema
            </p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn-nuevo-usuario">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo Usuario
          </button>
        </div>

        <div className="usuarios-container">
          <div className="usuarios-stats">
            <div className="stat-card">
              <div className="stat-icon admin">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Administradores</p>
                <p className="stat-value">{usuarios.filter(u => u.rol === 'admin').length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon cajero">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Cajeros</p>
                <p className="stat-value">{usuarios.filter(u => u.rol === 'cajero').length}</p>
              </div>
            </div>
          </div>

          <div className="usuarios-table-container">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha de Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario._id}>
                    <td className="usuario-cell" data-label="Usuario">
                      <div className="usuario-info">
                        <div className="usuario-avatar">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="usuario-nombre">{usuario.nombre}</span>
                      </div>
                    </td>
                    <td data-label="Email">{usuario.email}</td>
                    <td data-label="Rol">
                      <span className={`rol-badge rol-badge--${usuario.rol}`}>
                        {usuario.rol === 'admin' ? 'Administrador' : 'Cajero'}
                      </span>
                    </td>
                    <td data-label="Fecha">
                      {new Date(usuario.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="acciones-cell" data-label="Acciones">
                      <div className="table-actions">
                        <button 
                          className="btn-action btn-action--edit"
                          onClick={() => handleOpenModal(usuario)}
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="btn-action btn-action--reset"
                          onClick={() => {
                            setShowResetPassword(usuario);
                            setNewPassword('');
                          }}
                          title="Resetear Contraseña"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </button>
                        <button 
                          className="btn-action btn-action--delete"
                          onClick={() => {
                            if (usuario._id === currentUserId) {
                              setToast({ message: 'No puedes eliminar tu propia cuenta', type: 'error' });
                            } else {
                              setShowConfirm(usuario);
                            }
                          }}
                          title="Eliminar"
                          disabled={usuario._id === currentUserId}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de creación/edición */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="usuario-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre Completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="usuario@ejemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Contraseña {editingUser ? '(dejar vacío para no cambiar)' : '*'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    placeholder="Mínimo 6 caracteres"
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rol">Rol *</label>
                  <select
                    id="rol"
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    required
                  >
                    <option value="cajero">Cajero</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingUser ? 'Actualizar' : 'Crear'} Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
