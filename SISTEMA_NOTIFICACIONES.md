# Sistema de Notificaciones Persistentes

## Descripción
Sistema de notificaciones en tiempo real con persistencia en base de datos que permite a los administradores y cajeros ver notificaciones incluso si no estaban conectados cuando se generaron.

## Características

### 1. Notificaciones Persistentes
- **Almacenamiento en MongoDB**: Todas las notificaciones se guardan en la colección `notificaciones`
- **Carga al iniciar sesión**: Al conectarse, los usuarios cargan automáticamente sus notificaciones no leídas
- **Expiración automática**: Las notificaciones expiran después de 7 días por defecto

### 2. Tipos de Notificaciones
- `nueva_orden` - Nueva orden pendiente (para admin y cajero)
- `cambio_estado` - Cambio de estado de orden
- `nueva_reserva` - Nueva reserva creada (para admin y cajero)
- `cambio_estado_reserva` - Cambio en estado de reserva
- `stock_bajo` - Alerta de stock bajo (solo admin)
- `sistema` - Notificaciones del sistema

### 3. Control de Lectura
- **Por usuario**: Cada notificación mantiene registro de qué usuarios la han leído
- **Contador de no leídas**: Badge en tiempo real con cantidad de notificaciones pendientes
- **Marcar como leída**: Individual o todas a la vez

## Modelo de Datos

```javascript
{
  roles: ['admin', 'cajero'],           // A quién va dirigida
  tipo: 'nueva_orden',                   // Tipo de notificación
  titulo: '🆕 Nueva Orden',              // Título con emoji
  mensaje: 'Orden 1234 recibida...',    // Mensaje descriptivo
  entidadTipo: 'orden',                  // Tipo de entidad relacionada
  entidadId: ObjectId('...'),            // ID de la entidad
  metadata: { ... },                     // Datos adicionales
  leidaPor: [                            // Control de lectura
    { usuarioId: '123', fechaLectura: Date }
  ],
  activa: true,                          // Estado de la notificación
  expiraEn: Date,                        // Fecha de expiración (7 días)
  createdAt: Date,                       // Fecha de creación
  updatedAt: Date                        // Última actualización
}
```

## API Endpoints

### GET /api/notificaciones
Obtiene notificaciones no leídas del usuario autenticado.

**Autenticación**: Requerida (JWT)

**Respuesta**:
```json
{
  "success": true,
  "notificaciones": [...],
  "count": 5
}
```

### PUT /api/notificaciones/:id/leer
Marca una notificación específica como leída.

**Autenticación**: Requerida (JWT)

**Respuesta**:
```json
{
  "success": true,
  "message": "Notificación marcada como leída"
}
```

### PUT /api/notificaciones/leer-todas
Marca todas las notificaciones del usuario como leídas.

**Autenticación**: Requerida (JWT)

**Respuesta**:
```json
{
  "success": true,
  "message": "5 notificaciones marcadas como leídas"
}
```

### DELETE /api/notificaciones/limpiar
Limpia notificaciones expiradas (solo admin).

**Autenticación**: Requerida (JWT) + Rol Admin

**Respuesta**:
```json
{
  "success": true,
  "message": "10 notificaciones limpiadas"
}
```

## Flujo de Funcionamiento

### 1. Usuario NO Conectado
```
Cliente hace pedido
     ↓
Backend crea orden
     ↓
Se guarda notificación en DB + Se emite por WebSocket
     ↓
Notificación persiste en DB esperando ser leída
```

### 2. Admin/Cajero Inicia Sesión
```
Usuario hace login
     ↓
Frontend carga notificaciones históricas vía GET /api/notificaciones
     ↓
Se muestran en el panel de notificaciones con badge
     ↓
Usuario conecta WebSocket para recibir nuevas en tiempo real
```

### 3. Usuario Lee Notificación
```
Usuario hace click en notificación
     ↓
Frontend envía PUT /api/notificaciones/:id/leer
     ↓
Backend actualiza array leidaPor
     ↓
Badge se actualiza, notificación se marca como leída
```

## Implementación Frontend

### Hook useNotifications
```javascript
const {
  notificaciones,      // Array de notificaciones
  conectado,           // Estado de conexión WebSocket
  noLeidas,            // Contador de no leídas
  marcarComoLeida,     // Función para marcar individual
  marcarTodasComoLeidas, // Función para marcar todas
  eliminarNotificacion // Función para eliminar
} = useNotifications();
```

### Componente NotificationCenter
- Badge con contador de no leídas
- Dropdown con lista de notificaciones
- Indicador de conexión WebSocket
- Navegación automática según tipo de notificación
- Timestamps relativos ("Hace 5 min", "Ayer", etc.)

## Mantenimiento

### Limpieza de Notificaciones Expiradas
Las notificaciones expiran automáticamente después de 7 días. Para limpiarlas:

**Opción 1: Desde la API**
```bash
curl -X DELETE http://localhost:3000/api/notificaciones/limpiar \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

**Opción 2: Cron Job (Recomendado)**
Crear un script que ejecute la limpieza diariamente:

```javascript
// backend/scripts/cleanupNotifications.js
const mongoose = require('mongoose');
const Notificacion = require('../models/Notificacion');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await Notificacion.limpiarExpiradas();
  console.log(`✅ ${result.modifiedCount} notificaciones limpiadas`);
  process.exit(0);
});
```

## Ventajas del Sistema

✅ **Persistencia**: Las notificaciones no se pierden si el usuario no está conectado
✅ **Escalabilidad**: Base de datos maneja el almacenamiento, WebSocket maneja tiempo real
✅ **Control granular**: Cada usuario tiene su propio estado de lectura
✅ **Performance**: Solo se cargan notificaciones no leídas al inicio
✅ **Expiración automática**: Las notificaciones antiguas se limpian automáticamente
✅ **Tiempo real**: Usuarios conectados reciben notificaciones instantáneamente

## Solución de Problemas

### No aparecen notificaciones históricas
- Verificar que el token JWT sea válido
- Revisar en MongoDB que existan notificaciones sin leer para ese rol
- Verificar logs del backend: "📥 Cargadas X notificaciones históricas"

### Las notificaciones no se marcan como leídas
- Verificar que el ID de la notificación sea correcto
- Comprobar que req.user.id esté disponible en el backend
- Revisar logs de la consola del navegador

### Notificaciones duplicadas
- Asegurarse de que el componente NotificationCenter no se monte múltiples veces
- Verificar que no haya múltiples conexiones WebSocket activas

### Performance lenta con muchas notificaciones
- Ejecutar limpieza de notificaciones expiradas
- Considerar agregar paginación si hay más de 100 notificaciones por usuario
- Verificar índices en MongoDB (ya creados automáticamente)

## Próximas Mejoras

- [ ] Paginación para usuarios con muchas notificaciones
- [ ] Filtros por tipo de notificación
- [ ] Configuración de tiempo de expiración por usuario
- [ ] Notificaciones por email para casos críticos
- [ ] Sonido personalizado por tipo de notificación
- [ ] Push notifications (navegador)
