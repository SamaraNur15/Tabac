const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// lee el .env que está al lado de app.js, sin importar desde dónde ejecutes node
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/database');

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173,https://tabacweb.vercel.app')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // permitir requests sin Origin (Postman, curl)
  return allowedOrigins.includes(origin);
};

// Configurar Socket.IO con CORS
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Conexión a MongoDB
connectDB();

// Middlewares de seguridad
// Helmet agrega headers de seguridad HTTP
app.use(helmet());

// CORS configurado (ajusta el origin según tu frontend)
const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting general - límite de peticiones por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // máximo 500 requests por ventana (aumentado para desarrollo)
  message: { error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Rate limiting estricto para rutas de autenticación
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5, // máximo 5 intentos de login
  message: { error: 'Demasiados intentos de login, intenta de nuevo en 1 minuto' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Body parser
app.use(express.json());


// Archivos estáticos
//app.use(express.static(path.join(__dirname, 'public')));


// Home
//app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, 'public', 'carta.html'));
//});



// Rutas
const authRoutes = require('./routes/authRoutes');
const comidaRoutes = require('./routes/comidaRoutes');
const ordenRoutes = require('./routes/ordenRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');

// Middleware de autenticación para Socket.IO (permite conexiones públicas)
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  // Si hay token, validarlo
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Guardar usuario autenticado
      socket.isAuthenticated = true;
    } catch (error) {
      console.warn('⚠️ Token inválido, continuando como público');
      socket.isAuthenticated = false;
    }
  } else {
    // Sin token = usuario público (para seguimiento de órdenes)
    socket.isAuthenticated = false;
  }
  
  next(); // Permitir conexión siempre
});

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
  if (socket.isAuthenticated) {
    const user = socket.user;
    console.log(`✅ Usuario autenticado conectado: ${user.nombre} (${user.rol})`);

    // Unir al usuario a una sala según su rol
    socket.join(`role_${user.rol}`);
    socket.join(`user_${user.id}`);

    // Evento de desconexión
    socket.on('disconnect', () => {
      console.log(`❌ Usuario desconectado: ${user.nombre}`);
    });
  } else {
    console.log(`✅ Usuario público conectado (seguimiento de orden)`);
    
    // Evento de desconexión
    socket.on('disconnect', () => {
      console.log(`❌ Usuario público desconectado`);
    });
  }
});

// Hacer io accesible en todas las rutas
app.set('io', io);

// Aplicar rate limiter a rutas de autenticación
app.use('/api/auth', authLimiter, authRoutes);

// Otras rutas
app.use('/api/comidas', comidaRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API Tabac Web funcionando 🚀');
});

// Arranque del servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🔌 WebSocket listo para notificaciones`);
});

app.get("/api/products", async(req, res) => {
    try {
        const productos = await require("./models/comida").find();
        res.json(productos);
    } catch (err) {
        console.error("Error obteniendo productos:", err);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});