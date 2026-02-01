// createTestOrders.js - Script para crear órdenes de prueba
require('dotenv').config();
const mongoose = require('mongoose');
const Orden = require('./models/orden');
const Comida = require('./models/comida');

const connectDB = require('./config/database');

async function createTestOrders() {
  try {
    await connectDB();
    
    // Obtener algunos productos de la base de datos
    const productos = await Comida.find().limit(5);
    
    if (productos.length === 0) {
      console.log('❌ No hay productos en la base de datos');
      return;
    }

    console.log(`✅ Encontrados ${productos.length} productos`);

    // Crear 5 órdenes de prueba
    const ordenes = [];
    
    for (let i = 0; i < 5; i++) {
      // Seleccionar 2-3 productos aleatorios
      const numItems = Math.floor(Math.random() * 2) + 2;
      const items = [];
      let total = 0;

      for (let j = 0; j < numItems; j++) {
        const producto = productos[Math.floor(Math.random() * productos.length)];
        const cantidad = Math.floor(Math.random() * 3) + 1;
        const subtotal = producto.precio * cantidad;
        
        items.push({
          comida: producto._id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          categoria: producto.categoria,
          cantidad: cantidad,
          subtotal: subtotal
        });
        
        total += subtotal;
      }

      const orden = {
        clienteInvitado: {
          nombre: `Cliente ${i + 1}`,
          email: `cliente${i + 1}@test.com`,
          telefono: `123456789${i}`
        },
        items: items,
        entrega: {
          modo: Math.random() > 0.5 ? 'retiro' : 'delivery',
          direccion: Math.random() > 0.5 ? 'Calle Falsa 123' : null,
          notas: i % 2 === 0 ? 'Sin cebolla' : null
        },
        totales: {
          subtotal: total,
          descuentos: 0,
          delivery: Math.random() > 0.5 ? 500 : 0,
          total: total + (Math.random() > 0.5 ? 500 : 0)
        },
        total: total + (Math.random() > 0.5 ? 500 : 0),
        estado: ['pendiente', 'aceptada', 'rechazada'][Math.floor(Math.random() * 3)],
        numero: `ORD-${Date.now()}-${String(i + 1).padStart(5, '0')}`,
        pago: {
          metodo: 'simulado',
          estado: 'aprobado',
          pagadaEn: new Date()
        }
      };

      ordenes.push(orden);
    }

    // Insertar órdenes
    const resultado = await Orden.insertMany(ordenes);
    
    console.log(`✅ Creadas ${resultado.length} órdenes de prueba:`);
    resultado.forEach(orden => {
      console.log(`  - ${orden.numero} | ${orden.estado} | $${orden.total.toFixed(2)}`);
    });

    console.log('\n🎉 Órdenes de prueba creadas exitosamente');

  } catch (error) {
    console.error('❌ Error al crear órdenes:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createTestOrders();
