# FASE 3: Panel de Administración ✅

## Estado: COMPLETADO

### Objetivo
Crear interfaz completa para gestionar el negocio desde un panel de administración.

---

## 🎯 Funcionalidades Implementadas

### Backend

#### 1. Rutas de Admin (`/api/admin/*`)
**Archivo**: `backend/routes/adminRoutes.js`

Todas las rutas están protegidas con:
- `authMiddleware`: Verifica token JWT válido
- `requireRole(['admin', 'cajero'])`: Solo admin y cajero pueden acceder

**Endpoints creados**:

##### GET `/api/admin/dashboard`
Obtiene métricas del negocio:
```json
{
  "fecha": "2025-11-23",
  "ordenesHoy": {
    "total": 5,
    "pendientes": 2,
    "aceptadas": 2,
    "rechazadas": 1
  },
  "ingresos": {
    "hoy": 65600,
    "historico": 140700
  },
  "topProductos": [
    {
      "id": "...",
      "nombre": "Lomito Completo",
      "cantidad": 8,
      "ingresos": 12000
    }
  ]
}
```

##### GET `/api/admin/ordenes/pendientes`
Lista órdenes que requieren aprobación:
```json
{
  "total": 2,
  "ordenes": [...]
}
```

##### GET `/api/admin/ordenes`
Lista todas las órdenes con filtros:
- Query params: `?estado=pendiente&fecha=2025-11-23&limit=50`

##### PATCH `/api/admin/ordenes/:id/estado`
Acepta o rechaza una orden:
```json
{
  "estado": "aceptada",  // o "rechazada"
  "motivoRechazo": "Productos no disponibles"  // solo si rechazada
}
```

#### 2. Modelo Orden Actualizado
**Archivo**: `backend/models/orden.js`

Nuevos campos agregados:
```javascript
{
  estado: {
    type: String,
    enum: ['pendiente', 'aceptada', 'rechazada', 'cancelada'],
    default: 'pendiente'
  },
  motivoRechazo: String,
  procesadaPor: {
    usuario: String,
    rol: String,
    fecha: Date
  },
  total: Number  // Campo directo para consultas rápidas
}
```

**Items de orden**:
```javascript
{
  comida: ObjectId,  // Referencia consistente
  nombre: String,
  precio: Number,
  imagen: String,
  categoria: String,
  cantidad: Number,
  subtotal: Number  // cantidad * precio
}
```

---

### Frontend

#### 1. AdminLayout Component
**Archivos**: 
- `src/comoponents/Admin/AdminLayout.jsx`
- `src/comoponents/Admin/AdminLayout.css`

**Características**:
- ✅ Sidebar plegable con navegación
- ✅ Info del usuario logueado
- ✅ Botón de logout
- ✅ Links a Dashboard, Órdenes, Productos (admin only), Usuarios (admin only)
- ✅ Responsive con overlay en mobile

**Navegación disponible**:
- 📊 Dashboard (`/admin`)
- 📋 Órdenes (`/admin/ordenes`)
- 🍔 Productos (`/admin/productos`) - Solo admin
- 👥 Usuarios (`/admin/usuarios`) - Solo admin
- 🏠 Ir al sitio (`/`)

#### 2. ProtectedRoute Component
**Archivo**: `src/comoponents/Admin/ProtectedRoute.jsx`

Protege rutas verificando:
1. Token existe en localStorage
2. Rol del usuario coincide con `requiredRole`
3. Redirige a `/login` si no autenticado
4. Redirige a `/` si no tiene rol adecuado

Uso:
```jsx
<ProtectedRoute requiredRole={['admin', 'cajero']}>
  <AdminLayout />
</ProtectedRoute>
```

#### 3. AdminDashboard Page
**Archivos**:
- `src/Pages/AdminDashboardPage.jsx`
- `src/Pages/AdminDashboardPage.css`

**Secciones**:

1. **Métricas principales** (4 tarjetas):
   - 📦 Total órdenes hoy
   - ⏳ Órdenes pendientes
   - ✅ Órdenes aceptadas
   - ❌ Órdenes rechazadas

2. **Ingresos** (2 tarjetas):
   - 💰 Ingresos de hoy
   - 💵 Ingresos históricos

3. **Top 5 Productos más vendidos**:
   - Tabla con: Posición, Nombre, Cantidad vendida, Ingresos

4. **Acciones rápidas**:
   - Ver órdenes pendientes (con badge de cantidad)
   - Gestionar productos (solo admin)
   - Gestionar usuarios (solo admin)

**Features**:
- ✅ Botón de actualizar datos
- ✅ Estados de carga con spinner
- ✅ Manejo de errores
- ✅ Fecha actual en español
- ✅ Diseño responsive

#### 4. AdminOrdenes Page
**Archivos**:
- `src/Pages/AdminOrdenesPage.jsx`
- `src/Pages/AdminOrdenesPage.css`

**Características**:

1. **Filtros**:
   - Pendientes
   - Aceptadas
   - Rechazadas

2. **Tarjeta de orden** muestra:
   - Número de orden
   - Estado con badge de color
   - Fecha y hora
   - Datos del cliente (nombre, teléfono, email)
   - Modo de entrega (retiro/delivery)
   - Dirección de entrega (si aplica)
   - Lista de productos con precios
   - Total de la orden
   - Botones de acción (si pendiente)
   - Motivo de rechazo (si rechazada)
   - Info de quien procesó la orden

3. **Acciones**:
   - ✅ Aceptar orden
   - ❌ Rechazar orden (solicita motivo)
   - Estados de "Procesando..." mientras se actualiza

**UX**:
- Confirmación con prompt para motivo de rechazo
- Actualización automática después de acción
- Indicador visual de orden siendo procesada
- Diseño responsive con cards

#### 5. Login Actualizado
**Archivo**: `src/comoponents/Login.jsx`

**Mejora**: Redirige según rol después de login:
```javascript
if (data.user?.rol === 'admin' || data.user?.rol === 'cajero') {
  navigate("/admin");
} else {
  navigate("/carta");
}
```

#### 6. Layout Actualizado
**Archivo**: `src/comoponents/Layout/layout.jsx`

Cambiado de `{children}` a `<Outlet />` para soporte de rutas anidadas.

#### 7. App.jsx - Rutas
**Archivo**: `src/App.jsx`

Estructura de rutas:
```jsx
<Routes>
  {/* Rutas públicas con Layout principal */}
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="carta" element={<CartaPage />} />
    {/* ... otras rutas públicas */}
  </Route>

  {/* Rutas de admin con AdminLayout */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRole={['admin', 'cajero']}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<AdminDashboardPage />} />
    <Route path="ordenes" element={<AdminOrdenesPage />} />
  </Route>
</Routes>
```

---

## 🧪 Pruebas

### Scripts de Prueba Creados

#### 1. `backend/createTestOrders.js`
Crea 5 órdenes de prueba con:
- Productos aleatorios
- Estados aleatorios (pendiente/aceptada/rechazada)
- Clientes de prueba
- Modo de entrega aleatorio

**Uso**:
```bash
cd backend
node createTestOrders.js
```

#### 2. `backend/testAdmin.http`
Colección de requests HTTP para probar endpoints:
- Login admin
- GET dashboard
- GET órdenes pendientes
- GET todas las órdenes
- PATCH aceptar orden
- PATCH rechazar orden

---

## 🚀 Flujo de Uso

### Para Admin/Cajero:

1. **Login**: Ir a `/login`
   - Ingresar: `admin@tabac.com` / `Admin123!`
   - Automáticamente redirige a `/admin`

2. **Dashboard**: Ver métricas del día
   - Órdenes totales, pendientes, aceptadas, rechazadas
   - Ingresos del día e históricos
   - Top 5 productos más vendidos
   - Acciones rápidas

3. **Gestionar Órdenes**: Click en "Órdenes" o badge de pendientes
   - Ver lista de órdenes
   - Filtrar por estado
   - Aceptar orden → Actualiza a "aceptada"
   - Rechazar orden → Solicita motivo → Actualiza a "rechazada"

4. **Cerrar Sesión**: Click en "Cerrar Sesión" en sidebar

---

## 📊 Métricas del Dashboard

### Cálculos realizados:

1. **Órdenes del día**: Filtradas por `createdAt` entre 00:00:00 y 23:59:59 del día actual

2. **Ingresos del día**: Suma de `total` de órdenes con estado "aceptada" del día

3. **Top productos**: Agregación de items de órdenes aceptadas del día, ordenados por cantidad vendida

4. **Ingresos históricos**: Aggregate de todas las órdenes "aceptada" de la colección

---

## 🎨 Diseño

### Paleta de colores:
- Sidebar: `#1e293b` → `#0f172a` (gradiente oscuro)
- Primary: `#3b82f6` (azul)
- Success: `#10b981` (verde)
- Warning: `#f59e0b` (naranja)
- Danger: `#ef4444` (rojo)
- Background: `#f5f7fa` (gris claro)

### Tipografía:
- Headings: 700 bold
- Body: 400-500 normal/medium
- Small text: 0.75rem - 0.875rem

---

## 🔐 Seguridad

### Backend:
- ✅ Todas las rutas protegidas con JWT
- ✅ Verificación de rol admin/cajero
- ✅ Validación de estados permitidos
- ✅ Motivo requerido para rechazos
- ✅ Registro de quién procesó cada orden

### Frontend:
- ✅ ProtectedRoute verifica autenticación
- ✅ Verifica rol antes de mostrar rutas
- ✅ Token en localStorage para requests
- ✅ Redireccionamiento automático si no autorizado

---

## 📦 Archivos Creados

### Backend (7 archivos):
1. `routes/adminRoutes.js` - Rutas del panel admin
2. `models/orden.js` - Modelo actualizado con nuevos campos
3. `createTestOrders.js` - Script de datos de prueba
4. `testAdmin.http` - Colección de pruebas HTTP
5. `debugToken.js` - Utilidad para decodificar tokens JWT

### Frontend (8 archivos):
1. `comoponents/Admin/AdminLayout.jsx`
2. `comoponents/Admin/AdminLayout.css`
3. `comoponents/Admin/ProtectedRoute.jsx`
4. `Pages/AdminDashboardPage.jsx`
5. `Pages/AdminDashboardPage.css`
6. `Pages/AdminOrdenesPage.jsx`
7. `Pages/AdminOrdenesPage.css`

### Archivos Modificados:
1. `backend/app.js` - Registro de rutas admin
2. `backend/models/orden.js` - Campos actualizados
3. `frontend-react/src/App.jsx` - Rutas de admin
4. `frontend-react/src/comoponents/Login.jsx` - Redirección por rol
5. `frontend-react/src/comoponents/Layout/layout.jsx` - Soporte Outlet

---

## ✅ Testing Checklist

- [x] Login con admin redirige a `/admin`✅
- [x] Dashboard muestra métricas correctas✅
- [x] Top productos se calcula correctamente✅
- [x] Órdenes pendientes se listan✅
- [x] Aceptar orden actualiza estado✅
- [x] Rechazar orden solicita motivo✅
- [x] Motivo de rechazo se guarda✅
- [x] Filtros de órdenes funcionan✅
- [x] Solo admin/cajero pueden acceder✅
- [x] Usuario sin rol es redirigido
- [x] Sin token redirige a login
- [x] Sidebar es responsive
- [x] Logout limpia sesión

---

## 🎯 Próximos Pasos (FASE 4)

Funcionalidades pendientes para expandir el panel:

1. **Gestión de Productos** (`/admin/productos`)
   - Crear/editar/eliminar productos
   - Subir imágenes
   - Gestionar stock

2. **Gestión de Usuarios** (`/admin/usuarios`)
   - Crear cajeros
   - Ver lista de staff
   - Editar roles

3. **Reportes Avanzados**
   - Gráficos de ventas
   - Filtros por fecha
   - Exportar a PDF/Excel

4. **Notificaciones en tiempo real**
   - WebSockets para nuevas órdenes
   - Sonido de alerta
   - Badge en tab del navegador

---

## 🐛 Problemas Conocidos

Ninguno detectado en testing inicial.

---

## 📝 Notas

- El dashboard calcula métricas en tiempo real
- Las órdenes se procesan inmediatamente
- El rol se guarda en el token JWT
- El sidebar recuerda su estado (abierto/cerrado)
- Todas las fechas se muestran en español (es-AR)

---

## 🎉 Conclusión

La FASE 3 está **100% completa y funcional**. El panel de administración permite gestionar eficientemente las órdenes del negocio con una interfaz moderna y responsiva.

**Impacto**: Ninguno en el sistema actual de clientes. El panel admin es completamente nuevo y separado.
