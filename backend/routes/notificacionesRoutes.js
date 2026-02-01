const express = require('express');
const router = express.Router();
const Notificacion = require('../models/Notificacion');
const { authMiddleware } = require('../middleware/auth');

// GET /api/notificaciones - Obtener notificaciones no leídas del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const rol = req.user.rol;

    // Obtener notificaciones no leídas para el rol del usuario
    const notificaciones = await Notificacion.obtenerNoLeidas(usuarioId, rol);

    res.json({
      success: true,
      notificaciones,
      count: notificaciones.length
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificaciones'
    });
  }
});

// PUT /api/notificaciones/leer-todas - Marcar todas como leídas (DEBE IR ANTES DE /:id)
router.put('/leer-todas', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const rol = req.user.rol;

    // Obtener todas las notificaciones no leídas
    const notificaciones = await Notificacion.obtenerNoLeidas(usuarioId, rol);

    // Marcar cada una como leída
    await Promise.all(
      notificaciones.map(notif => notif.marcarComoLeida(usuarioId))
    );

    res.json({
      success: true,
      message: `${notificaciones.length} notificaciones marcadas como leídas`
    });
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar notificaciones'
    });
  }
});

// PUT /api/notificaciones/:id/leer - Marcar una notificación como leída
router.put('/:id/leer', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    const notificacion = await Notificacion.findById(id);

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    await notificacion.marcarComoLeida(usuarioId);

    res.json({
      success: true,
      message: 'Notificación marcada como leída'
    });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar notificación'
    });
  }
});

// DELETE /api/notificaciones/limpiar - Limpiar notificaciones expiradas (admin only)
router.delete('/limpiar', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const resultado = await Notificacion.limpiarExpiradas();

    res.json({
      success: true,
      message: `${resultado.modifiedCount} notificaciones limpiadas`
    });
  } catch (error) {
    console.error('Error al limpiar notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al limpiar notificaciones'
    });
  }
});

module.exports = router;
