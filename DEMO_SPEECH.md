# 🎤 Speech para Demo - Tabac Web (Migración a React)

## 📋 Introducción (1 minuto)

**Buenos días/tardes a todos.**

Hoy les voy a presentar **Tabac Web**, un proyecto de e-commerce para un café donde migré una aplicación web completa de JavaScript Vanilla a **React**, implementando arquitectura moderna y mejores prácticas de desarrollo.

El objetivo principal fue transformar una aplicación monolítica en un sistema **escalable, mantenible y con mejor experiencia de usuario**, conservando toda la funcionalidad original y agregando nuevas capacidades.

---

## 🏗️ Arquitectura del Proyecto (2 minutos)

### **Estructura General**
El proyecto está dividido en dos partes principales:

#### **1. Backend - API RESTful con Node.js + Express**
- **Base de datos**: MongoDB con Mongoose como ODM
- **Arquitectura modular**: Separación clara de rutas, modelos y configuración
- **Variables de entorno** para configuración segura

**Modelos principales:**
- `Comida`: Productos del menú (con slugs, categorías, precios)
- `Carrito`: Gestión del carrito de compras por usuario
- `Orden`: Sistema completo de órdenes con número único
- `Usuario`: Gestión de usuarios (autenticación preparada)

#### **2. Frontend - React + Vite**
- **React 19**: Última versión con hooks modernos
- **Vite**: Build tool ultrarrápido con HMR (Hot Module Replacement)
- **React Router**: Navegación SPA sin recargas
- **Context API**: Gestión de estado global para el carrito

---

## 🎯 Características Principales (3 minutos)

### **1. Sistema de Carta/Menú Dinámico**

**Página de Carta (`/carta`):**
- ✅ Carga dinámica de productos desde la API
- ✅ **Filtros por categoría**: Dulce, Salado, Bebidas
- ✅ **Búsqueda en tiempo real** con debouncing (optimización)
- ✅ **Ordenamiento**: Por precio ascendente/descendente, nombre A-Z
- ✅ Tarjetas de producto con imagen, descripción y precio

**Hook personalizado `useMenuData`:**
```javascript
// Gestiona la carga de datos del menú desde el backend
- Estados de loading para UX fluida
- Manejo de errores
- Cleanup automático para evitar memory leaks
```

### **2. Sistema de Carrito Completo**

**Context API (`CartContext`):**
- Gestión de estado global del carrito
- Funciones: `addItem`, `removeItem`, `clear`
- Persistencia durante la sesión

**Funcionalidades:**
- ✅ Agregar productos con cantidad seleccionable
- ✅ Visualización de items con imagen y detalles
- ✅ Modificar cantidades (incrementar/decrementar)
- ✅ Eliminar productos individuales
- ✅ Cálculo automático de subtotales y total
- ✅ Badge en header mostrando cantidad de items

### **3. Proceso de Checkout y Órdenes**

**Flujo completo de compra:**

1. **Carrito** (`/carrito`):
   - Resumen de productos
   - Selector de método de entrega (Retiro/Delivery)
   - Botón "Finalizar Pedido"

2. **Checkout** (`/checkout`):
   - Formulario de contacto (nombre, teléfono, email)
   - Campo de dirección (obligatorio para delivery)
   - Selector de método de pago (Efectivo/Transferencia)
   - Notas adicionales
   - Resumen del pedido con totales

3. **Creación de Orden** (Backend):
   - Generación de número único: `ORD-YYYYMMDD-00001`
   - Cálculo automático de costos de delivery
   - Guardado en base de datos
   - **Limpieza automática del carrito**

4. **Confirmación** (`/orden-confirmada/:numeroOrden`):
   - Página de confirmación con número de orden
   - Detalles del pedido
   - Estado del pedido

---

## 💻 Implementación Técnica (3 minutos)

### **Hooks Personalizados**

He creado varios custom hooks para lógica reutilizable:

**1. `useMenuData`**
```javascript
// Gestiona la carga de productos desde la API
- Control de ciclo de vida (cleanup)
- Estado de loading
```

**2. `useCart`**
```javascript
// Acceso al carrito desde el Context
- Simplifica el consumo del CartContext
```

**3. `useCartActions`**
```javascript
// Acciones complejas del carrito
- addToCart: Agrega items al backend y context
- getCartCount: Obtiene cantidad de items
- Manejo de estados de loading
```

**4. `useDebouncedValue`**
```javascript
// Optimización de búsqueda
- Retrasa la ejecución de búsquedas
- Evita requests innecesarios al backend
```

**5. `useOrden`**
```javascript
// Gestión de órdenes
- crearOrden: POST al backend
- Limpia carrito después de crear orden
- Manejo de errores
```

### **Componentes Modulares**

**Arquitectura de componentes:**
```
src/
├── comoponents/
│   ├── Layout/         # Header, Footer, Layout principal
│   ├── Home/           # Secciones del homepage
│   ├── Carta/          # Sistema de menú
│   ├── Cart/           # Componentes del carrito
│   └── Ui/             # Componentes reutilizables
├── Pages/              # Páginas principales
├── context/            # Context API
└── Hooks/              # Custom hooks
```

**Ventajas:**
- Componentes pequeños y enfocados
- Fácil mantenimiento
- Reutilización de código
- Testing más sencillo

### **Backend Robusto**

**Endpoints principales:**
```javascript
// Comidas
GET    /api/comidas          # Listado de productos
GET    /api/comidas/:id      # Producto individual

// Carrito
GET    /api/carrito/:userId  # Obtener carrito
POST   /api/carrito/add      # Agregar item
DELETE /api/carrito/:userId/:productoId  # Eliminar item

// Órdenes
POST   /api/ordenes          # Crear orden
GET    /api/ordenes/numero/:numero  # Buscar por número
GET    /api/ordenes/user/:userId    # Órdenes del usuario
PATCH  /api/ordenes/:id/estado      # Actualizar estado
```

**Modelo de Orden completo:**
- Número único autogenerado
- Items con snapshot de precios
- Información de entrega
- Totales detallados (subtotal, descuentos, delivery)
- Estados: creada, pagada, cancelada
- Información de pago

---

## 🔄 Mejoras vs Versión Vanilla (2 minutos)

### **Antes (Vanilla JavaScript):**
- ❌ Manipulación directa del DOM
- ❌ Código acoplado y difícil de mantener
- ❌ Sin gestión de estado centralizada
- ❌ Recargas completas de página
- ❌ Difícil testing
- ❌ Código repetitivo

### **Ahora (React):**
- ✅ **Componentes reutilizables** y modulares
- ✅ **Virtual DOM** para renderizado eficiente
- ✅ **Context API** para estado global
- ✅ **SPA con React Router** (navegación sin recargas)
- ✅ **Hooks personalizados** para lógica compartida
- ✅ **Código declarativo** y más legible
- ✅ **Dev tools** y debugging mejorado
- ✅ **Hot Module Replacement** (cambios en tiempo real)

---

## 🎨 Experiencia de Usuario (1 minuto)

### **Optimizaciones implementadas:**

1. **Performance:**
   - Debouncing en búsquedas (200ms)
   - Lazy loading de imágenes
   - Memoización con `useMemo`
   - Optimización de re-renders

2. **UX/UI:**
   - Feedback visual inmediato (loading states)
   - Badge del carrito actualizado en tiempo real
   - Mensajes de confirmación
   - Manejo elegante de errores
   - Navegación fluida sin recargas

3. **Accesibilidad:**
   - Formularios con validaciones
   - Labels correctamente asociados
   - Estados de error claros

---

## 🚀 Demo en Vivo (5 minutos)

**Ahora les mostraré la aplicación funcionando:**

### **1. Homepage**
- Banner promocional
- Call-to-action a la carta
- Sección de FAQs
- Footer con información de contacto

### **2. Carta de Productos**
- Mostrar filtro por categorías
- Demostrar búsqueda en tiempo real
- Ordenar por precio
- Agregar productos al carrito

### **3. Carrito de Compras**
- Ver items agregados
- Modificar cantidades
- Eliminar productos
- Ver badge actualizado en header

### **4. Proceso de Checkout**
- Seleccionar método de entrega
- Llenar formulario
- Ver resumen del pedido
- Confirmar orden

### **5. Confirmación**
- Ver número de orden generado
- Mostrar detalles del pedido

---

## 🛠️ Tecnologías Utilizadas

### **Frontend:**
- React 19.1.1
- React Router DOM
- Vite 7.1.7
- ESLint
- CSS modular

### **Backend:**
- Node.js + Express 5.1.0
- MongoDB + Mongoose 8.17.1
- CORS
- dotenv
- Nodemon

---

## 📈 Próximos Pasos y Mejoras Futuras

1. **Autenticación completa:**
   - Login/Registro funcional
   - JWT tokens
   - Sesiones persistentes

2. **Pasarela de pago:**
   - Integración con MercadoPago/Stripe
   - Pagos en línea

3. **Panel de administración:**
   - Gestión de productos
   - Seguimiento de órdenes
   - Estadísticas de ventas

4. **Notificaciones:**
   - Email de confirmación
   - WhatsApp API para actualizaciones

5. **PWA:**
   - Funcionalidad offline
   - Instalable en dispositivos móviles

6. **Testing:**
   - Jest para unit tests
   - React Testing Library
   - E2E con Cypress

---

## 🎯 Conclusiones

### **Logros del proyecto:**

✅ **Migración exitosa** de vanilla JS a React manteniendo funcionalidad  
✅ **Arquitectura escalable** con separación de responsabilidades  
✅ **API RESTful completa** y documentada  
✅ **Sistema de órdenes funcional** de principio a fin  
✅ **Código mantenible** con componentes modulares  
✅ **Mejoras significativas en UX/UI**  

### **Aprendizajes clave:**

- Diseño de arquitecturas React escalables
- Implementación de Context API para estado global
- Creación de custom hooks reutilizables
- Backend con Node.js y MongoDB
- Flujo completo de e-commerce

---

## ❓ Preguntas

**¡Muchas gracias por su atención!**  
**Estoy disponible para responder cualquier pregunta.**

---

## 📝 Datos Técnicos de Referencia

### **Comandos para ejecutar el proyecto:**

**Backend:**
```bash
cd backend
npm install
npm start
# Servidor en http://localhost:3000
```

**Frontend:**
```bash
cd frontend-react
npm install
npm run dev
# Aplicación en http://localhost:5173
```

### **Variables de entorno necesarias:**

**backend/.env:**
```
MONGO_URI=mongodb://localhost:27017
MONGO_DB=tabacweb
PORT=3000
DELIVERY_MIN_FREE=12000
DELIVERY_FEE=1200
```

**frontend-react/.env:**
```
VITE_API_URL=http://localhost:3000
```

---

## 💡 Tips para la Presentación

1. **Antes de presentar:**
   - Asegúrate de que MongoDB esté corriendo
   - Inicia el backend primero
   - Luego inicia el frontend
   - Ten algunos productos ya agregados en la BD

2. **Durante la demo:**
   - Muestra el código de un hook personalizado
   - Explica el flujo de datos en el carrito
   - Demuestra la búsqueda en tiempo real
   - Completa una orden de principio a fin

3. **Destaca:**
   - La modularidad del código
   - La facilidad de mantenimiento
   - La mejora en performance vs vanilla JS
   - El sistema de órdenes automático

4. **Mantén a mano:**
   - Chrome DevTools (Network, React DevTools)
   - MongoDB Compass para mostrar la BD
   - VS Code con el código abierto

¡Éxito en tu presentación! 🚀
