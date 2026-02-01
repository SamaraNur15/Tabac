# 🔒 Mejoras de Seguridad Implementadas

## Resumen de Cambios

Se han implementado múltiples capas de seguridad para proteger la aplicación TabacWeb contra las vulnerabilidades detectadas.

---

## ✅ Implementaciones Completadas

### 1. **Autenticación JWT (JSON Web Tokens)**

#### Backend
- ✅ Instalado `jsonwebtoken` para generar y verificar tokens
- ✅ Creado middleware de autenticación en `middleware/auth.js`
- ✅ Implementado `utils/jwt.js` para gestionar tokens
- ✅ Actualizado `/api/auth/login` y `/api/auth/register` para retornar JWT
- ✅ Tokens expiran en 7 días (configurable en `.env`)

#### Frontend
- ✅ Creado `utils/auth.js` para gestionar tokens y autenticación
- ✅ Función `fetchWithAuth()` que agrega automáticamente el token en headers
- ✅ Actualizado `Login.jsx` para guardar token al iniciar sesión
- ✅ Actualizados todos los hooks (`useCart`, `useCartActions`, `useOrden`)
- ✅ Redirección automática a `/login` si el token expira

### 2. **Protección de Variables de Entorno**

- ✅ Agregado `.env` a `.gitignore` (backend y frontend)
- ✅ Creado `.env.example` como plantilla sin credenciales reales
- ✅ Generado JWT_SECRET aleatorio de 128 caracteres
- ✅ **ACCIÓN REQUERIDA**: Cambiar contraseña de MongoDB después del commit

### 3. **Validación de Entrada**

- ✅ Instalado `express-validator`
- ✅ Validación en rutas de autenticación:
  - Email válido y normalizado
  - Contraseña mínimo 6 caracteres
  - Nombre requerido

### 4. **Headers de Seguridad (Helmet)**

- ✅ Instalado y configurado `helmet`
- ✅ Protección contra:
  - Clickjacking (X-Frame-Options)
  - XSS (X-XSS-Protection)
  - MIME sniffing (X-Content-Type-Options)
  - Y más headers de seguridad HTTP

### 5. **Rate Limiting**

- ✅ Instalado `express-rate-limit`
- ✅ Límite general: 100 requests por IP cada 15 minutos
- ✅ Límite de autenticación: 5 intentos cada 15 minutos
- ✅ Protección contra ataques de fuerza bruta

### 6. **CORS Configurado**

- ✅ CORS restrictivo (solo permite origen del frontend)
- ✅ Configurable mediante variable `FRONTEND_URL`

### 7. **Autorización y Permisos**

- ✅ Middleware aplicado a TODAS las rutas protegidas:
  - `/api/carrito/*` → Requiere JWT
  - `/api/ordenes/*` → Requiere JWT
  - `/api/pagos/*` → Requiere JWT
- ✅ Verificación de permisos: usuarios solo acceden a sus propios recursos
- ✅ Respuestas 403 Forbidden si intentan acceder a recursos de otros

### 8. **Mejoras Adicionales**

- ✅ Hash de contraseñas con bcrypt (rounds=12)
- ✅ Eliminación de logs que exponen credenciales
- ✅ Mensajes de error genéricos en autenticación
- ✅ Status HTTP correctos (401 Unauthorized, 403 Forbidden)

---

## 🚀 Configuración Post-Implementación

### Backend

1. **Copiar variables de entorno**:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Configurar .env** con tus credenciales:
   ```env
   MONGO_URI=tu_uri_de_mongodb
   JWT_SECRET=generar_uno_nuevo_con_crypto
   FRONTEND_URL=http://localhost:5173
   ```

3. **Generar JWT_SECRET seguro**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Instalar dependencias** (si no están):
   ```bash
   npm install
   ```

5. **Iniciar servidor**:
   ```bash
   npm start
   ```

### Frontend

1. **Copiar variables de entorno**:
   ```bash
   cd frontend-react
   cp .env.example .env
   ```

2. **Configurar .env**:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Iniciar aplicación**:
   ```bash
   npm run dev
   ```

---

## 🔐 Acciones Críticas Pendientes

### ⚠️ URGENTE - Después del Commit

1. **Cambiar contraseña de MongoDB**:
   - La contraseña actual está en el historial de Git
   - Accede a MongoDB Atlas → Database Access
   - Cambia la contraseña del usuario `SamaraNur`
   - Actualiza `MONGO_URI` en tu `.env` local

2. **Limpiar historial de Git** (opcional pero recomendado):
   ```bash
   # Usar BFG Repo-Cleaner o git filter-branch
   # Esto eliminará el .env del historial
   ```

3. **Rotar JWT_SECRET en producción**:
   - Genera uno nuevo para producción
   - Nunca uses el mismo en dev y prod

---

## 🧪 Testing

### Probar Autenticación JWT

```bash
# 1. Registrarse
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com","password":"123456"}'

# 2. Login (obtendrás un token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# 3. Usar token en request protegido
curl http://localhost:3000/api/carrito/USER_ID \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Probar Rate Limiting

```bash
# Hacer más de 5 intentos de login en 15 minutos
# Deberías recibir error 429 Too Many Requests
```

---

## 📊 Comparación Antes/Después

| Vulnerabilidad | Antes ❌ | Después ✅ |
|----------------|----------|------------|
| Sin autenticación | Cualquiera accede | JWT obligatorio |
| Credenciales expuestas | En Git | Solo en .env local |
| CORS abierto | Todos los orígenes | Solo frontend permitido |
| Sin rate limiting | Fuerza bruta posible | 5 intentos/15 min |
| userId manipulable | En localStorage | Token firmado |
| Sin validación | Datos sin verificar | express-validator |
| Headers inseguros | Por defecto | Helmet configurado |
| Sin permisos | Todos ven todo | Usuarios solo ven lo suyo |

---

## 🔄 Próximos Pasos Recomendados

### Seguridad Adicional (No Implementado Aún)

1. **HTTPS en producción**
   - Usar certificados SSL/TLS
   - Redirigir HTTP → HTTPS

2. **Refresh Tokens**
   - Tokens de corta duración
   - Refresh token para renovar

3. **Sanitización contra NoSQL Injection**
   - Instalar `express-mongo-sanitize`
   - Proteger contra inyección MongoDB

4. **Logging y Monitoreo**
   - Implementar Winston/Morgan
   - Monitorear intentos de acceso no autorizado

5. **CSRF Protection**
   - Agregar tokens CSRF
   - Importante si usas cookies

6. **2FA (Two-Factor Auth)**
   - Autenticación de dos factores
   - Códigos SMS o TOTP

7. **Roles y Permisos**
   - Sistema de roles (admin, usuario)
   - Middleware de autorización por rol

8. **Auditoría**
   - Log de todas las acciones sensibles
   - Registro de cambios en órdenes/pagos

---

## 📞 Soporte

Si encuentras problemas después de implementar estos cambios:

1. Verifica que las variables de entorno estén configuradas
2. Confirma que el token se está enviando en los headers
3. Revisa la consola del navegador para errores
4. Verifica logs del backend

---

## 🎉 Resultado

Tu aplicación ahora tiene:
- ✅ Autenticación robusta con JWT
- ✅ Autorización por usuario
- ✅ Protección contra ataques comunes
- ✅ Variables de entorno seguras
- ✅ Rate limiting contra fuerza bruta
- ✅ Headers de seguridad HTTP
- ✅ Validación de datos de entrada

**¡Tu aplicación es significativamente más segura!** 🛡️
