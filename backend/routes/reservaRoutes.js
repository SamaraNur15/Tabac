const express = require('express');
const router = express.Router();
const Reserva = require('../models/Reserva');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { notificarNuevaReserva, notificarCambioReserva } = require('../utils/notificaciones');

// GET /api/reservas - Obtener todas las reservas (admin/cajero)
router.get('/', authMiddleware, requireRole(['admin', 'cajero']), async (req, res) => {
  try {
    const { fecha, estado, mesa } = req.query;
    
    const filtros = {};
    
    if (fecha) {
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);
      
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);
      
      filtros.fecha = { $gte: fechaInicio, $lte: fechaFin };
    }
    
    if (estado) {
      filtros.estado = estado;
    }
    
    if (mesa) {
      filtros.mesa = parseInt(mesa);
    }

    const reservas = await Reserva.find(filtros)
      .sort({ fecha: 1, hora: 1 });

    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// GET /api/reservas/disponibilidad - Verificar disponibilidad de mesas en una fecha
router.get('/disponibilidad', async (req, res) => {
  try {
    const { fecha } = req.query;
    
    if (!fecha) {
      return res.status(400).json({ error: 'Fecha requerida' });
    }

    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    const reservas = await Reserva.find({
      fecha: { $gte: fechaInicio, $lte: fechaFin },
      estado: { $in: ['pendiente', 'confirmada'] }
    });

    // Crear objeto con disponibilidad por mesa y hora
    const disponibilidad = {};
    
    // Horarios disponibles (ejemplo: de 12:00 a 23:00)
    const horarios = [];
    for (let h = 12; h <= 23; h++) {
      horarios.push(`${h.toString().padStart(2, '0')}:00`);
      if (h < 23) horarios.push(`${h.toString().padStart(2, '0')}:30`);
    }

    // Inicializar todas las mesas como disponibles
    for (let mesa = 1; mesa <= 20; mesa++) {
      disponibilidad[mesa] = {};
      horarios.forEach(hora => {
        disponibilidad[mesa][hora] = true;
      });
    }

    // Marcar mesas ocupadas
    reservas.forEach(reserva => {
      if (disponibilidad[reserva.mesa] && disponibilidad[reserva.mesa][reserva.hora] !== undefined) {
        disponibilidad[reserva.mesa][reserva.hora] = false;
      }
    });

    res.json({ disponibilidad, horarios });
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({ error: 'Error al verificar disponibilidad' });
  }
});

// POST /api/reservas - Crear nueva reserva
router.post('/', async (req, res) => {
  try {
    const { mesa, fecha, hora, cliente, personas, notas } = req.body;

    // Validaciones
    if (!mesa || !fecha || !hora || !cliente?.nombre || !cliente?.telefono || !personas) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Verificar disponibilidad
    const disponible = await Reserva.verificarDisponibilidad(mesa, fecha, hora);
    
    if (!disponible) {
      return res.status(400).json({ 
        error: 'Mesa no disponible',
        message: `La mesa ${mesa} ya está reservada para ${hora} en esta fecha`
      });
    }

    const nuevaReserva = new Reserva({
      mesa,
      fecha: new Date(fecha),
      hora,
      cliente,
      personas,
      notas,
      estado: 'pendiente'
    });

    await nuevaReserva.save();

    // Emitir notificación en tiempo real
    const io = req.app.get('io');
    if (io) {
      notificarNuevaReserva(io, nuevaReserva);
    }

    res.status(201).json({
      message: 'Reserva creada exitosamente',
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// PUT /api/reservas/:id - Actualizar reserva
router.put('/:id', authMiddleware, requireRole(['admin', 'cajero']), async (req, res) => {
  try {
    const { id } = req.params;
    const { mesa, fecha, hora, cliente, personas, estado, notas } = req.body;

    const reserva = await Reserva.findById(id);
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Si se está cambiando mesa, fecha u hora, verificar disponibilidad
    if ((mesa && mesa !== reserva.mesa) || 
        (fecha && new Date(fecha).getTime() !== reserva.fecha.getTime()) || 
        (hora && hora !== reserva.hora)) {
      
      const mesaFinal = mesa || reserva.mesa;
      const fechaFinal = fecha || reserva.fecha;
      const horaFinal = hora || reserva.hora;
      
      const disponible = await Reserva.verificarDisponibilidad(
        mesaFinal, 
        fechaFinal, 
        horaFinal,
        id
      );
      
      if (!disponible) {
        return res.status(400).json({ 
          error: 'Mesa no disponible',
          message: `La mesa ${mesaFinal} ya está reservada para ${horaFinal} en esta fecha`
        });
      }
    }

    // Actualizar campos
    if (mesa) reserva.mesa = mesa;
    if (fecha) reserva.fecha = new Date(fecha);
    if (hora) reserva.hora = hora;
    if (cliente) reserva.cliente = { ...reserva.cliente, ...cliente };
    if (personas) reserva.personas = personas;
    if (estado) reserva.estado = estado;
    if (notas !== undefined) reserva.notas = notas;

    await reserva.save();

    // Emitir notificación de cambio
    const io = req.app.get('io');
    if (io) {
      const accion = estado === 'confirmada' ? 'confirmada' : estado === 'cancelada' ? 'cancelada' : 'modificada';
      notificarCambioReserva(io, reserva, accion);
    }

    res.json({
      message: 'Reserva actualizada exitosamente',
      reserva
    });
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({ error: 'Error al actualizar reserva' });
  }
});

// DELETE /api/reservas/:id - Cancelar/eliminar reserva
router.delete('/:id', authMiddleware, requireRole(['admin', 'cajero']), async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findById(id);
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Marcar como cancelada en lugar de eliminar
    reserva.estado = 'cancelada';
    await reserva.save();

    // Emitir notificación de cancelación
    const io = req.app.get('io');
    if (io) {
      notificarCambioReserva(io, reserva, 'cancelada');
    }

    res.json({
      message: 'Reserva cancelada exitosamente',
      reserva
    });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
});

module.exports = router;
