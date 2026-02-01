# Sistema de Roles - FASE 2 Completada

## ✅ Componentes Implementados

### Backend

1. **`models/Usuario.js`** - Modelo actualizado con sistema de roles
   - Campo `rol`: enum ['admin', 'cajero']
   - Valor por defecto: 'cajero'
   - Índice agregado para consultas rápidas

2. **`middleware/roleAuth.js`** - Middleware de autorización por rol
   - `requireRole(roles)`: Verifica que el usuario tenga uno de los roles permitidos
   - Retorna 403 si el usuario no tiene permisos
   - Requiere que el usuario esté autenticado primero (usa authMiddleware)

3. **`utils/jwt.js`** - Token JWT actualizado
   - Ahora incluye el `rol` del usuario en el payload
   - Permite al frontend conocer el rol sin hacer peticiones adicionales

4. **`routes/authRoutes.js`** - Rutas actualizadas
   - POST `/api/auth/register` - Ahora acepta campo `rol` opcional
   - Protegida con `requireRole(['admin'])` - solo admin puede crear cuentas
   - POST `/api/auth/login` - Retorna `rol` en la respuesta
   - El token JWT incluye el rol del usuario

### Estructura de Roles

#### Admin 👑
- **Permisos**: Acceso total al sistema
- **Puede**:
  - Crear cuentas de staff (admin y cajero)
  - Gestionar usuarios
  - Ver y modificar todas las órdenes
  - Acceder al panel de administración completo
  - Gestionar inventario (FASE 4)
  - Ver reportes y métricas (FASE 5)

#### Cajero 💼
- **Permisos**: Operaciones del día a día
- **Puede**:
  - Ver órdenes activas
  - Cambiar estados de órdenes (creada → pagada)
  - Procesar pagos
  - Ver su propio perfil
- **No puede**:
  - Crear cuentas de staff
  - Modificar roles de usuarios
  - Acceder a configuraciones del sistema

## 🔄 Flujos Actualizados

### Flujo de Registro (Solo Admin)
1. Admin inicia sesión
2. Va a la sección de gestión de usuarios
3. Crea nueva cuenta de staff:
   - Nombre, email, password
   - Selecciona rol: admin o cajero
4. Sistema valida que el solicitante sea admin
5. Crea la cuenta con el rol asignado

### Flujo de Login
1. Usuario ingresa credenciales
2. Sistema valida y retorna:
   - Token JWT (con rol incluido)
   - Datos del usuario (incluyendo rol)
3. Frontend redirige según rol:
   - **Admin/Cajero** → `/admin/dashboard` (FASE 3)
   - **Sin autenticar** → `/carta` (compra como invitado)

## 🔒 Protección de Rutas

### Rutas Protegidas por Rol

```javascript
// Solo Admin
POST /api/auth/register - Crear cuentas de staff
PUT /api/usuarios/:id/rol - Cambiar rol de usuario (FASE 3)
DELETE /api/usuarios/:id - Eliminar usuarios (FASE 3)

// Admin y Cajero
GET /api/ordenes/todas - Ver todas las órdenes (FASE 3)
PUT /api/ordenes/:id/estado - Cambiar estado de orden (FASE 3)
GET /api/admin/dashboard - Acceder al panel (FASE 3)

// Sin autenticación requerida
POST /api/orders/guest - Crear orden como invitado
GET /api/comidas - Ver menú
```

## 🧪 Cómo Probar

### 1. Crear primer usuario Admin (manual en MongoDB)
```javascript
// Conectar a MongoDB y ejecutar:
db.usuarios.insertOne({
  nombre: "Admin Principal",
  email: "admin@tabac.com",
  password: "$2b$10$...", // Hash de "Admin123!" usando bcrypt
  rol: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

O usando bcrypt en Node.js:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('Admin123!', 10);
console.log(hash); // Copiar este hash al insertOne
```

### 2. Login como Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tabac.com","password":"Admin123!"}'
```

Respuesta:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "nombre": "Admin Principal",
    "email": "admin@tabac.com",
    "rol": "admin"
  }
}
```

### 3. Crear usuario Cajero (usando token de Admin)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_ADMIN" \
  -d '{
    "nombre": "Juan Cajero",
    "email": "cajero@tabac.com",
    "password": "Cajero123!",
    "rol": "cajero"
  }'
```

### 4. Intentar registro sin ser Admin (debería fallar)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Hacker",
    "email": "hacker@test.com",
    "password": "123456"
  }'
```

Respuesta esperada:
```json
{
  "error": "Token no proporcionado"
}
```

## 📋 Próximas Implementaciones

### FASE 3: Panel de Administración (siguiente)
- Vista de órdenes activas (admin y cajero)
- Cambio de estados de órdenes
- Vista detallada de cada orden
- Filtros por estado, fecha, cliente
- Búsqueda de órdenes
- Estadísticas en tiempo real

### FASE 4: Gestión de Inventario
- CRUD de productos (solo admin)
- Control de stock
- Alertas de bajo inventario
- Historial de movimientos

### FASE 5: Métricas y Reportes
- Dashboard con gráficos
- Ventas por período
- Productos más vendidos
- Reportes exportables

## 🎯 Estado Actual

✅ Modelo Usuario con campo `rol`  
✅ Middleware `requireRole` creado  
✅ JWT actualizado con rol en payload  
✅ Ruta de registro protegida (solo admin)  
✅ Login retorna rol del usuario  
✅ Estructura base para autorización por rol  

**Pendiente Frontend**:
- Componente de registro de staff (solo visible para admin)
- Redirección según rol después del login
- Protección de rutas en React Router
- Panel de administración (FASE 3)

🟢 **Backend FASE 2 COMPLETA - Listo para implementar frontend**
