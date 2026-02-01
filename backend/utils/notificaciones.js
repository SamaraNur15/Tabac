/**
 * Helper para emitir notificaciones via Socket.IO desde cualquier parte del backend
 * Y persistirlas en la base de datos para usuarios que no estén conectados
 */

const Notificacion = require('../models/Notificacion');

/**
 * Guardar notificación en base de datos Y emitir via Socket.IO
 * @param {Object} io - Instancia de Socket.IO
 * @param {Array} roles - Array de roles ['admin', 'cajero']
 * @param {String} evento - Nombre del evento
 * @param {Object} data - Datos de la notificación
 */
async function notificarARoles(io, roles, evento, data) {
  try {
    // 1. Guardar en base de datos
    const notificacionDB = new Notificacion({
      roles: roles,
      tipo: data.tipo,
      titulo: data.titulo,
      mensaje: data.mensaje,
      entidadTipo: data.ordenId ? 'orden' : data.reservaId ? 'reserva' : data.productoId ? 'producto' : null,
      entidadId: data.ordenId || data.reservaId || data.productoId || null,
      metadata: data,
      activa: true
    });

    await notificacionDB.save();
    console.log(`💾 Notificación guardada en DB: ${data.titulo}`);

    // 2. Emitir via Socket.IO a usuarios conectados
    if (io) {
      roles.forEach(rol => {
        io.to(`role_${rol}`).emit(evento, {
          ...data,
          _id: notificacionDB._id,
          createdAt: notificacionDB.createdAt
        });
      });
      console.log(`📡 Notificación emitida a roles: ${roles.join(', ')}`);
    }

    return notificacionDB;
  } catch (error) {
    console.error('❌ Error al notificar:', error);
    
    // Fallback: al menos intentar emitir por socket
    if (io) {
      roles.forEach(rol => {
        io.to(`role_${rol}`).emit(evento, data);
      });
    }
  }
}

/**
 * Emitir notificación de nueva orden
 */
async function notificarNuevaOrden(io, orden) {
  const notificacion = {
    tipo: 'nueva_orden',
    titulo: '🆕 Nueva Orden',
    mensaje: `Orden ${orden.numero} recibida - Total: $${orden.total.toLocaleString()}`,
    ordenId: orden._id,
    numeroOrden: orden.numero,
    total: orden.total,
    items: orden.items?.length || 0,
    timestamp: new Date()
  };

  // Notificar a admin y cajero
  await notificarARoles(io, ['admin', 'cajero'], 'nueva_orden', notificacion);
}

/**
 * Emitir notificación de cambio de estado de orden
 */
function notificarCambioEstado(io, orden, estadoAnterior, estadoNuevo) {
  try {
    console.log('📢 [NOTIFICACIÓN] Inicio:', { ordenId: orden?._id, estadoAnterior, estadoNuevo });

    const emojis = {
      pendiente: '⏳',
      aceptada: '👍',
      en_preparacion: '👨‍🍳',
      lista: '✅',
      entregada: '🎉',
      rechazada: '❌',
      cancelada: '🚫'
    };

    const notificacion = {
      tipo: 'cambio_estado',
      titulo: `${emojis[estadoNuevo] || '📝'} Estado Actualizado`,
      mensaje: `Orden ${orden.numero}: ${estadoAnterior} → ${estadoNuevo}`,
      ordenId: orden._id,
      numeroOrden: orden.numero,
      estadoAnterior,
      estadoNuevo,
      timestamp: new Date()
    };

    console.log('📢 [NOTIFICACIÓN] Datos:', notificacion);

    // Notificar a admin y cajero (sala privada)
    notificarARoles(io, ['admin', 'cajero'], 'cambio_estado_orden', notificacion);
    
    // TAMBIÉN emitir globalmente para usuarios públicos que estén rastreando
    io.emit('cambio_estado_orden', notificacion);
    
    console.log('✅ [NOTIFICACIÓN] Enviada a roles: admin, cajero + público');
  } catch (error) {
    console.error('❌ [NOTIFICACIÓN] Error:', error);
  }
}

/**
 * Emitir notificación de nueva reserva
 */
async function notificarNuevaReserva(io, reserva) {
  const notificacion = {
    tipo: 'nueva_reserva',
    titulo: '🍽️ Nueva Reserva',
    mensaje: `Mesa ${reserva.mesa} - ${reserva.cliente.nombre} - ${reserva.hora}`,
    reservaId: reserva._id,
    mesa: reserva.mesa,
    fecha: reserva.fecha,
    hora: reserva.hora,
    cliente: reserva.cliente.nombre,
    timestamp: new Date()
  };

  // Notificar a admin y cajero
  await notificarARoles(io, ['admin', 'cajero'], 'nueva_reserva', notificacion);
}

/**
 * Emitir notificación de stock bajo
 */
async function notificarStockBajo(io, producto) {
  const notificacion = {
    tipo: 'stock_bajo',
    titulo: '⚠️ Stock Bajo',
    mensaje: `${producto.nombre} - Stock: ${producto.stock} (mínimo: ${producto.stockMinimo})`,
    productoId: producto._id,
    nombre: producto.nombre,
    stock: producto.stock,
    stockMinimo: producto.stockMinimo,
    timestamp: new Date()
  };

  // Notificar solo a admin
  await notificarARoles(io, ['admin'], 'stock_bajo', notificacion);
}

/**
 * Emitir notificación de reserva confirmada/cancelada
 */
async function notificarCambioReserva(io, reserva, accion) {
  const emojis = {
    confirmada: '✅',
    cancelada: '❌',
    completada: '🎉'
  };

  const notificacion = {
    tipo: 'cambio_reserva',
    titulo: `${emojis[accion]} Reserva ${accion}`,
    mensaje: `Mesa ${reserva.mesa} - ${reserva.cliente.nombre} - ${reserva.hora}`,
    reservaId: reserva._id,
    mesa: reserva.mesa,
    fecha: reserva.fecha,
    hora: reserva.hora,
    estado: reserva.estado,
    timestamp: new Date()
  };

  await notificarARoles(io, ['admin', 'cajero'], 'cambio_reserva', notificacion);
}

module.exports = {
  notificarARoles,
  notificarNuevaOrden,
  notificarCambioEstado,
  notificarNuevaReserva,
  notificarStockBajo,
  notificarCambioReserva
};
