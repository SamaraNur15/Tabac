// middleware/authorize.js

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 * Debe usarse DESPUÉS del middleware de autenticación (auth.js)
 * 
 * @param {...string} roles - Lista de roles permitidos
 * @returns Middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado (debería estar en req.user por el middleware auth)
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debes iniciar sesión para acceder a este recurso' 
      });
    }

    // Verificar que el usuario tenga uno de los roles permitidos
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: `Se requiere rol: ${roles.join(' o ')}. Tu rol actual: ${req.user.rol}` 
      });
    }

    // Usuario autorizado, continuar
    next();
  };
};

module.exports = authorize;
