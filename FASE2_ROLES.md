# FASE 2: Sistema de Roles - Implementación

## ✅ Componentes Implementados

### Backend

#### 1. Modelo Usuario Actualizado (`models/Usuario.js`)
```javascript
{
  nombre: String (required),
  email: String (required, unique, lowercase),
  password: String (required),
  rol: String (enum: ['admin', 'cajero'], default: 'cajero'),
  timestamps: true
}
```

#### 2. Middleware de Autorización (`middleware/authorize.js`)
- **Función**: `authorize(...roles)` - Verifica que el usuario tenga uno de los roles permitidos
- **Uso**: Después del middleware de autenticación
- **Respuestas**:
  - 401: Usuario no autenticado
  - 403: Rol insuficiente
  
**Ejemplo de uso:**
```javascript
router.get('/admin-only', authMiddleware, authorize('admin'), (req, res) => {
  // Solo admins pueden acceder
});

router.get('/staff-only', authMiddleware, authorize('admin', 'cajero'), (req, res) => {
  // Admin o cajero pueden acceder
});
```

#### 3. Rutas de Autenticación Actualizadas (`routes/authRoutes.js`)

**POST `/api/auth/register`** - Registro de staff (PROTEGIDO)
- **Requiere**: Token JWT de admin
- **Autorización**: Solo `admin` puede registrar nuevos usuarios
- **Body**:
  ```json
  {
    "nombre": "Juan Pérez",
    "email": "juan@tabac.com",
    "password": "password123",
    "rol": "cajero" // opcional, default: 'cajero'
  }
  ```
- **Respuesta exitosa (201)**:
  ```json
  {
    "message": "Usuario de staff registrado con éxito ✅",
    "token": "eyJhbGc...",
    "user": {
      "id": "123abc",
      "nombre": "Juan Pérez",
      "email": "juan@tabac.com",
      "rol": "cajero"
    }
  }
  ```

**POST `/api/auth/login`** - Login de staff
- **Body**:
  ```json
  {
    "email": "admin@tabac.com",
    "password": "admin123"
  }
  ```
- **Respuesta exitosa (200)**:
  ```json
  {
    "message": "Login exitoso",
    "token": "eyJhbGc...",
    "user": {
      "id": "123abc",
      "nombre": "Admin",
      "email": "admin@tabac.com",
      "rol": "admin"
    }
  }
  ```

#### 4. JWT Actualizado (`utils/jwt.js`)
- Token incluye campo `rol` en el payload
- Payload completo:
  ```javascript
  {
    userId: "123abc",
    email: "admin@tabac.com",
    nombre: "Admin",
    rol: "admin",
    iat: 1234567890,
    exp: 1234567890
  }
  ```

## 🔐 Jerarquía de Roles

### Admin
- **Permisos**:
  - Registrar nuevos usuarios (admin/cajero)
  - Acceso a todas las funcionalidades
  - Gestionar órdenes
  - Ver métricas y reportes
  
### Cajero
- **Permisos**:
  - Ver órdenes activas
  - Actualizar estado de órdenes
  - Procesar pagos
  - **No puede**: Registrar nuevos usuarios

### Invitado (No autenticado)
- **Permisos**:
  - Ver carta de productos
  - Agregar al carrito (localStorage)
  - Realizar compra sin registro
  - **No puede**: Acceder a panel de administración

## 🧪 Cómo Probar

### 1. Crear primer usuario Admin
Como no hay usuarios todavía, necesitamos crear el primer admin manualmente en MongoDB:

```javascript
// Ejecutar en MongoDB Compass o mongosh
use TabacWeb

// Crear admin (password: admin123)
db.Usuarios.insertOne({
  nombre: "Administrador",
  email: "admin@tabac.com",
  password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7jdxYqX9re", // admin123
  rol: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 2. Login como Admin
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@tabac.com",
  "password": "admin123"
}
```

### 3. Registrar un Cajero (usando token de admin)
```bash
POST http://localhost:3000/api/auth/register
Authorization: Bearer <TOKEN_DEL_ADMIN>
Content-Type: application/json

{
  "nombre": "Cajero 1",
  "email": "cajero@tabac.com",
  "password": "cajero123",
  "rol": "cajero"
}
```

### 4. Intentar registrar sin token (debe fallar)
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Hacker",
  "email": "hacker@tabac.com",
  "password": "hack123"
}

# Respuesta esperada: 401 Unauthorized
```

### 5. Login como Cajero
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "cajero@tabac.com",
  "password": "cajero123"
}
```

## 📋 Próximos Pasos - FASE 3

### Panel de Administración (Frontend)
- Componente de login para staff
- Dashboard según rol
- Vista de órdenes activas
- Gestión de usuarios (solo admin)
- Cambio de estado de órdenes

## 🎯 Estado Actual FASE 2
✅ Modelo Usuario con campo `rol`  
✅ Middleware `authorize` implementado  
✅ Registro protegido (solo admin)  
✅ Login devuelve rol del usuario  
✅ JWT incluye rol en payload  
🟢 **Backend de Roles COMPLETO**

⏳ Pendiente: Frontend para manejo de roles y panel admin
