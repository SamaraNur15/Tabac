# 🧪 Guía de Testing - FASE 6

## Pre-requisitos
1. Backend corriendo en `http://localhost:3000`
2. Frontend corriendo en `http://localhost:5173`
3. MongoDB conectado
4. Usuario admin creado en la base de datos

---

## 🔐 1. Sistema de Autenticación

### Login Admin
- **URL:** http://localhost:5173/login
- **Credenciales:** Tu usuario admin existente
- **Verificar:** Token JWT almacenado en localStorage

---

## 🔔 2. Notificaciones en Tiempo Real

### Probar WebSocket
1. Abrir panel admin en navegador A
2. Crear orden como invitado en navegador B
3. **Verificar:** 
   - Badge de notificaciones se actualiza en navegador A
   - Campana 🔔 muestra contador
   - Click en campana despliega dropdown
   - Notificación muestra: "Nueva Orden #ORD-..."

### Tipos de Notificaciones
- ✅ **Nueva Orden:** Crear orden desde frontend público
- ✅ **Cambio Estado:** Cambiar estado de orden en AdminOrdenesPage
- ✅ **Nueva Reserva:** Crear reserva (si implementado)
- ✅ **Stock Bajo:** Aceptar orden que deje producto con < 10 unidades

### Probar Navegación
- Click en notificación de orden → Debe redirigir a `/admin/ordenes`
- Click en notificación de reserva → Debe redirigir a `/admin/reservas`

---

## 📦 3. AdminOrdenesPage - Gestión de Órdenes

### URL
http://localhost:5173/admin/ordenes

### 3.1 Tabs de Estados
- **Pendientes (⏳):** Ver órdenes nuevas sin procesar
- **En Preparación (👨‍🍳):** Órdenes aceptadas en cocina
- **Listas (✓):** Órdenes terminadas listas para entrega
- **Entregadas (🎉):** Órdenes completadas
- **Rechazadas (❌):** Órdenes rechazadas

### 3.2 Flujo de Estados (Happy Path)
```
Pendiente → Aceptada → En Preparación → Lista → Entregada
```

#### Paso a Paso:
1. Ir a tab **Pendientes**
2. Click botón "✅ Aceptada" en una orden
3. **Verificar:**
   - Modal se abre
   - Muestra estado actual y nuevo
   - Campo notas opcional
4. Confirmar cambio
5. **Verificar:**
   - Toast verde de éxito aparece
   - Orden desaparece de tab Pendientes
   - Timeline de historial se actualiza con nueva entrada
6. Ir a tab **Aceptada**
7. Click "👨‍🍳 En Preparación"
8. Repetir proceso hasta "Entregada"

### 3.3 Validaciones
#### Stock Insuficiente
1. Crear orden con cantidad mayor al stock
2. Intentar aceptar
3. **Verificar:** Toast rojo con mensaje de stock insuficiente

#### Motivo de Rechazo
1. Click "❌ Rechazada" en orden pendiente
2. Dejar campo notas vacío
3. Click Confirmar
4. **Verificar:** Toast error "Debes ingresar un motivo"
5. Escribir motivo y confirmar
6. **Verificar:** Orden rechazada con motivo visible

### 3.4 Timeline de Historial
- **Verificar:** Cada cambio de estado aparece en timeline
- **Verificar:** Muestra usuario, rol, fecha relativa
- **Verificar:** Notas se muestran si existen
- **Verificar:** Marcador de línea temporal visible

### 3.5 Loading States
- **Verificar:** Skeleton cards aparecen al cargar
- **Verificar:** Animación shimmer visible
- **Verificar:** Transición suave a contenido real

---

## 📜 4. AdminHistorialPage - Auditoría

### URL
http://localhost:5173/admin/historial

### 4.1 Estadísticas
- **Total Logs:** Contador de registros
- **Usuarios Activos:** Usuarios que han realizado acciones
- **Tipos de Acciones:** Cantidad de acciones diferentes

### 4.2 Filtros
#### Búsqueda General
1. Escribir "orden" en campo búsqueda
2. **Verificar:** Filtra logs relacionados con órdenes

#### Filtro por Usuario
1. Escribir nombre de usuario
2. **Verificar:** Solo muestra logs de ese usuario

#### Filtro por Acción
1. Seleccionar "cambio_estado_orden"
2. **Verificar:** Solo cambios de estado visibles

#### Filtro por Fechas
1. Seleccionar fecha desde: hace 1 semana
2. Seleccionar fecha hasta: hoy
3. **Verificar:** Solo logs en ese rango

#### Limpiar Filtros
1. Click "🔄 Limpiar Filtros"
2. **Verificar:** Todos los filtros se resetean

### 4.3 Tabla de Logs
- **Columnas:** Fecha, Usuario, Acción, Entidad, Detalles, IP
- **Badges:** Colores según tipo de acción
- **Details:** Click "Ver detalles" muestra JSON expandible

### 4.4 Paginación
1. **Verificar:** Muestra "Página X de Y (Z registros)"
2. Click "Siguiente →"
3. **Verificar:** Carga página 2
4. Click "← Anterior"
5. **Verificar:** Vuelve a página 1
6. **Verificar:** Botones disabled en primera/última página

### 4.5 Exportar CSV
1. Click "📥 Exportar CSV"
2. **Verificar:** Archivo descargado
3. Abrir en Excel
4. **Verificar:** 
   - Encoding UTF-8 correcto (tildes visibles)
   - 7 columnas con headers
   - Datos completos

### 4.6 Updates en Tiempo Real
1. Abrir AdminHistorialPage
2. En otra pestaña, cambiar estado de orden
3. **Verificar:** Tabla se actualiza automáticamente
4. **Verificar:** Estadísticas se actualizan

---

## 🎨 5. UI/UX

### Toasts
- **Verificar:** Aparecen en top-center
- **Verificar:** Duración configurable (2-5 segundos)
- **Verificar:** Colores: verde (éxito), rojo (error), azul (info)
- **Verificar:** Mensaje con emoji adecuado

### Animaciones
- **Verificar:** Modal slide-in suave
- **Verificar:** Hover en botones eleva con sombra
- **Verificar:** Tabs cambian con transición
- **Verificar:** Skeletons con efecto shimmer

### Responsive
#### Desktop (1400px+)
- **Verificar:** Layout completo visible
- **Verificar:** Tabla sin scroll horizontal

#### Tablet (768px-1200px)
- **Verificar:** Tabs con scroll horizontal
- **Verificar:** Timeline adaptado

#### Mobile (< 768px)
- **Verificar:** Botones de filtro en columna
- **Verificar:** Modal footer en columna
- **Verificar:** Tabla con scroll horizontal

---

## 🐛 Casos Edge a Probar

### 1. Sin Órdenes
- Ir a tab con 0 órdenes
- **Verificar:** Mensaje "📦 No hay órdenes..."

### 2. Sin Logs
- Filtrar con criterios que no devuelven resultados
- **Verificar:** Mensaje "📭 No se encontraron registros"

### 3. Conexión WebSocket Perdida
- Detener backend
- **Verificar:** Indicador offline en NotificationCenter
- Reiniciar backend
- **Verificar:** Reconexión automática

### 4. Token Expirado
- Esperar expiración de JWT (si configurado)
- **Verificar:** Redirección a login

### 5. Órdenes Concurrentes
- Dos usuarios aceptando misma orden
- **Verificar:** Solo una acción debe proceder
- **Verificar:** Segunda muestra error

---

## ✅ Checklist Final

### Backend
- [ ] Socket.IO server corriendo
- [ ] Eventos WebSocket emitidos correctamente
- [ ] API `/api/auditoria/*` respondiendo
- [ ] Logs guardados en MongoDB

### Frontend
- [ ] NotificationCenter visible en header
- [ ] Badge contador actualizado
- [ ] AdminOrdenesPage con 5 tabs funcionales
- [ ] Modal de confirmación funcional
- [ ] Timeline visible y completo
- [ ] AdminHistorialPage cargando logs
- [ ] Filtros funcionando
- [ ] Exportar CSV funcional
- [ ] Paginación correcta
- [ ] Toasts apareciendo
- [ ] Skeletons durante loading
- [ ] Responsive en mobile

### Integración
- [ ] Notificaciones llegan en tiempo real
- [ ] Cambios de estado registrados en auditoría
- [ ] historialEstados actualizado
- [ ] Stock decrementado al aceptar orden
- [ ] Logs exportables en CSV

---

## 📊 Métricas de Performance

### Tiempos Esperados
- **Carga inicial AdminOrdenesPage:** < 1s
- **Cambio de tab:** Instantáneo
- **Cambio de estado orden:** < 500ms
- **Llegada notificación WebSocket:** < 100ms
- **Carga AdminHistorialPage:** < 2s
- **Exportar CSV:** < 1s

### Tamaño Bundle
- **react-hot-toast:** ~30KB
- **socket.io-client:** ~200KB

---

## 🚀 Testing en Producción

1. **Configurar CORS** en backend para dominio producción
2. **Actualizar VITE_API_BASE_URL** en `.env`
3. **SSL/TLS** para WebSocket (wss://)
4. **Verificar** que JWT expira en tiempo razonable
5. **Monitorear** logs de auditoría para actividad sospechosa

---

## 📝 Notas

- **Logs de auditoría** son solo lectura, no hay DELETE
- **Exportar CSV** no tiene límite, puede ser pesado con muchos logs
- **WebSocket** se reconecta automáticamente
- **Notificaciones** se guardan solo en memoria (máximo 50)
