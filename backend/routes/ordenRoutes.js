// routes/ordenRoutes.js
const { Router } = require('express');
const mongoose = require('mongoose');
const Orden = require('../models/orden');
const Usuario = require('../models/Usuario');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = Router();
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const buildOrderNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `ORD-${y}${m}${d}-${rand}`;
};

// POST /api/ordenes - Crear orden (canal WhatsApp o web)
router.post('/', asyncH(async (req, res) => {
  const { items, clientData, deliveryMode, channel } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items inválidos' });
  }

  if (!clientData || !clientData.nombre || !clientData.telefono) {
    return res.status(400).json({ error: 'Datos de cliente incompletos' });
  }

  const mappedItems = items.map(item => ({
    comida: item._id,
    nombre: item.nombre,
    precio: Number(item.precio || 0),
    imagen: item.imagen || null,
    categoria: item.categoria || null,
    cantidad: Number(item.cantidad || 1),
    subtotal: Number(item.precio || 0) * Number(item.cantidad || 1)
  }));

  const subtotal = mappedItems.reduce((sum, it) => sum + it.subtotal, 0);
  const total = subtotal;

  const orden = await Orden.create({
    clienteInvitado: {
      nombre: clientData.nombre,
      telefono: clientData.telefono
    },
    items: mappedItems,
    entrega: {
      modo: deliveryMode === 'delivery' ? 'delivery' : 'retiro',
      direccion: deliveryMode === 'delivery' ? (clientData.direccion || null) : null,
      notas: clientData.observaciones || null
    },
    totales: {
      subtotal,
      descuentos: 0,
      delivery: 0,
      total
    },
    total,
    estado: 'pendiente',
    status: 'pendiente',
    channel: channel === 'web' ? 'web' : 'whatsapp',
    numero: buildOrderNumber()
  });

  res.status(201).json({ ordenId: orden._id, numero: orden.numero, estado: orden.estado });
}));


// GET /api/ordenes/admin - Obtener órdenes (admin/cajero)
router.get('/admin', authMiddleware, requireRole(['admin', 'cajero']), asyncH(async (req, res) => {
  const { status, channel, from, to } = req.query;
  const query = {};

  if (status) query.status = status;
  if (channel) query.channel = channel;

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  const ordenes = await Orden.find(query)
    .sort({ createdAt: -1 });

  res.json(ordenes);
}));

// PATCH /api/ordenes/:ordenId/status - Actualizar status de la orden (admin/cajero)
router.patch('/:ordenId/status', authMiddleware, requireRole(['admin', 'cajero']), asyncH(async (req, res) => {
  const { status } = req.body;

  if (!['pendiente', 'confirmado', 'cancelado'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  const orden = await Orden.findByIdAndUpdate(
    req.params.ordenId,
    { status },
    { new: true }
  );

  if (!orden) {
    return res.status(404).json({ error: 'Orden no encontrada' });
  }

  res.json(orden);
}));

// GET /api/ordenes/:userId - Obtener todas las órdenes de un usuario
router.get('/user/:userId', authMiddleware, asyncH(async (req, res) => {
  // Verificar permisos
  if (req.params.userId !== req.user.userId) {
    return res.status(403).json({ error: 'No tienes permiso para ver órdenes de otro usuario' });
  }
  
  const ordenes = await Orden.find({ user: String(req.params.userId) })
    .sort({ createdAt: -1 }); // Más recientes primero
  
  res.json(ordenes);
}));

// GET /api/ordenes/numero/:numero - Obtener orden por número
router.get('/numero/:numero', authMiddleware, asyncH(async (req, res) => {
  const orden = await Orden.findOne({ numero: req.params.numero });
  
  if (!orden) {
    return res.status(404).json({ error: 'Orden no encontrada' });
  }
  
  // Verificar permisos
  if (orden.user !== req.user.userId) {
    return res.status(403).json({ error: 'No tienes permiso para ver esta orden' });
  }
  
  res.json(orden);
}));

// GET /api/ordenes/:ordenId - Obtener orden por ID
router.get('/:ordenId', authMiddleware, asyncH(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.ordenId)) {
    return res.status(400).json({ error: 'ID de orden inválido' });
  }

  const orden = await Orden.findById(req.params.ordenId);
  
  if (!orden) {
    return res.status(404).json({ error: 'Orden no encontrada' });
  }
  
  // Verificar que el usuario solo pueda ver sus propias órdenes
  if (orden.user !== req.user.userId) {
    return res.status(403).json({ error: 'No tienes permiso para ver esta orden' });
  }
  
  if (!orden) {
    return res.status(404).json({ error: 'Orden no encontrada' });
  }
  
  res.json(orden);
}));

// PATCH /api/ordenes/:ordenId/estado - Actualizar estado de la orden
router.patch('/:ordenId/estado', asyncH(async (req, res) => {
  const { estado } = req.body;
  
  if (!['pendiente', 'aceptada', 'rechazada', 'cancelada'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  const orden = await Orden.findByIdAndUpdate(
    req.params.ordenId,
    { estado },
    { new: true }
  );

  if (!orden) {
    return res.status(404).json({ error: 'Orden no encontrada' });
  }

  res.json(orden);
}));

module.exports = router;
