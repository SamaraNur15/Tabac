// backend/resetAdminPassword.js
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
require('dotenv').config();

/**
 * Script para resetear la contraseña del administrador
 * Uso: node resetAdminPassword.js <email> <nueva-contraseña>
 */

async function resetPassword() {
  try {
    // Obtener argumentos de línea de comandos
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log('\n❌ Faltan argumentos');
      console.log('📋 Uso: node resetAdminPassword.js <email> <nueva-contraseña>');
      console.log('📋 Ejemplo: node resetAdminPassword.js admin@tabac.com miNuevaContraseña123\n');
      process.exit(1);
    }

    const [email, newPassword] = args;

    // Validar contraseña
    if (newPassword.length < 6) {
      console.log('\n❌ La contraseña debe tener al menos 6 caracteres\n');
      process.exit(1);
    }

    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log(`❌ No se encontró ningún usuario con el email: ${email}\n`);
      process.exit(1);
    }

    // Hashear nueva contraseña
    console.log('🔐 Hasheando nueva contraseña...');
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña
    usuario.password = hashedPassword;
    await usuario.save();

    console.log('✅ Contraseña actualizada exitosamente!\n');
    console.log('📧 Email:', usuario.email);
    console.log('👤 Nombre:', usuario.nombre);
    console.log('🔑 Rol:', usuario.rol);
    console.log('🔐 Nueva contraseña:', newPassword);
    console.log('\n⚠️  Guarda esta contraseña en un lugar seguro\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al resetear contraseña:', error.message);
    process.exit(1);
  }
}

resetPassword();
