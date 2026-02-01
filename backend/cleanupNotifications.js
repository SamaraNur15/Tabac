const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Notificacion = require('./models/Notificacion');

/**
 * Script para limpiar notificaciones expiradas
 * Puede ejecutarse manualmente o mediante un cron job
 * 
 * Uso: node cleanupNotifications.js
 */

async function limpiarNotificaciones() {
  try {
    console.log('🧹 Iniciando limpieza de notificaciones...\n');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener estadísticas antes de limpiar
    const totalNotificaciones = await Notificacion.countDocuments();
    const notificacionesActivas = await Notificacion.countDocuments({ activa: true });
    const notificacionesExpiradas = await Notificacion.countDocuments({
      expiraEn: { $lt: new Date() },
      activa: true
    });

    console.log('📊 Estadísticas actuales:');
    console.log(`   Total de notificaciones: ${totalNotificaciones}`);
    console.log(`   Notificaciones activas: ${notificacionesActivas}`);
    console.log(`   Notificaciones expiradas: ${notificacionesExpiradas}\n`);

    if (notificacionesExpiradas === 0) {
      console.log('✨ No hay notificaciones para limpiar\n');
      process.exit(0);
    }

    // Limpiar notificaciones expiradas
    const resultado = await Notificacion.limpiarExpiradas();

    console.log('✅ Limpieza completada:');
    console.log(`   Notificaciones desactivadas: ${resultado.modifiedCount}\n`);

    // Estadísticas después de limpiar
    const nuevasActivas = await Notificacion.countDocuments({ activa: true });
    console.log('📊 Estadísticas finales:');
    console.log(`   Notificaciones activas: ${nuevasActivas}\n`);

    // Opcional: Eliminar físicamente las notificaciones inactivas muy antiguas (más de 30 días)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);

    const eliminadas = await Notificacion.deleteMany({
      activa: false,
      expiraEn: { $lt: fechaLimite }
    });

    if (eliminadas.deletedCount > 0) {
      console.log(`🗑️  Notificaciones eliminadas permanentemente: ${eliminadas.deletedCount}\n`);
    }

    console.log('🎉 Proceso completado exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en la limpieza:', error);
    process.exit(1);
  }
}

// Ejecutar
limpiarNotificaciones();
