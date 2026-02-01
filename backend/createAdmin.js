// Script para generar hash de password y crear usuario admin
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const Usuario = require('./models/Usuario');

async function crearAdminInicial() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ rol: 'admin' });
    if (adminExistente) {
      console.log('⚠️  Ya existe un usuario admin:', adminExistente.email);
      process.exit(0);
    }

    // Crear el admin
    const adminData = {
      nombre: 'Admin Principal',
      email: 'admin@tabac.com',
      password: 'Admin123!',
      rol: 'admin'
    };

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Crear el usuario
    const nuevoAdmin = new Usuario(adminData);
    await nuevoAdmin.save();

    console.log('✅ Usuario admin creado exitosamente');
    console.log('📧 Email:', 'admin@tabac.com');
    console.log('🔑 Password:', 'Admin123!');
    console.log('👤 Rol:', 'admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

crearAdminInicial();
