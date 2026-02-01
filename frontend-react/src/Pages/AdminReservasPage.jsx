import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminReservasPage.css';

export default function AdminReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState({});
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  
  // Formulario
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const [formData, setFormData] = useState({
    mesa: '',
    fecha: '',
    hora: '',
    cliente: {
      nombre: '',
      telefono: '',
      email: ''
    },
    personas: 2,
    notas: ''
  });
        const url = `${API_URL}/reservas?fecha=${fecha}`;
  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('todas');

  useEffect(() => {
    cargarReservas();
    cargarDisponibilidad(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('tabac_auth_token');
      
      const fecha = fechaSeleccionada.toISOString().split('T')[0];
      const url = `http://localhost:3000/api/reservas?fecha=${fecha}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

        const response = await fetch(`${API_URL}/reservas/disponibilidad?fecha=${fechaStr}`);
        const data = await response.json();
        setReservas(data);
      }
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const cargarDisponibilidad = async (fecha) => {
    try {
      const fechaStr = fecha.toISOString().split('T')[0];
      const response = await fetch(`http://localhost:3000/api/reservas/disponibilidad?fecha=${fechaStr}`);
      
      if (response.ok) {
        const data = await response.json();
        setDisponibilidad(data.disponibilidad);
        setHorarios(data.horarios);
      }
    } catch (err) {
      console.error('Error al cargar disponibilidad:', err);
    }
  };

  const handleDateChange = (date) => {
    setFechaSeleccionada(date);
        const url = modoEdicion 
          ? `${API_URL}/reservas/${reservaEditando._id}`
          : `${API_URL}/reservas`;
    setModoEdicion(false);
    setReservaEditando(null);
    setFormData({
      mesa: '',
      fecha: fechaSeleccionada.toISOString().split('T')[0],
      hora: '',
      cliente: { nombre: '', telefono: '', email: '' },
      personas: 2,
      notas: ''
    });
    setShowModal(true);
  };

  const abrirModalEditar = (reserva) => {
    setModoEdicion(true);
    setReservaEditando(reserva);
    setFormData({
      mesa: reserva.mesa,
      fecha: new Date(reserva.fecha).toISOString().split('T')[0],
      hora: reserva.hora,
      cliente: reserva.cliente,
      personas: reserva.personas,
      notas: reserva.notas || ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('cliente.')) {
      const campo = name.split('.')[1];
        const response = await fetch(`${API_URL}/reservas/${reservaId}`, {
        ...prev,
        cliente: { ...prev.cliente, [campo]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('tabac_auth_token');
      
      // Validaciones
      if (!formData.mesa || !formData.fecha || !formData.hora) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }

      if (!formData.cliente.nombre || !formData.cliente.telefono) {
        alert('Nombre y teléfono del cliente son obligatorios');
        return;
      }

      const url = modoEdicion 
        ? `http://localhost:3000/api/reservas/${reservaEditando._id}`
        const response = await fetch(`${API_URL}/reservas/${reservaId}`, {
      
      const method = modoEdicion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(modoEdicion ? 'Reserva actualizada' : 'Reserva creada exitosamente');
        setShowModal(false);
        cargarReservas();
        cargarDisponibilidad(fechaSeleccionada);
      } else {
        alert(data.message || data.error || 'Error al guardar la reserva');
      }
    } catch (err) {
      console.error('Error al guardar reserva:', err);
      alert('Error al guardar la reserva');
    }
  };

  const cambiarEstado = async (reservaId, nuevoEstado) => {
    try {
      const token = localStorage.getItem('tabac_auth_token');
      
      const response = await fetch(`http://localhost:3000/api/reservas/${reservaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        cargarReservas();
        cargarDisponibilidad(fechaSeleccionada);
      } else {
        const data = await response.json();
        alert(data.error || 'Error al cambiar estado');
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar estado de la reserva');
    }
  };

  const cancelarReserva = async (reservaId) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
      const token = localStorage.getItem('tabac_auth_token');
      
      const response = await fetch(`http://localhost:3000/api/reservas/${reservaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        cargarReservas();
        cargarDisponibilidad(fechaSeleccionada);
      }
    } catch (err) {
      console.error('Error al cancelar reserva:', err);
      alert('Error al cancelar la reserva');
    }
  };

  const reservasFiltradas = reservas.filter(r => {
    if (filtroEstado === 'todas') return true;
    return r.estado === filtroEstado;
  });

  const getMesaColor = (mesa, hora) => {
    if (!disponibilidad[mesa] || !disponibilidad[mesa][hora]) return 'ocupada';
    return disponibilidad[mesa][hora] ? 'disponible' : 'ocupada';
  };

  return (
    <div className="reservas-page">
      <div className="reservas-header">
        <h1>🍽️ Gestión de Reservas</h1>
        <button className="btn-nueva-reserva" onClick={abrirModalNueva}>
          ➕ Nueva Reserva
        </button>
      </div>

      <div className="reservas-content">
        {/* Calendario */}
        <div className="calendario-section">
          <h2>📅 Seleccionar Fecha</h2>
          <Calendar
            onChange={handleDateChange}
            value={fechaSeleccionada}
            minDate={new Date()}
            locale="es-ES"
          />
          
          <div className="leyenda">
            <h3>Disponibilidad de Mesas</h3>
            <div className="leyenda-item">
              <span className="indicador disponible"></span>
              <span>Disponible</span>
            </div>
            <div className="leyenda-item">
              <span className="indicador ocupada"></span>
              <span>Ocupada</span>
            </div>
          </div>
        </div>

        {/* Lista de Reservas */}
        <div className="reservas-lista-section">
          <div className="lista-header">
            <h2>Reservas para {fechaSeleccionada.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h2>
            
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="filtro-estado"
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">Cargando...</div>
          ) : reservasFiltradas.length === 0 ? (
            <div className="no-reservas">
              <p>No hay reservas para esta fecha</p>
            </div>
          ) : (
            <div className="reservas-lista">
              {reservasFiltradas.map(reserva => (
                <div key={reserva._id} className={`reserva-card ${reserva.estado}`}>
                  <div className="reserva-info">
                    <div className="reserva-header-card">
                      <span className="mesa-numero">Mesa {reserva.mesa}</span>
                      <span className="hora">{reserva.hora}</span>
                      <span className={`estado-badge ${reserva.estado}`}>
                        {reserva.estado.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="cliente-info">
                      <p><strong>Cliente:</strong> {reserva.cliente.nombre}</p>
                      <p><strong>Teléfono:</strong> {reserva.cliente.telefono}</p>
                      {reserva.cliente.email && (
                        <p><strong>Email:</strong> {reserva.cliente.email}</p>
                      )}
                      <p><strong>Personas:</strong> {reserva.personas}</p>
                      {reserva.notas && (
                        <p className="notas"><strong>Notas:</strong> {reserva.notas}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="reserva-acciones">
                    {reserva.estado === 'pendiente' && (
                      <>
                        <button 
                          className="btn-confirmar"
                          onClick={() => cambiarEstado(reserva._id, 'confirmada')}
                        >
                          ✓ Confirmar
                        </button>
                        <button 
                          className="btn-editar"
                          onClick={() => abrirModalEditar(reserva)}
                        >
                          ✏️ Editar
                        </button>
                      </>
                    )}
                    
                    {reserva.estado === 'confirmada' && (
                      <button 
                        className="btn-completar"
                        onClick={() => cambiarEstado(reserva._id, 'completada')}
                      >
                        ✓ Completar
                      </button>
                    )}
                    
                    {reserva.estado !== 'cancelada' && reserva.estado !== 'completada' && (
                      <button 
                        className="btn-cancelar"
                        onClick={() => cancelarReserva(reserva._id)}
                      >
                        ✖ Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mapa de Disponibilidad por Mesa */}
      {horarios.length > 0 && (
        <div className="disponibilidad-grid">
          <h2>Mapa de Disponibilidad</h2>
          <div className="mesas-grid">
            {Array.from({ length: 20 }, (_, i) => i + 1).map(mesa => (
              <div key={mesa} className="mesa-disponibilidad">
                <h3>Mesa {mesa}</h3>
                <div className="horarios-mesa">
                  {horarios.slice(0, 10).map(hora => (
                    <div 
                      key={hora}
                      className={`horario-slot ${getMesaColor(mesa, hora)}`}
                      title={`Mesa ${mesa} - ${hora}`}
                    >
                      {hora}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Reserva */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modoEdicion ? 'Editar Reserva' : 'Nueva Reserva'}</h2>
              <button className="btn-cerrar" onClick={() => setShowModal(false)}>✖</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Mesa *</label>
                  <select 
                    name="mesa"
                    value={formData.mesa}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar mesa</option>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>Mesa {num}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hora *</label>
                  <select
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar hora</option>
                    {horarios.map(hora => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Personas *</label>
                  <input
                    type="number"
                    name="personas"
                    value={formData.personas}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nombre del Cliente *</label>
                <input
                  type="text"
                  name="cliente.nombre"
                  value={formData.cliente.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="cliente.telefono"
                    value={formData.cliente.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="cliente.email"
                    value={formData.cliente.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notas</label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Alergias, preferencias, etc."
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar-modal" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {modoEdicion ? 'Actualizar' : 'Crear'} Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
