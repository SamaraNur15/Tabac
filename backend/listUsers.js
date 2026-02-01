// backend/listUsers.js
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
require('dotenv').config();

/**
 * Script para listar todos los usuarios del sistema
 * Uso: node listUsers.js
 */

async function listUsers() {
  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener todos los usuarios
    const usuarios = await Usuario.find().select('-password').sort({ createdAt: -1 });

    if (usuarios.length === 0) {
      console.log('📭 No hay usuarios registrados en el sistema\n');
      process.exit(0);
    }

    console.log(`📋 Lista de usuarios (${usuarios.length} encontrados):\n`);
    console.log('─'.repeat(80));

    usuarios.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.nombre}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Rol: ${user.rol}`);
      console.log(`   🆔 ID: ${user._id}`);
      console.log(`   📅 Creado: ${new Date(user.createdAt).toLocaleString('es-AR')}`);
      console.log('   ' + '─'.repeat(75));
    });

    console.log('\n💡 Para resetear contraseña usa:');
    console.log('   node resetAdminPassword.js <email> <nueva-contraseña>\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al listar usuarios:', error.message);
    process.exit(1);
  }
}

listUsers();
