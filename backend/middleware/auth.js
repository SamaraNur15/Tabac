// middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar token JWT
 * Extrae el token del header Authorization y verifica su validez
 * Agrega la información del usuario a req.user
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Acceso denegado',
        message: 'No se proporcionó token de autenticación' 
      });
    }

    // Extraer el token (formato: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar info del usuario al request para usarlo en las rutas
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      nombre: decoded.nombre,
      rol: decoded.rol
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'El token proporcionado no es válido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente' 
      });
    }

    return res.status(500).json({ 
      error: 'Error de autenticación',
      message: 'Ocurrió un error al verificar el token' 
    });
  }
};

/**
 * Middleware opcional - permite acceso con o sin token
 * Si hay token válido, agrega req.user, si no, continúa sin él
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        nombre: decoded.nombre,
        rol: decoded.rol
      };
    }
    
    next();
  } catch (error) {
    // Si hay error, simplemente continúa sin autenticar
    next();
  }
};

/**
 * Middleware para verificar rol del usuario
 * Debe usarse DESPUÉS de authMiddleware
 * @param {Array<string>} rolesPermitidos - Array de roles permitidos ['admin', 'cajero']
 */
const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    // Verificar que req.user existe (debe pasar por authMiddleware primero)
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debes iniciar sesión para acceder a este recurso' 
      });
    }

    // Verificar si el rol del usuario está en los roles permitidos
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: `Esta acción requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}` 
      });
    }

    next();
  };
};

module.exports = { authMiddleware, optionalAuth, requireRole };
