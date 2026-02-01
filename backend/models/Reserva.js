const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  mesa: {
    type: Number,
    required: true,
    min: 1,
    max: 20 // Asumiendo que hay máximo 20 mesas
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // Formato HH:MM
  },
  cliente: {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    telefono: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  personas: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
    default: 'pendiente'
  },
  notas: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Índice compuesto para búsqueda rápida de disponibilidad
reservaSchema.index({ fecha: 1, mesa: 1 });
reservaSchema.index({ estado: 1 });

// Método para verificar disponibilidad de mesa
reservaSchema.statics.verificarDisponibilidad = async function(mesa, fecha, hora, excludeId = null) {
  const fechaInicio = new Date(fecha);
  fechaInicio.setHours(0, 0, 0, 0);
  
  const fechaFin = new Date(fecha);
  fechaFin.setHours(23, 59, 59, 999);

  const query = {
    mesa,
    fecha: { $gte: fechaInicio, $lte: fechaFin },
    hora,
    estado: { $in: ['pendiente', 'confirmada'] }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const reservaExistente = await this.findOne(query);
  return !reservaExistente;
};

module.exports = mongoose.model('Reserva', reservaSchema);
