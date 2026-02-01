// middleware/roleAuth.js
const authMiddleware = require('./auth');

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 * @param {Array<string>} rolesPermitidos - Array de roles que pueden acceder (ej: ['admin', 'cajero'])
 * @returns {Function} Middleware de Express
 */
const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    // El authMiddleware debe haberse ejecutado antes y haber adjuntado req.user
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debes iniciar sesión para acceder a este recurso' 
      });
    }

    const userRole = req.user.rol;

    // Verificar si el rol del usuario está en la lista de roles permitidos
    if (!rolesPermitidos.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: `No tienes permisos suficientes. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}`,
        tuRol: userRole
      });
    }

    // El usuario tiene el rol adecuado, continuar
    next();
  };
};

module.exports = { requireRole };
