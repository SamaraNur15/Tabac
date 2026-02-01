// Script para poblar la base de datos con datos de ejemplo para testing de métricas
// Ejecutar desde la carpeta backend: node scripts/seedMetricsData.js

const mongoose = require('mongoose');
const path = require('path');

// Cargar variables de entorno desde la carpeta backend
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Orden = require('../models/orden');
const Comida = require('../models/comida');
const Reserva = require('../models/Reserva');

async function seedMetricsData() {
  try {
    // Usar MONGO_URI del .env (igual que en database.js)
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('❌ Error: MONGO_URI no está definida en el archivo .env');
      console.log('Asegúrate de tener un archivo .env en la carpeta backend con:');
      console.log('MONGO_URI=tu_uri_de_mongodb');
      process.exit(1);
    }

    // Conectar a MongoDB
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Obtener productos existentes
    const comidas = await Comida.find().limit(10);
    if (comidas.length === 0) {
      console.log('❌ No hay productos en la base de datos. Crea algunos primero.');
      process.exit(1);
    }

    console.log(`📦 Encontrados ${comidas.length} productos`);

    // Generar órdenes de los últimos 30 días
    const ordenesCreadas = [];
    const hoy = new Date();

    for (let dia = 30; dia >= 0; dia--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - dia);

      // 5-15 órdenes por día
      const ordenesDelDia = Math.floor(Math.random() * 11) + 5;

      for (let i = 0; i < ordenesDelDia; i++) {
        // Hora aleatoria entre 12:00 y 23:00
        const hora = Math.floor(Math.random() * 11) + 12;
        const minuto = Math.floor(Math.random() * 60);
        fecha.setHours(hora, minuto, 0, 0);

        // 2-5 items por orden
        const cantidadItems = Math.floor(Math.random() * 4) + 2;
        const items = [];
        let subtotal = 0;

        for (let j = 0; j < cantidadItems; j++) {
          const comida = comidas[Math.floor(Math.random() * comidas.length)];
          const cantidad = Math.floor(Math.random() * 3) + 1;
          const itemSubtotal = comida.precio * cantidad;
          subtotal += itemSubtotal;

          items.push({
            comida: comida._id,
            nombre: comida.nombre,
            precio: comida.precio,
            imagen: comida.imagen,
            categoria: comida.categoria,
            cantidad,
            subtotal: itemSubtotal
          });
        }

        // Método de pago aleatorio
        const metodosPago = ['efectivo', 'tarjeta', 'transferencia'];
        const metodoPago = metodosPago[Math.floor(Math.random() * metodosPago.length)];

        // Mesa aleatoria (opcional)
        const mesaAsignada = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : null;

        const orden = new Orden({
          clienteInvitado: {
            nombre: `Cliente ${i + 1}`,
            email: `cliente${i}@ejemplo.com`,
            telefono: `555-${String(i).padStart(4, '0')}`
          },
          items,
          entrega: {
            modo: Math.random() > 0.7 ? 'delivery' : 'retiro',
            direccion: Math.random() > 0.7 ? 'Calle Ejemplo 123' : null
          },
          totales: {
            subtotal,
            descuentos: 0,
            delivery: 0,
            total: subtotal
          },
          total: subtotal,
          estado: 'aceptada',
          horaCreacion: new Date(fecha),
          mesaAsignada,
          metodoPago,
          numero: `ORD-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${String(i + 1).padStart(5, '0')}`
        });

        ordenesCreadas.push(orden);
      }
    }

    // Guardar órdenes
    await Orden.insertMany(ordenesCreadas);
    console.log(`✅ Creadas ${ordenesCreadas.length} órdenes de ejemplo`);

    // Generar reservas para los próximos 7 días
    const reservasCreadas = [];
    
    for (let dia = 0; dia <= 7; dia++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + dia);
      fecha.setHours(0, 0, 0, 0);

      // 3-8 reservas por día
      const reservasDelDia = Math.floor(Math.random() * 6) + 3;

      for (let i = 0; i < reservasDelDia; i++) {
        // Hora aleatoria entre 12:00 y 23:00
        const hora = Math.floor(Math.random() * 11) + 12;
        const minuto = Math.random() > 0.5 ? '00' : '30';
        const horaStr = `${String(hora).padStart(2, '0')}:${minuto}`;

        // Mesa aleatoria
        const mesa = Math.floor(Math.random() * 20) + 1;

        // Estado aleatorio
        const estados = ['pendiente', 'confirmada', 'cancelada'];
        const estado = estados[Math.floor(Math.random() * estados.length)];

        const reserva = new Reserva({
          mesa,
          fecha,
          hora: horaStr,
          cliente: {
            nombre: `Cliente Reserva ${i + 1}`,
            telefono: `555-${String(i).padStart(4, '0')}`,
            email: `reserva${i}@ejemplo.com`
          },
          personas: Math.floor(Math.random() * 6) + 2,
          estado,
          notas: Math.random() > 0.7 ? 'Celebración especial' : ''
        });

        reservasCreadas.push(reserva);
      }
    }

    // Guardar reservas (evitando duplicados)
    for (const reserva of reservasCreadas) {
      try {
        const disponible = await Reserva.verificarDisponibilidad(
          reserva.mesa,
          reserva.fecha,
          reserva.hora
        );
        if (disponible) {
          await reserva.save();
        }
      } catch (err) {
        // Ignorar duplicados
      }
    }

    console.log(`✅ Creadas ${reservasCreadas.length} reservas de ejemplo`);

    console.log('\n🎉 Datos de ejemplo cargados exitosamente');
    console.log('\n📊 Ahora puedes probar:');
    console.log('   - /admin/reportes - Ver métricas y gráficos');
    console.log('   - /admin/reservas - Ver calendario de reservas');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedMetricsData();
