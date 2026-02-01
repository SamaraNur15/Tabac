# Configuración de Geoapify para Autocompletado de Direcciones

## 🗺️ ¿Qué es Geoapify?

Geoapify es un servicio de geocodificación y mapas que proporciona APIs para autocompletado de direcciones, búsqueda de lugares, geocodificación inversa, y más.

## 🎯 Opciones Disponibles

### Opción 1: Geoapify (Recomendado) ⭐
- **3,000 requests por día** ✅
- Sin tarjeta de crédito requerida
- Respuestas rápidas (sin rate limit)
- Mejor precisión y autocompletado
- Perfecto para proyectos pequeños y medianos

### Opción 2: Nominatim/OSM (Fallback Gratuito)
- **Completamente gratuito** ✅
- Sin necesidad de API Key
- Rate limit: 1 request/segundo ⚠️
- Más lento pero funcional
- **Se usa automáticamente si no tienes API Key**

## 📝 Cómo obtener tu API Key

### Paso 1: Registrarse
1. Ve a: https://www.geoapify.com/
2. Click en "Get Started Free" o "Sign Up"
3. Completa el formulario con:
   - Email
   - Nombre
   - Contraseña

### Paso 2: Verificar Email
1. Revisa tu correo electrónico
2. Click en el link de verificación

### Paso 3: Crear un Proyecto
1. Una vez logueado, ve a "My Projects"
2. Click en "Create a new project"
3. Dale un nombre, ej: "TabacWeb - Direcciones"

### Paso 4: Obtener la API Key
1. Dentro de tu proyecto, ve a "API Keys"
2. Verás tu API Key (algo como: `abc123def456...`)
3. **Cópiala**

### Paso 5: Configurar en el Proyecto
1. Abre el archivo `.env` en la carpeta `frontend-react`
2. Reemplaza `YOUR_API_KEY_HERE` con tu API Key:

```env
VITE_GEOAPIFY_API_KEY=tu_api_key_aqui_abc123def456
```

3. Guarda el archivo
4. **Reinicia el servidor de desarrollo** (Ctrl+C y luego `npm run dev`)

## 🔒 Seguridad

### ⚠️ NO COMPARTIR LA API KEY
- No subas el archivo `.env` a GitHub
- El `.gitignore` ya excluye `.env` por defecto
- Usa `.env.example` para documentar qué variables se necesitan

### 🔐 Restricciones Recomendadas
En el dashboard de Geoapify, puedes restringir tu API Key:

1. Ve a tu proyecto
2. Click en "API Key Settings"
3. Agrega restricciones:
   - **HTTP Referrers**: `localhost:5173`, `tudominio.com`
   - **API restrictions**: Solo "Geocoding API"

## 📊 Monitoreo de Uso

En el dashboard de Geoapify puedes ver:
- Requests por día
- Requests restantes
- Histórico de uso

Si llegas al límite de 3,000/día:
- Considera optimizar (aumentar el debounce)
- O actualizar a un plan de pago

## 🌐 Configuración para San Salvador de Jujuy

El componente ya está configurado con:

```javascript
const lat = -24.1858;  // Latitud de San Salvador de Jujuy
const lon = -65.2995;  // Longitud
const radius = 10000;  // 10km de radio
```

Esto asegura que:
- Las búsquedas priorizan direcciones de Jujuy
- Solo muestra resultados dentro del área
- Respuestas más rápidas y relevantes

## 🚀 Características Implementadas

### Autocompletado Inteligente
- ✅ Búsqueda a partir de 3 caracteres
- ✅ Debounce de 300ms (evita requests innecesarios)
- ✅ Máximo 5 sugerencias
- ✅ Solo calles (no países, provincias, etc.)

### Navegación con Teclado
- ⬆️ **Flecha Arriba**: Navegar hacia arriba
- ⬇️ **Flecha Abajo**: Navegar hacia abajo
- ⏎ **Enter**: Seleccionar dirección resaltada
- **Esc**: Cerrar sugerencias

### Indicadores Visuales
- 📍 Icono de ubicación en cada sugerencia
- ⏳ Spinner mientras carga
- 🔴 Borde rojo si hay error
- 🟠 Resaltado naranja al seleccionar

## 🔧 Troubleshooting

### "No se encontraron direcciones"
- **Causa**: Buscar menos de 3 caracteres o dirección no existe
- **Solución**: Escribe más caracteres o verifica la dirección

### "Error fetching address suggestions"
- **Causa**: API Key inválida o límite alcanzado
- **Solución**: 
  1. Verifica que la API Key esté correcta
  2. Revisa el uso en el dashboard de Geoapify
  3. Asegúrate de haber reiniciado el servidor

### Las sugerencias no aparecen
- **Causa**: Variable de entorno no cargada
- **Solución**: 
  1. Verifica que `.env` tenga `VITE_GEOAPIFY_API_KEY=...`
  2. Reinicia el servidor (`npm run dev`)
  3. Verifica en la consola del navegador si hay errores

### Sugerencias de otras ciudades
- **Causa**: Coordenadas incorrectas
- **Solución**: Ya está configurado para Jujuy, pero si necesitas cambiar:

```javascript
// En AddressAutocomplete.jsx, línea ~52
const lat = -24.1858;  // Tu latitud
const lon = -65.2995;  // Tu longitud
const radius = 10000;  // Radio en metros
```

## 📚 Recursos

- **Documentación**: https://apidocs.geoapify.com/docs/geocoding/
- **Dashboard**: https://myprojects.geoapify.com/
- **Ejemplos**: https://www.geoapify.com/geocoding-api
- **Soporte**: support@geoapify.com

## 🔄 Sistema de Fallback Automático

El componente detecta automáticamente si tienes una API Key válida:

### ✅ CON API Key (Geoapify)
```
Usuario escribe → Debounce 300ms → Geoapify API → 5 sugerencias instantáneas
```

### ⚠️ SIN API Key (Nominatim)
```
Usuario escribe → Debounce 300ms → Nominatim API → 1 segundo de delay → 5 sugerencias
```

**El sistema funciona sin configuración adicional**, pero Geoapify ofrece mejor experiencia de usuario.

## ✅ Checklist de Configuración

### Usando Nominatim (Sin configuración)
- [x] Ya funciona out-of-the-box
- [ ] Probado escribir dirección
- [ ] Sugerencias aparecen (con 1 segundo de delay)

### Usando Geoapify (Recomendado)
- [ ] Cuenta creada en Geoapify
- [ ] Email verificado
- [ ] Proyecto creado
- [ ] API Key obtenida
- [ ] API Key agregada a `.env`
- [ ] Servidor reiniciado
- [ ] Probado escribir dirección
- [ ] Sugerencias aparecen rápidamente
