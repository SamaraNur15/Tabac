// Script para decodificar y ver el contenido de un JWT
const jwt = require('jsonwebtoken');

// Pega tu token aquí
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTIzYmM2NWVjMDU1OWE4MTlmMWRkOTciLCJlbWFpbCI6ImFkbWluQHRhYmFjLmNvbSIsIm5vbWJyZSI6IkFkbWluIFByaW5jaXBhbCIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzYzOTUxMjk0LCJleHAiOjE3NjQ1NTYwOTR9.7zhJj35-O-NeC-Gq8k0p2Pry4tFCwA9Htvxs9tExM54';

try {
  // Decodificar sin verificar (solo para debug)
  const decoded = jwt.decode(token);
  
  console.log('📋 Contenido del token:');
  console.log(JSON.stringify(decoded, null, 2));
  console.log('\n👤 Usuario:', decoded.nombre);
  console.log('📧 Email:', decoded.email);
  console.log('🎭 Rol:', decoded.rol);
  console.log('⏰ Expira:', new Date(decoded.exp * 1000).toLocaleString());
} catch (error) {
  console.error('❌ Error al decodificar:', error.message);
}
