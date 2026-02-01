// routes/ordenRoutes.js
const { Router } = require('express');
const mongoose = require('mongoose');
const Orden = require('../models/orden');
const Usuario = require('../models/Usuario');
const { authMiddleware } = require('../middleware/auth');

const router = Router();
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);


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
