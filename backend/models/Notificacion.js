const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificacionSchema = new Schema({
  // A quién va dirigida la notificación
  roles: [{
    type: String,
    enum: ['admin', 'cajero', 'usuario'],
    required: true
  }],
  
  // Contenido de la notificación
  tipo: {
    type: String,
    required: true,
    enum: ['nueva_orden', 'cambio_estado', 'nueva_reserva', 'cambio_estado_reserva', 'stock_bajo', 'sistema']
  },
  
  titulo: {
    type: String,
    required: true
  },
  
  mensaje: {
    type: String,
    required: true
  },
  
  // Datos adicionales para navegación
  entidadTipo: {
    type: String,
    enum: ['orden', 'reserva', 'producto', 'sistema']
  },
  
  entidadId: {
    type: Schema.Types.ObjectId
  },
  
  // Información adicional específica según el tipo
  metadata: {
    type: Schema.Types.Mixed
  },
  
  // Control de lectura por usuario
  leidaPor: [{
    usuarioId: {
      type: String,
      required: true
    },
    fechaLectura: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Estado general
  activa: {
    type: Boolean,
    default: true
  },
  
  expiraEn: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 días
  }
}, {
  timestamps: true
});

// Índices para mejorar rendimiento
NotificacionSchema.index({ roles: 1, activa: 1, createdAt: -1 });
NotificacionSchema.index({ expiraEn: 1 });
NotificacionSchema.index({ 'leidaPor.usuarioId': 1 });

// Método para marcar como leída por un usuario
NotificacionSchema.methods.marcarComoLeida = function(usuarioId) {
  const yaLeida = this.leidaPor.some(l => l.usuarioId === usuarioId);
  
  if (!yaLeida) {
    this.leidaPor.push({
      usuarioId,
      fechaLectura: new Date()
    });
  }
  
  return this.save();
};

// Método estático para obtener notificaciones no leídas de un usuario
NotificacionSchema.statics.obtenerNoLeidas = function(usuarioId, rol) {
  return this.find({
    roles: rol,
    activa: true,
    expiraEn: { $gt: new Date() },
    'leidaPor.usuarioId': { $ne: usuarioId }
  }).sort({ createdAt: -1 });
};

// Método estático para limpiar notificaciones expiradas
NotificacionSchema.statics.limpiarExpiradas = function() {
  return this.updateMany(
    { expiraEn: { $lt: new Date() } },
    { $set: { activa: false } }
  );
};

module.exports = mongoose.model('Notificacion', NotificacionSchema);
