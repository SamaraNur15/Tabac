// models/orden.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrdenItemSchema = new Schema({
  comida:    { type: Schema.Types.ObjectId, ref: 'Comidas', required: true }, // Nombre consistente
  nombre:    { type: String, required: true },
  precio:    { type: Number, required: true, min: 0 },
  imagen:    { type: String, default: null },
  categoria: { type: String, default: null },
  cantidad:  { type: Number, required: true, min: 1 },
  subtotal:  { type: Number, required: true, min: 0 } // Cantidad * precio
}, { _id: true });

const OrdenSchema = new Schema({
  user: { type: String, index: true }, // Solo si es usuario autenticado
  
  clienteInvitado: { // Solo si es orden de invitado
    nombre: { type: String },
    email: { type: String },
    telefono: { type: String }
  },

  items:   { type: [OrdenItemSchema], required: true },
  entrega: {
    modo: { type: String, enum: ['retiro','delivery'], default: 'retiro' },
    direccion: { type: String, default: null },
    notas: { type: String, default: null }
  },

  totales: {
    subtotal:   { type: Number, required: true },
    descuentos: { type: Number, required: true },
    delivery:   { type: Number, required: true },
    total:      { type: Number, required: true }
  },

  estado: { 
    type: String, 
    enum: ['pendiente', 'aceptada', 'en_preparacion', 'lista', 'entregada', 'rechazada', 'cancelada'], 
    default: 'pendiente', 
    index: true 
  },
  
  motivoRechazo: { type: String, default: null },
  
  procesadaPor: {
    usuario: { type: String },
    rol: { type: String },
    fecha: { type: Date }
  },

  // Historial de cambios de estado para auditoría
  historialEstados: [{
    estado: { 
      type: String, 
      enum: ['pendiente', 'aceptada', 'en_preparacion', 'lista', 'entregada', 'rechazada', 'cancelada'],
      required: true
    },
    usuario: { type: String },
    rol: { type: String },
    fecha: { type: Date, default: Date.now },
    notas: { type: String }
  }],

  // Campos para análisis y métricas
  horaCreacion: { type: Date, default: Date.now, index: true },
  mesaAsignada: { type: Number, min: 1, max: 20, default: null },
  metodoPago: { 
    type: String, 
    enum: ['efectivo', 'tarjeta', 'transferencia', 'simulado', 'mercadopago'], 
    default: 'simulado' 
  },

  pago: {
    metodo: { type: String, default: 'simulado' },
    estado: { type: String, enum: ['pendiente','aprobado','rechazado','reembolsado'], default: 'pendiente' },
    transaccionId: { type: String, default: null },
    pagadaEn: { type: Date, default: null },
    mercadopago: {
      paymentId: { type: String },
      status: { type: String },
      statusDetail: { type: String },
      updatedAt: { type: Date }
    }
  },

  numero: { type: String, unique: true }, // p.ej. ORD-YYYYMMDD-00001
  
  total: { type: Number, required: true, min: 0 } // Campo directo para facilitar consultas
}, { collection: 'Ordenes', timestamps: true });

module.exports = mongoose.model('Orden', OrdenSchema);
