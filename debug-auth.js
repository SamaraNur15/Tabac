// Script de prueba para verificar el estado de autenticación
// Copia y pega esto en la consola del navegador después de iniciar sesión

console.log('=== DEBUG AUTH ===');
console.log('Token:', localStorage.getItem('tabac_auth_token'));
console.log('User Data:', localStorage.getItem('tabac_user_data'));
console.log('User Object:', JSON.parse(localStorage.getItem('tabac_user_data') || 'null'));
console.log('==================');
