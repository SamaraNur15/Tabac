// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Comida = require('../models/comida');
const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

// Middleware: todas las rutas requieren autenticación y rol de admin o cajero
router.use(authMiddleware);
router.use(requireRole(['admin', 'cajero']));

/**
 * GET /api/admin/dashboard
 * Obtiene métricas básicas del dashboard: productos disponibles, stock bajo
 */
router.get('/dashboard', async (req, res) => {
  try {
    // 1. Productos disponibles
    const productosDisponibles = await Comida.countDocuments({ disponible: true });
    const productosTotal = await Comida.countDocuments();

    // 2. Productos con stock bajo
    const productosStockBajo = await Comida.countDocuments({ 
      disponible: true,
      stock: { $lt: 10 }
    });

    res.json({
      fecha: new Date(),
      productos: {
        disponibles: productosDisponibles,
        total: productosTotal,
        stockBajo: productosStockBajo
      },
      usuario: {
        nombre: req.user.nombre,
        rol: req.user.rol
      }
    });

  } catch (error) {
    console.error('Error al obtener métricas del dashboard:', error);
    res.status(500).json({ 
      error: 'Error del servidor',
      message: 'No se pudieron obtener las métricas' 
    });
  }
});

module.exports = router;
