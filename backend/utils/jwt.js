// utils/jwt.js
const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT para un usuario
 * @param {Object} user - Objeto del usuario con sus datos
 * @returns {String} Token JWT firmado
 */
const generateToken = (user) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    nombre: user.nombre,
    rol: user.rol || 'cajero' // Incluir rol en el token
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d' // 7 días por defecto
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/**
 * Verifica un token JWT
 * @param {String} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
